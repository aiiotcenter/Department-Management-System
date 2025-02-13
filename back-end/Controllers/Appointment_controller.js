//================================================================================================================================================================
//?  Importing the database connection
//================================================================================================================================================================
const database = require('../Database_connection');

//================================================================================================================================================================
//? POST, function that create appointments
//================================================================================================================================================================

const create_appointment = async (req, res) => {
    const {appointment_approver_id, visit_purpose, visit_date, visit_time, comments} = req.body;

    try{
        // check user filled all information
        if ( !appointment_approver_id || !visit_purpose || !visit_date || !visit_time ) {
            console.log('Some information for the Appointment is missing')
            return res.status(400).json({ message: 'Fill all information please' });
        };        
        // generate the appointment id
        const appointment_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
        const default_comment = comments ? comments : ""; // if the user didn't have comment, then we keep the field empty

        database.query('INSERT INTO appointments (Appointment_ID, Appointment_Requester_id, Appointment_Approver_ID, Visit_purpose, Visit_date, Visit_time, Status, Comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [appointment_id,
             req.user.id, // get the user_id from the token
             appointment_approver_id, 
             visit_purpose, 
             visit_date, 
             visit_time, 
             "waiting", 
             default_comment], (error, results) => {
                if (error) {
                    console.log("Database Error occurred while adding appointment: ", error);
                    return res.status(500).json({ message: 'Database error', error });
                }
                console.log(`New Appointment was created. Appointment Requester: ${req.user.id} , Appointment Approver: ${appointment_approver_id}`);
                return res.status(201).json({message: `New Appointment was created. Appointment Requester: ${req.user.id} , Appointment Approver: ${appointment_approver_id}`})
            });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error, please try again' , error});
    }
    
};


//================================================================================================================================================================
//? GET, function to review waiting appointments
//================================================================================================================================================================

const view_appointment = (req, res) => {
    const waiting_appointments =  database.query('SELECT * FROM appointments WHERE Status = ?  AND Appointment_Approver_ID = ?',["waiting", req.user.id], (error, results) => {
    if(error){
        console.log(`Database error occured while view the waiting appointments : ${error}`);
        return res.status(500).json({ message: 'Database error' , error});
    }
    if(results.length === 0 ){
        return res.json({ message: 'No waiting Appointments exists' })
    }
    return res.json(results);  
    });
};



//================================================================================================================================================================
//? PATCH, function to update appointments status 
//================================================================================================================================================================

const update_appointment = async (req, res) => {
    const { Appointment_ID, status, QRcode_ID, User_ID, Visit_purpose, QRcode_Expiry_date, QRcode_path } = req.body;

    // check required fields
    if (!Appointment_ID || !status) {
        return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    }

    const connection = await database.promise().getConnection(); // Get a connection from the pool

    try {
        // Start a transaction
        await connection.beginTransaction();

        let response_message;

        // If the status is 'Approved', insert QR code data --------------------------------------------------------------------------------------------------
        if (status === 'Approved') {
            //TODO: function to Generate the qr code 
            // check QR code data
            if (!QRcode_ID || !User_ID || !Visit_purpose || !QRcode_Expiry_date || !QRcode_path) {
                console.log('Missing QR code data')
                return res.status(400).json({ message: 'Error Occured, Missing QR Code data' });
            }

            // Insert QR Code data
            await connection.query(
                'INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)',
                [QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path]
            );

            response_message = 'Appointment was Approved & QR Code was generated';
        // if the appointment was regjected --------------------------------------------------------------------------------------------------------------------
        } else {
            response_message = 'Appointment was Declined';
        }
        //______________________________________________________________________________________________________________________________

        // Update appointment status 
        await connection.query(
            'UPDATE appointments SET Status = ? WHERE Appointment_ID = ?',
            [status, Appointment_ID]
        );

        // use 'commit' that will commit the transaction only if both operations succeed
        await connection.commit();
        console.log(response_message)
        return res.json({ message: response_message });

    } catch (error) {
        await connection.rollback();//'rollback' will be used to prevent incomplete commits (like either only the status is updated or the qr code data is stroed in db)

        console.error('Error occurred while updating appointment status :', error );
        return res.status(500).json({ message: 'Error occurred while updating appointment status ', error });

    } finally {
        connection.release();// Release the connection back to the pool(so it can be reused)
    }
};


//================================================================================================================================================================
module.exports.create_appointment = create_appointment;
module.exports.view_appointment = view_appointment;
module.exports.update_appointment = update_appointment;