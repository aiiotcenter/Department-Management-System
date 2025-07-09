//===========================================================================================================
//? Import the database connection
//===========================================================================================================

const database = require('../Database_connection');

const {notify_student} = require('./emails_sender');
const {fetch_admins_and_send_emails} = require('./emails_sender');
const GenerateQrCode = require('./GenerateQrCode'); // Import at the top if not already
const path = require('path'); // Import at the top if not already
//================================================================================================================================================================
//? GET, function to review waiting internship applications
//================================================================================================================================================================

const view_internship_applications = async (req, res) =>{
    try{
        let query = `SELECT i.*, q.QRcode_ID FROM internship_applications i 
                     LEFT JOIN qr_codes q ON i.User_ID = q.User_ID 
                     AND i.status = 'Approved' 
                     WHERE 1=1`;
        let params = [];
        if (req.user && req.user.role !== 'admin') {
            query += ' AND i.User_ID = ?';
            params.push(req.user.id);
        }
        const [applications] = await database.query(query, params);
        if(applications.length == 0){
            return res.status(200).json([]);
        }
        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};

//================================================================================================================================================================
//? POST, function to create internship applications
//================================================================================================================================================================
 

const create_internship_application = async (req, res) => {
    const { department, period_of_internship, additional_notes, university } = req.body;
    const cv = req.file ? req.file.filename : null;
    
    // Check if uploads directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads/cvs');
    
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const connection = await database.getConnection(); // Get a connection from the pool   
        
    try {
        // Start a transaction
        await connection.beginTransaction();

        // check if any required data is missing 
        if ( !department || !period_of_internship || !university ){
            return res.status(400).json({message: 'Required data is Missing, Fill all information please'});
        };

        const notes = additional_notes || "";

        // logic to restrict the student from appling two internship at the same time
        // if student number exist in database then don't allow him to continue appling for second internship a the same time
        const[check_previous_application] = await database.query(
            'SELECT User_ID FROM internship_applications WHERE User_id = ? ', [req.user.id]);

        if(check_previous_application.length !== 0){
            return res.status(403).json({message :"Sorry, you can't apply for two internship at the same time!"});
        };
        
        // if he is not in database , then add him
        await connection.query(
            'INSERT INTO internship_applications (User_name, User_ID, department, period_of_internship, status, additional_notes, university, cv)  VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.user.name, req.user.id, department, period_of_internship, "waiting", notes, university, cv]
        );

        console.log('Internship application was received from : ', req.user.name);

        //-------------------------------------------------------------------------------------------------------------
        // send email to the admins notifiying then with the new submission
        try{
            fetch_admins_and_send_emails("Internship Application", req.user.name);
            
        } catch(error){
            await connection.rollback();
            return res.status(500).json({message: `Something went wrong while sending emails to the admins: ${error}`});
        }

        // use 'commit' that will commit the transaction only if all operations succeed
        await connection.commit();
        return res.status(200).json({message: 'Internship submitted and admins was notified'});

        //-------------------------------------------------------------------------------------------------------------
    } catch(error){
        await connection.rollback();
        return res.status(500).json({ message: 'Database error', error: error.message });
        
    } finally {
        connection.release();// Release the connection back to the pool(so it can be reused)
    };

};


//================================================================================================================================================================
//? PATCH, function to update the status of internship application
//================================================================================================================================================================
 
const update_internship_application = async (req, res) =>{
    const {id, status} = req.body;

    if (!id || !status){
        return res.status(400).json({message: 'Required data is Missing. Both ID and status are required.'});
    };

    // Validate the status value
    const validStatuses = ['waiting', 'pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
            message: 'Invalid status value. Must be one of: waiting, pending, approved, rejected'
        });
    }

    try {
        //check if the internship application already exists in the database
        const [check_existence] = await database.query(
            'SELECT * FROM internship_applications WHERE _id = ?',
            [id]
        );

        if (check_existence.length === 0){
            console.log(`Sorry! No internship application found with ID: ${id}`);
            return res.status(404).json({message: `No internship application found with ID: ${id}`});
        }

        // Normalize status to lowercase for consistency
        const normalizedStatus = status.toLowerCase();
        
        await database.query('UPDATE internship_applications SET status = ? WHERE _id = ?', 
                             [normalizedStatus, id]);

        console.log(`Internship application status updated for ID: ${id} to: ${normalizedStatus}`);
        
        // Get the user ID for email notification
        const [application] = await database.query('SELECT User_ID FROM internship_applications WHERE _id = ?', [id]);
        
        if (application.length === 0) {
            return res.status(404).json({ message: 'Application not found after update' });
        }
        
        const studentId = application[0].User_ID;
        
        // === QR code generation for approved internships ===
        if (normalizedStatus === 'approved') {
            // Generate a unique QR code ID
            const QRcode_ID = (Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))).join("");
            const QRcode_path = path.join(__dirname, '../QRcodes', `${QRcode_ID}.png`);
            // Prepare QR code data
            const qrData = {
                user_id: studentId,
                internship_id: id
            };
            // Generate and save the QR code image
            await GenerateQrCode(qrData, QRcode_ID);
            // Insert QR code info into the database
            await database.query(
                'INSERT INTO qr_codes (QRcode_ID, User_ID, Visit_purpose, QRcode_path) VALUES (?, ?, ?, ?)',
                [QRcode_ID, studentId, 'Internship', QRcode_path]
            );
        }

        // Notify the student about new status update
        try{
            const [student] = await database.query('SELECT Email_address FROM users WHERE User_ID = ?', [studentId]);
            
            if (student && student[0]) {
                const student_email = student[0].Email_address;
                notify_student("Internship Application", normalizedStatus, student_email);
            }
            
            return res.status(200).json({
                message: 'Status updated successfully',
                status: normalizedStatus,
                id: id
            });
        } catch(error){
            // Still return success since the status was updated
            return res.status(200).json({
                message: 'Status updated but email notification failed',
                status: normalizedStatus,
                id: id
            });
        }
    } catch(error) {
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};
//===========================================================================================================
//? DELETE, function to delete an internship application
//===========================================================================================================

const delete_internship_application = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({message: 'Required data is Missing. ID is required.'});
    }

    try {
        // First check if the record exists
        const [check] = await database.query(
            'SELECT * FROM internship_applications WHERE _id = ?',
            [id]
        );
        
        if (check.length === 0) {
            return res.status(404).json({ message: 'Internship application not found' });
        }
        
        // If exists, delete it
        const [result] = await database.query(
            'DELETE FROM internship_applications WHERE _id = ?',
            [id]
        );
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ 
                message: 'Internship application deleted successfully',
                id: id
            });
        } else {
            return res.status(404).json({ message: 'Internship application not found' });
        }
    } catch (error) {
        return res.status(500).json({ 
            message: 'Database error', 
            error: error.message 
        });
    }
};

//================================================================================================================================================================
module.exports.create_internship_application = create_internship_application;
module.exports.view_internship_applications = view_internship_applications;
module.exports.update_internship_application = update_internship_application;
module.exports.delete_internship_application = delete_internship_application;