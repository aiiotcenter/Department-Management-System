//===============================================================================================================
//?  Importing  registering function and the database connection
//===============================================================================================================
const { global_register } = require('./Register_controller');
const database = require('../Database_connection');

//===============================================================================================================
//?  GET, basic function
//===============================================================================================================

const admin_page = (req, res) => { 
    res.json({ message: `Hello, you are admin` });
};

//===============================================================================================================
//? GET, function to get all users
//===============================================================================================================

const get_all_users = async (req, res) => {
    try {
        // Get all users from the database
        const [users] = await database.query('SELECT User_ID, User_name, Email_address, User_Role FROM users');
        
        if (users.length === 0) {
            return res.status(200).json({ message: 'No users found in the system' });
        }
        
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in get_all_users function:", error);
        return res.status(500).json({ message: 'Error occurred while retrieving users', error: error.message });
    }
};

//===============================================================================================================
//? GET, function to get only staff users (non-admin users)
//===============================================================================================================

const get_staff_users = async (req, res) => {
    try {
        // Get only staff users (not admins or students) from the database
        const [users] = await database.query(
            'SELECT User_ID, User_name, Email_address, User_Role FROM users WHERE User_Role NOT IN (?, ?)', 
            ['admin', 'student']
        );
        
        if (users.length === 0) {
            return res.status(200).json({ message: 'No staff users found in the system' });
        }
        
        // Format the response to match the expected structure for staff teams
        const staffUsers = users.map(user => ({
            id: user.User_ID,
            name: user.User_name,
            role: user.User_Role,
            email: user.Email_address,
            team: [] // Initialize empty team array
        }));
        
        return res.status(200).json(staffUsers);
    } catch (error) {
        console.error("Error in get_staff_users function:", error);
        return res.status(500).json({ message: 'Error occurred while retrieving staff users', error: error.message });
    }
};

//===============================================================================================================
//? POST, function to add new users
//===============================================================================================================

const add_employee = async (req, res) => {
    try {
        await global_register({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            photo_path: req.body.photo_path,
            password: req.body.password
        }, res);
    } catch (error) {
        console.error("Error in add_employee function:", error);
        return res.status(500).json({ message: 'Error occurred while adding user', error: error.message });
    }
};

//===============================================================================================================
//? PATCH, function to update a user
//===============================================================================================================

const update_employee = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        // Check if user exists
        const [userCheck] = await database.query('SELECT * FROM users WHERE User_ID = ?', [id]);
        if (userCheck.length === 0) {
            return res.status(404).json({ message: `No user found with this ID: ${id}` });
        }

        // Update user information
        await database.query(
            'UPDATE users SET User_name = ?, Email_address = ?, User_Role = ? WHERE User_ID = ?',
            [name, email, role, id]
        );

        console.log(`User with ID: ${id} successfully updated`);
        return res.status(200).json({ 
            message: `User with ID: ${id} successfully updated`,
            user: { id, name, email, role } 
        });
    } catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        return res.status(500).json({ message: 'Error occurred while updating user', error: error.message });
    }
};

//===============================================================================================================
//? DELETE, remove users
//===============================================================================================================

const remove_employee = async (req, res) => {
    const { id } = req.params; // this extracts the user id from the URL

    try {
        // Check user existence in the system
        const [results] = await database.query('SELECT * FROM users WHERE User_ID = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: `No user found with this ID: ${id}` });
        }

        // Start a transaction to ensure all deletions happen together
        await database.query('START TRANSACTION');

        try {
            // Delete related records in the correct order (most dependent first)
            console.log(`Starting cascade deletion for user ${id}`);
            
            // 1. First, find all appointments for this user
            const [userAppointments] = await database.query(
                'SELECT Appointment_ID FROM appointments WHERE Appointment_Requester_ID = ? OR Appointment_Approver_ID = ?', 
                [id, id]
            );
            console.log(`Found ${userAppointments.length} appointments for user ${id}`);

            // 2. Find all entry requests for this user  
            const [userEntryRequests] = await database.query(
                'SELECT EntryRequest_ID FROM entry_requests WHERE Entry_Requester_ID = ? OR Entry_Approver_ID = ?', 
                [id, id]
            );
            console.log(`Found ${userEntryRequests.length} entry requests for user ${id}`);

            // 3. Delete QR codes that reference these appointments
            let appointmentQrDeleted = 0;
            for (const appointment of userAppointments) {
                const [result] = await database.query('DELETE FROM qr_codes WHERE Appointment_ID = ?', [appointment.Appointment_ID]);
                appointmentQrDeleted += result.affectedRows;
            }
            console.log(`Deleted ${appointmentQrDeleted} QR codes referencing user appointments`);

            // 4. Delete QR codes that reference these entry requests
            let entryRequestQrDeleted = 0;
            for (const entryRequest of userEntryRequests) {
                const [result] = await database.query('DELETE FROM qr_codes WHERE EntryRequest_ID = ?', [entryRequest.EntryRequest_ID]);
                entryRequestQrDeleted += result.affectedRows;
            }
            console.log(`Deleted ${entryRequestQrDeleted} QR codes referencing user entry requests`);

            // 5. Delete QR codes directly owned by this user (that don't reference appointments/entry_requests)
            const [userQrResult] = await database.query('DELETE FROM qr_codes WHERE User_ID = ?', [id]);
            console.log(`Deleted ${userQrResult.affectedRows} QR codes directly owned by user ${id}`);

            // 6. Delete internship applications for this user (no dependencies)
            const [internshipResult] = await database.query('DELETE FROM internship_applications WHERE User_ID = ?', [id]);
            console.log(`Deleted ${internshipResult.affectedRows} internship applications for user ${id}`);

            // 7. Now delete appointments (after all referencing QR codes are removed)
            const [appointmentResult] = await database.query(
                'DELETE FROM appointments WHERE Appointment_Requester_ID = ? OR Appointment_Approver_ID = ?', 
                [id, id]
            );
            console.log(`Deleted ${appointmentResult.affectedRows} appointments for user ${id}`);

            // 8. Delete entry requests (after all referencing QR codes are removed)
            const [entryResult] = await database.query(
                'DELETE FROM entry_requests WHERE Entry_Requester_ID = ? OR Entry_Approver_ID = ?', 
                [id, id]
            );
            console.log(`Deleted ${entryResult.affectedRows} entry requests for user ${id}`);

            // 9. Check for any remaining foreign key references
            const [remainingRefs] = await database.query(`
                SELECT 
                    (SELECT COUNT(*) FROM appointments WHERE Appointment_Requester_ID = ? OR Appointment_Approver_ID = ?) as appointments,
                    (SELECT COUNT(*) FROM entry_requests WHERE Entry_Requester_ID = ? OR Entry_Approver_ID = ?) as entry_requests,
                    (SELECT COUNT(*) FROM qr_codes WHERE User_ID = ?) as qr_codes,
                    (SELECT COUNT(*) FROM internship_applications WHERE User_ID = ?) as internships
            `, [id, id, id, id, id, id]);

            if (remainingRefs[0].appointments > 0 || remainingRefs[0].entry_requests > 0 || 
                remainingRefs[0].qr_codes > 0 || remainingRefs[0].internships > 0) {
                throw new Error(`Still have remaining references: ${JSON.stringify(remainingRefs[0])}`);
            }

            // 10. Finally, delete the user
            const [userResult] = await database.query('DELETE FROM users WHERE User_ID = ?', [id]);
            console.log(`User with ID: ${id} deleted successfully. Rows affected: ${userResult.affectedRows}`);

            if (userResult.affectedRows === 0) {
                throw new Error('User deletion failed - no rows affected');
            }

            // Commit the transaction
            await database.query('COMMIT');
            console.log(`Transaction committed successfully for user ${id}`);

            const totalQrDeleted = appointmentQrDeleted + entryRequestQrDeleted + userQrResult.affectedRows;
            const totalDeleted = totalQrDeleted + appointmentResult.affectedRows + 
                               entryResult.affectedRows + internshipResult.affectedRows;

            return res.status(200).json({ 
                message: `User with ID: ${id} and all related records successfully removed`,
                details: {
                    qr_codes_total: totalQrDeleted,
                    qr_codes_from_appointments: appointmentQrDeleted,
                    qr_codes_from_entry_requests: entryRequestQrDeleted,
                    qr_codes_direct: userQrResult.affectedRows,
                    appointments: appointmentResult.affectedRows,
                    entry_requests: entryResult.affectedRows,
                    internship_applications: internshipResult.affectedRows,
                    total_related_records: totalDeleted
                }
            });

        } catch (transactionError) {
            // Rollback the transaction if any error occurs
            await database.query('ROLLBACK');
            console.error(`Transaction rolled back for user ${id}:`, transactionError);
            throw transactionError;
        }

    } catch (error) {
        console.error(`Error occurred while removing user ${id}:`, error);
        
        // Check if it's a foreign key constraint error
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(400).json({ 
                message: `Cannot delete user because they have related records that could not be removed automatically. Error: ${error.message}`,
                error_code: error.code,
                sql_state: error.sqlState
            });
        }
        
        return res.status(500).json({ 
            message: 'Error occurred while removing user', 
            error: error.message,
            error_code: error.code
        });
    }
};


//========================================================================================================

module.exports.admin_page = admin_page;
module.exports.add_employee = add_employee;
module.exports.remove_employee = remove_employee;
module.exports.get_all_users = get_all_users;
module.exports.get_staff_users = get_staff_users;
module.exports.update_employee = update_employee;
module.exports.get_staff_users = get_staff_users;
