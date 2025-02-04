//===========================================================================================================
// Import the database connection
//===========================================================================================================
const database = require('../Database_connection');

//===========================================================================================================
const homepage_logic =  (req, res) => {
     if (!req.user || !req.user.email) {
        return res.status(401).json({ message: 'Unauthorized access. Please log in first.' }); 
    };
    database.query('SELECT * FROM users WHERE Email_address = ?', [req.user.email], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error fetching user' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({message: 'Welcome to the Homepage !', user: results[0] });
    });
}
//===========================================================================================================
module.exports = homepage_logic;