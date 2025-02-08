const database = require('../Database_connection');

//=======================================================================================================
// POST function that receive requests1(it make requests)
//=======================================================================================================
const receive_rquest = async (req, res) => {
    const {Entry_Approver_id, Entry_purpose, Entry_date, Entry_time} = req.body;

    try{

        if ( !Entry_Approver_id || !Entry_purpose || !Entry_date || !Entry_time ) {
            return res.status(400).json({ message: 'Fill all information please---' });
        };
        
        console.log(`This is the user email : ${req.user.email}  and user id : ${req.user.id}`)// test

        const EntryRequest_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");

        database.query('INSERT INTO entry_requests (EntryRequest_id, Entry_Requester_id, Entry_Approver_id, Entry_purpose, Entry_date, Entry_time, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [EntryRequest_id,
             req.user.id, 
             Entry_Approver_id, 
             Entry_purpose, 
             Entry_date, 
             Entry_time, 
             "waiting"], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error' });
                }
                console.log(`New Request was created from -${req.user.id}- to -${Entry_Approver_id}-`);
                return res.status(201).json({message: 'New Request was created'})
            });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
    
};

//=============================================================================================================================
// GET function to review Waiting requests
//=======================================================================================================
const view_requests = (req, res) => {
    const waiting_requests =  database.query('SELECT * FROM entry_requests WHERE Status = ?  AND Entry_Approver_ID = ?',["waiting", req.user.id], (error, results) => {
    if(error){
        return res.status(500).json({ message: 'Database error' });
    }
    if(results.length === 0 ){
        return res.json({ message: 'No waiting Requests exists' })
    }
    return res.json(results);  
    });
    

}

//=============================================================================================================================
// PUT/PATCH function to update request status 
//=======================================================================================================
const update_request = async (req, res) => {
    const {EntryRequest_id, status } = req.body;// will be taken from the front-end
    
    if ( !EntryRequest_id || !status ) {
            return res.status(400).json({ message: 'Fill all information please' });
        };

    try{
        database.query('UPDATE Entry_Requests SET Status = ? WHERE EntryRequest_ID = ?',[status, EntryRequest_id], (error, results) =>{
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Database error' });
            }
            console.log('Request Status was changed');
        });
        //------------------------------------------------------------------------------------
        if (status == 'Approved'){

            //TODO: function to Generate the qr code 
            const {QRcode_id, User_id, Visit_purpose, EntryRequest_id, QRcode_Expiry_date, QRcode_path} = req.body

            if (!QRcode_id || !User_id || !Visit_purpose || !EntryRequest_id || !QRcode_Expiry_date || !QRcode_path) {
                console.log('Missing QR Code data')
                return res.json({messagee: 'Error Occured, please try again later'})
            }
            // Inserting qrcode data into database
            database.query('INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, EntryRequest_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?, ?',
                [QRcode_id, User_id, Visit_purpose, QRcode_Expiry_date, QRcode_path], (error, results) => {
                    if (error) {
                            return res.status(500).json({ message: 'Database error' });
                    }
                    console.log('New QRcode was generated!');
                }
            )
            return res.json({message: 'Request was Approved & QRcode was generated'});
        //-----------------------------------------------------------------------------------------------------------
        } else{
            return res.json({message:'Request was Declined'})   
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error, please try again--' });
    }
};


//=============================================================================================================================
module.exports.receive_rquest = receive_rquest;// POST
module.exports.view_requests = view_requests;// GET
module.exports.update_request = update_request; // PATCH