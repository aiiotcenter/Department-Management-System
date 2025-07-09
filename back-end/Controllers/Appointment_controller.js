//================================================================================================================================================================
//?  Importing the database connection & function to send emails to the admins
//================================================================================================================================================================
const database = require('../Database_connection');

const GenerateQrCode = require('./GenerateQrCode'); // Import from controllers folder
const path = require ('path');

const {fetch_admins_and_send_emails} = require('./emails_sender');
const {notify_student} = require('./emails_sender');
// const { stringify } = require('querystring');

//================================================================================================================================================================
//? POST, function that create appointments
//================================================================================================================================================================

const create_appointment = async (req, res) => {
    const { appointment_approver_id, visit_purpose, visit_date, visit_time, comments } = req.body;

    const connection = await database.getConnection(); // Get a connection from the pool   
        

    try {
        // Start a transaction
        await connection.beginTransaction();

        // Check if all required fields are provided
        if (!appointment_approver_id || !visit_purpose || !visit_date || !visit_time) {
            console.log('Some information for the appointment is missing');
            return res.status(400).json({ message: 'Fill all information please' });
        }

        // Generate a unique appointment ID using User_ID
        const appointment_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
        const default_comment = comments || ""; // Use an empty string if no comments are provided

        // Use async/await to execute the database query
        await connection.query(
            'INSERT INTO appointments (Appointment_ID, Appointment_Requester_id, Appointment_Approver_ID, Visit_purpose, Visit_date, Visit_time, Status, Comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [appointment_id, req.user.id, appointment_approver_id, visit_purpose, visit_date, visit_time, "waiting", default_comment]
        );

        console.log(`New Appointment created. Requester: ${req.user.id}, Approver: ${appointment_approver_id}`);

        //-------------------------------------------------------------------------------------------------------------
        // send email to the admins notifiying then with the new submission


        try{
            // in our system appointemnt is desired with specific admin, so we only send email to him 
            // to do so, we need the email address of the approver, get it from the database 
            const [approver] = await database.query('SELECT Email_address FROM users WHERE User_ID = ?',[appointment_approver_id]);
            const approver_email = approver[0].Email_address;
            console.log("this is approver", approver,"\n this is approver email ", approver_email);

            fetch_admins_and_send_emails("Appointment", req.user.name, approver_email);

            console.log('Appointment submitted and admins was notified');
            


        } catch(error){
            await connection.rollback();
            console.log("Something went wrong while sending emails to the admins: ", error);
            return res.json({message: `Something went wrong while sending emails to the admins: ${error}`});
        }

        // use 'commit' that will commit the transaction only if all operations succeed
        await connection.commit();
        return res.json({message: 'Appointment submitted and admins was notified'});

        
      //-------------------------------------------------------------------------------------------------------------

    } catch (error) {
        await connection.rollback();
        console.error('Database error occurred while adding appointment:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    } finally {
        connection.release();// Release the connection back to the pool(so it can be reused)
    }
};

//================================================================================================================================================================
//? GET, function to review waiting appointments
//================================================================================================================================================================
const view_appointment = async (req, res) => {
    try {
        const [results] = await database.query(
            'SELECT * FROM appointments WHERE Status = ? AND Appointment_Approver_ID = ?',
            ["waiting", req.user.id]
        );

        if (results.length === 0) {
            return res.json({ message: 'No waiting appointments exist' });
        }

        return res.json(results);
    } catch (error) {
        console.log('Database Error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};

//================================================================================================================================================================
//? GET, function to review appointments for the logged-in student
//================================================================================================================================================================
const view_student_appointments = async (req, res) => {
    try {
        const [results] = await database.query(
            `SELECT a.*, q.QRcode_ID FROM appointments a 
             LEFT JOIN qr_codes q ON a.Appointment_ID = q.Appointment_ID 
             AND a.Status = 'Approved' 
             WHERE a.Appointment_Requester_id = ?`,
            [req.user.id]
        );
        if (results.length === 0) {
            return res.json([]); // Return empty array if no appointments
        }
        return res.json(results);
    } catch (error) {
        console.log('Database Error:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};

//================================================================================================================================================================
//? PATCH, function to update appointments status 
//================================================================================================================================================================

const update_appointment = async (req, res) => {
    const { Appointment_ID, status, QRcode_Expiry_date } = req.body;

    // check required fields
    if (!Appointment_ID || !status) {
        return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    };

    //check if the appointment already exists in the database or it does not exists ------------------------
    const [check_existence] = await database.query(
        'SELECT * FROM appointments WHERE Appointment_ID = ?',
        [Appointment_ID]
    );

    if (check_existence[0] == undefined){
        console.log(`Sorry! no appointments found with this id : ${Appointment_ID}`);
        return res.status(404).json({message: `Sorry! no appointments found with this id : ${Appointment_ID}`})
    };
    console.log(check_existence[0]);
    console.log("======================================================--")
    //----------------------------------------------------------------------------------------------------------
    const connection = await database.getConnection(); // Get a connection from the pool

    try {
        // Start a transaction
        await connection.beginTransaction();

        // get the user_id from the appointment_id 
        const [get_user_id] = await database.query(
            'SELECT Appointment_Requester_ID FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
        );
        let user_id = get_user_id[0].Appointment_Requester_ID;

        let response_message, QRcode_ID, QRcode_path;
        
        //===========================================================================================================================
        
        // If the status is 'Approved', insert QR code data --------------------------------------------------------------------------------------------------
        if (status === 'Approved') {
            // check QR code data
            if ( !QRcode_Expiry_date ) {
                console.log('Missing QR code data')
                return res.status(400).json({ message: 'Error Occured, Missing QR Code data' });
            };

            // get the purpose of the entry from the EntryRequest_ID 
            const [get_purpose] = await database.query(
                'SELECT Visit_purpose FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
            );
            let purpose_of_appointment = get_purpose[0].Visit_purpose;

            // ___________________________________________________________________________________________________________________________________________________________
        
            // check if the approver for that appointment is the same admin updating the status (if not stop the process of updating the status operation)
            const [admin_check] = await connection.query(
                'SELECT Appointment_Approver_ID FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
            );
            //if the Appointment_Approver_ID in database was different that the id for the admine trying to update the status, then stop the operation 
            if (String(admin_check[0].Appointment_Approver_ID) !== String(req.user.id)){
                await connection.rollback();

                // console.log(admin_check, " this is admine check");// tests
                // console.log(req.user.id , " this is tokent id ");

                console.log('You are not authorized to update this appoiontment');
                return res.status(404).json({message: 'You are not authorized to update this appointment'})
            };

            //_______________________________________________________________________________________________________________________________________________________
            //TODO/ Generating and storing QR code

            // generate qrcode id and prepare the path
            QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            QRcode_path = path.join(__dirname,'../QRcodes', `${QRcode_ID}.png`); // Save QR code in QRcodes folder

            // generate QR Code
            await GenerateQrCode({ user_id, purpose_of_appointment, Appointment_ID, QRcode_Expiry_date }, QRcode_ID);

            // Insert QR Code data into the database
            const [result] = await connection.query(
                `INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)`,
                [QRcode_ID, user_id, purpose_of_appointment, Appointment_ID, QRcode_Expiry_date, QRcode_path]
            );

            if(result.affectedRows == 0){
                console.log('Database Error occured while inserting QRcode data');
                return res.json({message:'Database Error occured while inserting QRcode data' })

            }


            response_message = 'Appointment was Approved & QR Code was generated';
        //__________________________________________________________________________________________________________________________________________________________

        // if the appointment was rejected --------------------------------------------------------------------------------------------------------------------
        } else {
            // check if the approver for that appointment is the same admin updating the status (if not stop the process of updating the status operation)

            const [admin_check] = await connection.query(
                'SELECT Appointment_Approver_ID FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
            );
            if (String(admin_check[0].Appointment_Approver_ID) !== String(req.user.id)){
                await connection.rollback();
                
                console.log('You are not authorized to update this appoiontment');
            };

            response_message = 'Appointment was Declined';

        }
        
        //===========================================================================================================================================
        // after knowing what is the new status of the appointment and implementing some procedures we should do the following:
        
        // update the status of the appointment in the database
        const [appointment]= await connection.query(
            'UPDATE appointments SET Status = ? WHERE Appointment_ID = ?',
            [status, Appointment_ID]
        );
      
        // check if the new status of appointment was updated 
        if (appointment.affectedRows === 0){
            console.log(`Status was not updated! No appointments found wiht this ID : ${Appointment_ID}`);
            await connection.rollback();
            return res.status(404).json({message : `Status was not updated! No Appointment was not found With this ID : ${Appointment_ID}`})
        };



        // --------------------------------------------------------------------------------------
        //TODO/ Notify student
        
        // notify the student about new status updated
            try{
            
                const [student] = await database.query('SELECT Email_address FROM users WHERE User_ID = ?',[user_id]);
                const studnet_email = student[0].Email_address;

                const [approver] = await database.query('SELECT User_name FROM users WHERE User_ID = ?',[req.user.id]); //get the name of the teacher how approved the appointment (which is the teacher the student want to meet)
                const approver_name = approver[0].User_name;

                notify_student("Appointment", status, studnet_email, approver_name, String(QRcode_path));

                console.log('studnet was notified');

            } catch(error){
                console.log("Something went wrong while sending email to the student: ", error);
                await connection.rollback();
                return res.json({message: `Something went wrong while sending email to the student: ${error}`});
            }
        // ====================================================================================================================================
        
        // use 'commit' that will commit the transaction only if both operations succeed (QR was generated and status was updated)
        await connection.commit();
        console.log(response_message)
        return res.json({ message: response_message });



    } catch (error) {
        await connection.rollback();//'rollback' will be used to prevent incomplete commits (like either only the status is updated or the qr code data is stroed in db)

        console.error('Error occurred while updating appointment status :', error );
        return res.status(500).json({ message: 'Error occurred while updating appointment status ', error: error.message });

    } finally {
        connection.release();// Release the connection back to the pool(so it can be reused)
    }
};


//================================================================================================================================================================
module.exports.create_appointment = create_appointment;
module.exports.view_appointment = view_appointment;
module.exports.update_appointment = update_appointment;
module.exports.view_student_appointments = view_student_appointments;