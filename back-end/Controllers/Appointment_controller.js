//================================================================================================================================================================
//?  Importing the database connection & function to send emails to the admins
//================================================================================================================================================================
const database = require('../Database_connection');

const GenerateQrCode = require('./GenerateQrCode'); // Import from controllers folder
const path = require ('path');

const fetch_admins_and_send_emails = require('./emails_sender');

//================================================================================================================================================================
//? POST, function that create appointments
//================================================================================================================================================================

const create_appointment = async (req, res) => {
    const { appointment_approver_id, visit_purpose, visit_date, visit_time, comments } = req.body;

    try {
        // Check if all required fields are provided
        if (!appointment_approver_id || !visit_purpose || !visit_date || !visit_time) {
            console.log('Some information for the appointment is missing');
            return res.status(400).json({ message: 'Fill all information please' });
        }

        // Generate a unique appointment ID using UUID
        const appointment_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
        const default_comment = comments || ""; // Use an empty string if no comments are provided

        // Use async/await to execute the database query
        await database.query(
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
            return res.json({message: 'Appointment submitted and admins was notified'});


        } catch(error){
            console.log("Something went wrong while sending emails to the admins: ", error);
            return res.json({message: `Something went wrong while sending emails to the admins: ${error}`});
        }

        
      //-------------------------------------------------------------------------------------------------------------

    } catch (error) {
        console.error('Database error occurred while adding appointment:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
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
//? PATCH, function to update appointments status 
//================================================================================================================================================================

const update_appointment = async (req, res) => {
    const { Appointment_ID, status, User_ID, Visit_purpose, QRcode_Expiry_date } = req.body;

    // check required fields
    if (!Appointment_ID || !status) {
        return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    };

    const connection = await database.getConnection(); // Get a connection from the pool

    try {
        // Start a transaction
        await connection.beginTransaction();

        let response_message;
        let QRcode_ID, QRcode_path;
        //___________________________________________________________________________________________________________________________________________________________
        
        // If the status is 'Approved', insert QR code data --------------------------------------------------------------------------------------------------
        if (status === 'Approved') {
            // check QR code data
            if (!User_ID || !Visit_purpose || !QRcode_Expiry_date ) {
                console.log('Missing QR code data')
                return res.status(400).json({ message: 'Error Occured, Missing QR Code data' });
            };
            //_______________________________________________________________________________________________________________________________________________________
           // Check if Appointment_ID and User_ID exist in database and their is match between them
            
            const [appointment_check] = await connection.query(
                `SELECT Appointment_ID FROM appointments WHERE Appointment_ID = ? AND Appointment_Requester_ID = ? `,
                [Appointment_ID, User_ID]
            );

            //if no appointment found in database with these data or no matches between appointment id and user id then stop the process 
            // (here we will generate qr code for failure case, so line 157 will stop the process of updating the status since no qr was generated)
            if (appointment_check.length === 0) {
                await connection.rollback();
                console.log(`No appointments found with the provided data`);
                return res.status(404).json({message : 'No appointments found with the provided data'})
            };
            //_______________________________________________________________________________________________________________________________________________________
            // check if the approver for that appointment is the same admin updating the status (if not stop the process of updating the status operation)
            const [admin_check] = await connection.query(
                'SELECT Appointment_Approver_ID FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
            );
            //if the Appointment_Approver_ID in database was different that the id for the admine trying to update the status, then stop the operation 
            if (String(admin_check[0].Appointment_Approver_ID) !== String(req.user.id)){
                await connection.rollback();
                console.log(admin_check, " this is admine check");
                console.log(req.user.id , " this is tokent id ");
                console.log('You are not authorized to update this appoiontment');
                return res.status(404).json({message: 'You are not authorized to update this appointment'})
            };

            //_______________________________________________________________________________________________________________________________________________________

            // generate qrcode id and prepare the path
            QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            QRcode_path = path.join(__dirname,'../QRcodes', `${QRcode_ID}.png`); // Save QR code in QRcodes folder

            // generate QR Code
            await GenerateQrCode({ User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date }, QRcode_ID);

            // Insert QR Code data into the database
            const [result] = await connection.query(
                `INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)`,
                [QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path]
            );

            if(result.affectedRows == 0){
                console.log('Database Error occured while inserting QRcode data');
                return res.json({message:'Database Error occured while inserting QRcode data' })

            }


            response_message = 'Appointment was Approved & QR Code was generated';
        //___________________________________________________________________________________________________________________________________________________________

        // if the appointment was regjected --------------------------------------------------------------------------------------------------------------------
        } else {
            // Check if Appointment_ID and User_ID exist in database and their is match between them
            
            const [appointment_check] = await connection.query(
                `SELECT Appointment_ID FROM appointments WHERE Appointment_ID = ? AND Appointment_Requester_ID = ? `,
                [Appointment_ID, User_ID]
            );

            //if no appointment found in database with these data or no matches between appointment id and user id then stop the process 
            // (here we will generate qr code for failure case, so line 157 will stop the process of updating the status since no qr was generated)
            if (appointment_check.length === 0) {
                await connection.rollback();
                console.log(`No appointments found with the provided data`);
                return res.status(404).json({message : 'No appointments found with the provided data'})
            };
            //__________________________________________________________________________________________________
            // check if the approver for that appointment is the same admin updating the status (if not stop the process of updating the status operation)

            const [admin_check] = await connection.query(
                'SELECT Appointment_Approver_ID FROM appointments WHERE Appointment_ID = ?',[Appointment_ID]
            );
            if (String(admin_check[0].Appointment_Approver_ID) !== String(req.user.id)){
                await connection.rollback();
                
                console.log('You are not authorized to update this appoiontment');
                return res.status(404).json({message: 'You are not authorized to update this appointment'})
            };

            response_message = 'Appointment was Declined';
        }
        //______________________________________________________________________________________________________________________________________________________
        // after knowing what is the new status of the appointment and implementing some procedures we should do the following:
        
        const [appointment]= await connection.query(
            'UPDATE appointments SET Status = ? WHERE Appointment_ID = ?',
            [status, Appointment_ID]
        );
      
        // check if the new status of appointment was updated , if not that means the provided data is wrong(probaly the Appointment_ID in declined case, because approved already have somethign to check the validation )
        if (appointment.affectedRows === 0){
            console.log(`Status was not updated! No appointments found wiht this ID : ${Appointment_ID}`);
            await connection.rollback();
            return res.status(404).json({message : `Status was not updated! No Appointment was not found With this ID : ${Appointment_ID}`})
        };
        // ______________________________________________________________________________________________________________________________________________________
        
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