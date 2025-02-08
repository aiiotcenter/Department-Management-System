const database = require('../Database_connection');

//=======================================================================================================
// POST function that receive appointments(create appointments)
//=======================================================================================================

const create_appointment = async (req, res) => {
    const {Appointment_Approver_id, Visit_purpose, Visit_date, Visit_time, comments} = req.body;

    try{

        if ( !Appointment_Approver_id || !Visit_purpose || !Visit_date || !Visit_time ) {
            return res.status(400).json({ message: 'Fill all information please' });
        };
        
        console.log(`This is the user email : ${req.user.email}  and user id : ${req.user.id}`)//test
        

        const Appointment_id = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
        const default_comment = comments ? comments : "";

        database.query('INSERT INTO appointments (Appointment_ID, Appointment_Requester_id, Appointment_Approver_ID, Visit_purpose, Visit_date, Visit_time, Status, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [Appointment_id,
             req.user.id, // get the user_id from the token
             Appointment_Approver_id, 
             Visit_purpose, 
             Visit_date, 
             Visit_time, 
             "waiting", 
             default_comment], (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Database error' });
                }
                console.log(`New Appointment was created from -${req.user.id}- to -${Appointment_Approver_ID}-`);
                return res.status(201).json({message: 'New Appointment was created'})
            });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error, please try again' });
    }
    
};


//=============================================================================================================================
// GET function to review Waiting appointments
//=======================================================================================================

const view_appointment = (req, res) => {
    const waiting_appointments =  database.query('SELECT * FROM appointments WHERE Status = ?  AND Appointment_Approver_ID = ?',["waiting", req.user.id], (error, results) => {
    if(error){
        return res.status(500).json({ message: 'Database error' });
    }
    if(results.length === 0 ){
        return res.json({ message: 'No waiting Appointments exists' })
    }
    return res.json(results);  
    });
};



//=============================================================================================================================
// PUT/PATCH function to update appointments status 
//=======================================================================================================

const update_appointment = async (req, res) => {
    const {Appointment_id, status } = req.body;// will be taken from the front-end

    if ( !Appointment_id || !status ) {
            return res.status(400).json({ message: 'Fill all information please' });
        };
        
    try{
        database.query('UPDATE appointments SET Status = ? WHERE Appointment_ID = ?',[status, Appointment_id], (error, results) =>{
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Database error' });
            }
            console.log('Appointment Status was changed');
        });
        //------------------------------------------------------------------------------------
        if (status == 'Approved'){

            //TODO: function to Generate the qr code
            const {QRcode_ID, User_ID, Visit_purpose, Appointment_id, QRcode_Expiry_date, QRcode_path} = req.body

            if (!QRcode_ID || !User_ID || !Visit_purpose || !Appointment_id || !QRcode_Expiry_date || !QRcode_path) {
                console.log('Missing QR Code data')
                return res.json({messagee: 'Error Occured, please try again later'})
            }
            // Inserting qrcode data into database
            database.query('INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, Appointment_ID, QRcode_Expiry_date, QRcode_path) VALUES (?, ?, ?, ?, ?, ?, ?',
                [QRcode_ID, User_ID, Visit_purpose, Appointment_id ,QRcode_Expiry_date, QRcode_path], (error, results) => {
                    if (error) {
                            return res.status(500).json({ message: 'Database error' });
                    }
                    console.log('New QRcode was generated!');
                }
            )
            return res.json({message: 'Appointment was Approved & QRcode was generated'});
        //-----------------------------------------------------------------------------------------------------------
        } else{
            return res.json({message:'Appointment was Declined'})   
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error, please try again--' });
    }
};


//=======================================================================================================
module.exports.create_appointment = create_appointment;
module.exports.view_appointment = view_appointment;
module.exports.update_appointment = update_appointment;