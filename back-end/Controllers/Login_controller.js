//===========================================================================================================
//? Import libraries 
//===========================================================================================================
const database = require('../Database_connection');
const bcrypt = require('bcrypt'); //encryption module
const jwt = require('jsonwebtoken'); // moduel to gernerate and verify jwts for authentication

//===========================================================================================================
const login_logic = async (req, res) => {
    const { email, password } = req.body;

    // Ensure all required fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Fill all information please' });
    }

    try {
        // Fetch user from the database
        const [results] = await database.query('SELECT * FROM users WHERE Email_address = ?', [email]);

        // If no user is found
        if (results.length === 0) {
            console.log('No user found with this email address');
            return res.status(404).json({ message: 'No user found with this email address' });
        }

        const user = results[0];

        // Compare the password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.Hashed_password);

        if (isPasswordValid) {
            // Generate JWT token
            const token = jwt.sign({ id: user.User_ID, name: user.User_name, email: user.Email_address, role: user.User_Role }, process.env.JWT_SECRET);

            // Generate cookie
            res.cookie('token', token, { httpOnly: true, maxAge: 7200000 }); // 2 hours in milliseconds
            
            console.log(`User "${user.User_name}" logged in`); // Log user login
            return res.status(200).json({ message: 'Login successful', token: token });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const change_password = async (req, res) => {
    const userId = req.user?.id; // assuming user info is attached by protect middleware
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Fetch user from the database
        const [results] = await database.query('SELECT * FROM users WHERE User_ID = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = results[0];
        // Check current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.Hashed_password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password in DB
        await database.query('UPDATE users SET Hashed_password = ? WHERE User_ID = ?', [hashedPassword, userId]);
        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
//===========================================================================================================
module.exports = login_logic;
module.exports.change_password = change_password;