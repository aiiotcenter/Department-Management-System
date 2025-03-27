//===============================================================================================================
//?  Importing the database connection & function to send emails to the admins
//===============================================================================================================
const database = require('../Database_connection');

const fetch_admins_and_send_emails = require('./emails_sender');

//=======================================================================================================
//? POST,  function that create requests
//=======================================================================================================
const create_request = async (req, res) => {
    const { entry_purpose, entry_date, entry_time } = req.body;

    try {
        if (!entry_purpose || !entry_date || !entry_time) {
            console.log('Some information for the Entry Request is missing');
            return res.status(400).json({ message: 'Fill all information please' });
        }

        // Generate the request ID
        const EntryRequest_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");

        await database.query(
            'INSERT INTO entry_requests (EntryRequest_id, Entry_Requester_id,  Entry_purpose, Entry_date, Entry_time, Status) VALUES (?, ?, ?, ?, ?, ?)',
            [EntryRequest_id, req.user.id, entry_purpose, entry_date, entry_time, "waiting"]
        );

        console.log(`New Request was created. Entry Requester: ${req.user.id}`);

        //-------------------------------------------------------------------------------------------------------------
        //
        // email to the admins notifiying then with the new submission
        try{
            fetch_admins_and_send_emails("Entry Request", req.user.name);

            console.log('Entry Request was submitted and admins was notified');
            return res.json({message: 'Entry Request was submitted and admins was notified'});


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
            'SELECT * FROM entry_requests WHERE Status = ? ',
            ["waiting"]
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
    const {EntryRequest_ID, status, QRcode_Expiry_date  } = req.body;// will be taken from the front-end
    
    // check required fields
    if (!EntryRequest_ID || !status) {
            return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    };


    //check if the appointment already exists in the database or it does not exists ------------------------
    const [check_existence] = await database.query(
        'SELECT * FROM entry_requests WHERE EntryRequest_ID = ?',
        [EntryRequest_ID]
    );

    if (check_existence[0] == undefined){
        console.log(`Sorry! no entry requests found with this id : ${EntryRequest_ID}`);
        return res.status(404).json({message: `Sorry! no entry requests found with this id : ${EntryRequest_ID}`})
    };
    // console.log(check_existence[0]); // test
    // console.log("======================================================")
    //----------------------------------------------------------------------------------------------------------

    

    // get the user_id from the EntryRequest_ID============================================================
    const [get_user_id] = await database.query(
        'SELECT Entry_Requester_ID FROM entry_requests WHERE EntryRequest_ID = ?',[EntryRequest_ID]
    );
    let user_id = get_user_id[0].Entry_Requester_ID;

    //===========================================================================================================================

    const connection = await database.getConnection(); // Get a connection from the pool
    
    try{    
        // Start a transaction
        await connection.beginTransaction();
        
        let response_message, QRcode_ID, QRcode_path;
        // =====================================================================================================================================================


        // If the status is 'Approved', insert QR code data --------------------------------------------------------------------------------------------------
        if (status == 'Approved'){
            
            // check QR code data 
            if ( !QRcode_Expiry_date ) {
                console.log('Missing QR Code data')
                return res.json({messagee: 'Error Occured, Missing QR Code data'})
            }

            // get the purpose of the entry from the EntryRequest_ID============================================================
            const [get_purpose] = await database.query(
                'SELECT Entry_purpose FROM entry_requests WHERE EntryRequest_ID = ?',[EntryRequest_ID]
            );
            let purpose_of_entry = get_purpose[0].Entry_purpose;

            //===========================================================================

            //_______________________________________________________________________________________________________________________________________________________
            // generate qrcode ID and prepare the path
            QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            QRcode_path = path.join(__dirname,'../QRcodes', `${QRcode_ID}.png`); // Save QR code in QRcodes folder
            
            // generate QR Code
            await GenerateQrCode({ user_id, purpose_of_entry, EntryRequest_ID, QRcode_Expiry_date }, QRcode_ID);
            
            // Insert QR Code data into the database
            const [results] = await connection.query(
                'INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)',
                [QRcode_ID, user_id, purpose_of_entry, EntryRequest_ID, QRcode_Expiry_date, QRcode_path]
            );

            if (results.affectedRows == 0){
                console.log('Database Error occured while inserting QRcode data');
                return res.json({message:'Database Error occured while inserting QRcode data' })
            }
            response_message = 'Entry Request was Approved & QR Code was generated';

            
        // ==========================================================================================================================================================   
        // if the entry request was regjected --------------------------------------------------------------------------------------------------------------------
        
        } else {
            response_message = 'Entry Request was Declined';
        }
        //===============================================================================================================================
        //===============================================================================================================================
        // after knowing what is the new status of the Entry Request and implementing some procedures we should do the following:


        // Update Entry Request status 
       const [results] = await connection.query(
        'UPDATE entry_requests SET Status = ? WHERE EntryRequest_ID = ?', 
        [status, EntryRequest_ID]
       );

       // check if the new status of Entry Request was updated 
        if (results.affectedRows === 0){
            console.log(`Status was not updated! No Entry Requests found wiht this ID : ${EntryRequest_ID}`);
            await connection.rollback();
            return res.status(404).json({message : `Status was not updated! No Entry Requests was not found With this ID : ${EntryRequest_ID} `})
        };
        //-----------------------------------------------------------------------------------------------

        // store the id of the admin who updated the request(approver) in the appointment table
        const [store_approver] = await connection.query(
            'UPDATE entry_requests SET Entry_Approver_ID = ?  WHERE  EntryRequest_ID = ?',
            [req.user.id, EntryRequest_ID]
        );

        if (store_approver.affectedRows ===0 ){
            console.log('Could not store the approver id in entry_requests table, something wrong happend');
            await connection.rollback();
            return res.status(404).json({message: 'Could not store the approver id in entry_requests table, something wrong happend'});
        }

        //==================================================================================================================================
        // use 'commit' that will commit the transaction only if all operations succeed
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