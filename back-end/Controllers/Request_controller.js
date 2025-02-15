//===============================================================================================================
//?  Importing  the database connection
//===============================================================================================================
const database = require('../Database_connection');

//=======================================================================================================
//? POST,  function that create requests
//=======================================================================================================
const create_request = async (req, res) => {
    const {entry_approver_id, entry_purpose, entry_date, entry_time} = req.body;

    try{
        if ( !entry_approver_id || !entry_purpose || !entry_date || !entry_time ) {
            return res.status(400).json({ message: 'Fill all information please' });
        };
        
        console.log(`This is the user email : ${req.user.email}  and user id : ${req.user.id}`)// test

        // Generate the request id
        const EntryRequest_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");

        database.query('INSERT INTO entry_requests (EntryRequest_id, Entry_Requester_id, Entry_Approver_id, Entry_purpose, Entry_date, Entry_time, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [EntryRequest_id,
            req.user.id, 
            entry_approver_id, 
            entry_purpose, 
            entry_date, 
            entry_time, 
            "waiting"], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Database error' });
            }
            console.log(`New Request was created. Entry Requester: ${req.user.id} , Entry Approver: ${entry_approver_id}`);
            return res.status(201).json({message: 'New Request was created'})
        });
    }catch(error){
        console.log('Server error, please try again', error);
        return res.status(500).json({ message: 'Server error, please try again', error});
    }
    
};

//=============================================================================================================================
//? GET,  function to review Waiting requests
//=======================================================================================================
const view_requests = (req, res) => {
    const waiting_requests =  database.query('SELECT * FROM entry_requests WHERE Status = ?  AND Entry_Approver_ID = ?',["waiting", req.user.id], (error, results) => {
    if(error){
        console.log('Database Error', error)
        return res.status(500).json({ message: 'Database error', error });
    }
    if(results.length === 0 ){
        return res.json({ message: 'No waiting Requests exists' })
    }
    return res.json(results);  
    });
}

//=============================================================================================================================
//? PATCH, function to update request status 
//=======================================================================================================
const GenerateQrCode = require('./GenerateQrCode'); // Import from Controllers folder
const path = require ('path');

const update_request = async (req, res) => {
    const {EntryRequest_ID, status, QRcode_ID, User_ID, Visit_purpose, QRcode_Expiry_date, QRcode_path  } = req.body;// will be taken from the front-end
    
    // check required fields
    if (!EntryRequest_ID || !status) {
            return res.status(400).json({ message: 'Required data is Missing, Fill all information please' });
    };

    const connection = await database.promise().getConnection(); // Get a connection from the pool

    try{    
        // Start a transaction
        await connection.beginTransaction();
        
        let response_message;
        let QRcode_ID, QRcode_path;

        // If the status is 'Approved', generate and insert QR code data --------------------------------------------------------------------------------------------------
        if (status == 'Approved') {
            if (!User_ID || !Visit_purpose || !QRcode_Expiry_date) {
                console.log('Missing QR Code data');
                return res.json({message: 'Error Occurred, Missing QR Code data'});
            }

            QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            QRcode_path = path.join('QRcodes', `${QRcode_ID}.png`); // Save QR code in QRcodes folder

            await GenerateQrCode(QRcode_ID, QRcode_path);


            // Inserting QR code data into database
            await connection.query(
                'INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?)',
                [QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path]
            );

            response_message = 'Entry Request was Approved & QR Code was generated';
        // if the entry request was rejected --------------------------------------------------------------------------------------------------------------------
        } else {
            response_message = 'Entry Request was Declined';
        }
        //______________________________________________________________________________________________________________________________

        // Update Request status 
        await connection.query(
            'UPDATE Entry_Requests SET Status = ? WHERE EntryRequest_ID = ?',
            [status, EntryRequest_ID]
        );

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
module.exports.create_rquest = create_rquest;// POST
module.exports.view_requests = view_requests;// GET
module.exports.update_request = update_request; // PATCH