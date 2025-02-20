//===========================================================================================================
//? Import the database connection
//===========================================================================================================
const database = require('../Database_connection');

//===========================================================================================================

const homepage_logic = async (req, res) => {
    // Check if the user is logged in
    if (!req.user || !req.user.email) {
        return res.status(401).json({ message: 'Unauthorized access. Please log in first.' });
    }

    try {
        // Fetch user from the database
        const [results] = await database.query('SELECT * FROM users WHERE Email_address = ?', [req.user.email]);

        // If no user is found
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user details
        res.json({ message: 'Welcome to the Homepage!', user: results[0] });
    } catch (error) {
        // Handle any errors during the database query
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

//===========================================================================================================

module.exports = homepage_logic;