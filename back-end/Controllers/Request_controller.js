//===============================================================================================================
//?  Importing the database connection & function to send emails to the admins
//===============================================================================================================
const database = require('../Database_connection');

const fetch_admins_and_send_emails = require('./emails_sender');

//=======================================================================================================
//? POST,  function that create requests
//=======================================================================================================
const create_request = async (req, res) => {
    const { entry_approver_id, entry_purpose, entry_date, entry_time } = req.body;

    try {
        if (!entry_approver_id || !entry_purpose || !entry_date || !entry_time) {
            console.log('Some information for the Entry Request is missing');
            return res.status(400).json({ message: 'Fill all information please' });
        }

        // Generate the request ID
        const EntryRequest_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");

        await database.query(
            'INSERT INTO entry_requests (EntryRequest_id, Entry_Requester_id, Entry_Approver_id, Entry_purpose, Entry_date, Entry_time, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [EntryRequest_id, req.user.id, entry_approver_id, entry_purpose, entry_date, entry_time, "waiting"]
        );

        console.log(`New Request was created. Entry Requester: ${req.user.id}, Entry Approver: ${entry_approver_id}`);

        //-------------------------------------------------------------------------------------------------------------
        // send email to the admins notifiying then with the new submission
        try{
            fetch_admins_and_send_emails("Entry Request", req.user.name);

            console.log('Entry Request submitted and admins was notified');
            return res.json({message: 'Entry Request submitted and admins was notified'});


        } catch(error){
            console.log("Something went wrong while sending emails to the admins: ", error);
            return res.json({message: `Something went wrong while sending emails to the admins: ${error}`});
        }

        
      //-------------------------------------------------------------------------------------------------------------

    } catch (error) {
        console.log('Server error, please try again', error);
        return res.status(500).json({ message: 'Server error, please try again', error: error.message });
    }
};


//=============================================================================================================================
//? GET,  function to review Waiting requests
//=======================================================================================================
const view_requests = async (req, res) => {
    try {
        const [waiting_requests] = await database.query(
            'SELECT * FROM entry_requests WHERE Status = ? AND Entry_Approver_ID = ?',
            ["waiting", req.user.id]
        );

        if (waiting_requests.length === 0) {
            return res.json({ message: 'No waiting Requests exist' });
        }

        return res.json(waiting_requests);
    } catch (error) {
        console.log('Database Error', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};
//=============================================================================================================================
//? PATCH, function to update request status 
//=======================================================================================================
const GenerateQrCode = require('./GenerateQrCode'); // Import from Controllers folder
const path = require ('path');

const update_request = async (req, res) => {
    const {EntryRequest_ID, status, User_ID, Visit_purpose, QRcode_Expiry_date  } = req.body;// will be taken from the front-end
    
    // check required fields
    if (!EntryRequest_ID || !status) {
            return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    };

    const connection = await database.getConnection(); // Get a connection from the pool

    try{    
        // Start a transaction
        await connection.beginTransaction();
        
        let response_message;
        let QRcode_ID, QRcode_path;
        // _________________________________________________________________________________________________________________________________________________________________


        // If the status is 'Approved', insert QR code data --------------------------------------------------------------------------------------------------
        if (status == 'Approved'){
            
            // check QR code data 
            if ( !User_ID || !Visit_purpose || !QRcode_Expiry_date ) {
                console.log('Missing QR Code data')
                return res.json({messagee: 'Error Occured, Missing QR Code data'})
            }

            //_______________________________________________________________________________________________________________________________________________________
           // Check if EntryRequest_ID and User_ID exist in database and their is match between them
            
            const [request_check] = await connection.query(
                'SELECT EntryRequest_ID FROM entry_requests WHERE EntryRequest_ID = ? AND Entry_Requester_ID = ?',
                [EntryRequest_ID, User_ID]
            );

            //if no request found in database with these data or no matches between reques id and user id then stop the process
            // (here we will generate qr code for failure case, so line 157 will stop the process of updating the status since no qr was generated)
            if (request_check.length === 0){
                await connection.rollback();
                console.log(`No Entry Requests found with the provided data, please check your data again!`);
                return res.status(404).json({message : 'No Entry Requests found with the provided data, please check your data again!'})
            };

            //_______________________________________________________________________________________________________________________________________________________
            // check if the approver for that Entry request is the same admin updating the status (if not stop the process of updating the status operation)
            const [admin_check] = await connection.query(
                'SELECT Entry_Approver_ID FROM entry_requests WHERE EntryRequest_ID = ?',[EntryRequest_ID]
            );
            //if the Entry_Approver_ID in database was different that the id for the admine trying to update the status, then stop the operation 
            if (String(admin_check[0].Entry_Approver_ID) !== String(req.user.id)){

                await connection.rollback();
                console.log('You are not authorized to update this Entry Request');
                return res.status(404).json({message: 'You are not authorized to update this Entry Request'})
            };

            //_______________________________________________________________________________________________________________________________________________________
            // generate qrcode ID and prepare the path
            QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            QRcode_path = path.join(__dirname,'../QRcodes', `${QRcode_ID}.png`); // Save QR code in QRcodes folder
            
            // generate QR Code
            await GenerateQrCode({ User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date }, QRcode_ID);
            
            // Insert QR Code data into the database
            const [results] = await connection.query(
                'INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)',
                [QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path, EntryRequest_ID, User_ID]
            );

            if (results.affectedRows == 0){
                console.log('Database Error occured while inserting QRcode data');
                return res.json({message:'Database Error occured while inserting QRcode data' })
            }
            response_message = 'Entry Request was Approved & QR Code was generated';
        // ___________________________________________________________________________________________________________________________________________________________   
        // if the entry request was regjected --------------------------------------------------------------------------------------------------------------------
        } else {
            // Check if Entry_ID and User_ID exist in database and their is match between them
            const [request_check] = await connection.query(
                `SELECT EntryRequest_ID FROM entry_requests WHERE EntryRequest_ID = ? AND Entry_Requester_ID = ? `,
                [EntryRequest_ID, User_ID]
            );

            //if no Entry Request found in database with these data or no matches between EntryRequest_ID and user id then stop the process 
            // (here we will generate qr code for failure case, so line 157 will stop the process of updating the status since no qr was generated)
            if (request_check.length === 0) {
                await connection.rollback();
                console.log(`No entry requests found with the provided data`);
                return res.status(404).json({message : 'No entry requests found with the provided data'})
            };
            //__________________________________________________________________________________________________
            // check if the approver for that appointment is the same admin updating the status (if not stop the process of updating the status operation)

            const [admin_check] = await connection.query(
                'SELECT Entry_Approver_ID FROM entry_requests WHERE EntryRequest_ID = ?',[EntryRequest_ID]
            );
            if (String(admin_check[0].Entry_Approver_ID) !== String(req.user.id)){
                await connection.rollback();
                
                console.log('You are not authorized to update this entry request');
                return res.status(404).json({message: 'You are not authorized to update this entry request'})
            };

            response_message = 'Entry Request was Declined';
        }
        //______________________________________________________________________________________________________________________________
        
        // after knowing what is the new status of the Entry Request and implementing some procedures we should do the following:
        // Update Entry Request status 
       const [results] = await connection.query(
        'UPDATE entry_requests SET Status = ? WHERE EntryRequest_ID = ?', 
        [status, EntryRequest_ID]
       );

       // check if the new status of Entry Request was updated , if not that means the provided data is wrong(probaly the EntryRequest_ID in declined case, because approved already have somethign to check the validation )
        if (results.affectedRows === 0){
            console.log(`Status was not updated! No Entry Requests found wiht this ID : ${EntryRequest_ID}`);
            await connection.rollback();
            return res.status(404).json({message : `Status was not updated! No Entry Requests was not found With this ID : ${EntryRequest_ID} `})
        };

        //______________________________________________________________________________________________________________________________
        // use 'commit' that will commit the transaction only if both operations succeed
        await connection.commit();
        console.log(response_message)
        return res.json({ message: response_message });

    } catch (error) {
        await connection.rollback();//'rollback' will be used to prevent incomplete commits (like either only the status is updated or the qr code data is stored in db)

        console.error('Error occurred while updating entry request status :', error );
        return res.status(500).json({ message: 'Error occurred while updating entry request status ', error });

    } finally {
        connection.release();// Release the connection back to the pool(so it can be reused)
    }
};
//=============================================================================================================================
module.exports.create_request = create_request;// POST
module.exports.view_requests = view_requests;// GET
module.exports.update_request = update_request; // PATCH