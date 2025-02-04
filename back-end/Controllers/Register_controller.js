//===========================================================================================================
// Import library and database connection
//===========================================================================================================
const database = require('../Database_connection');
const bcrypt = require('bcrypt');

//===========================================================================================================

const Register_logic = async (req, res) => {
    const { name, role, email, password} = req.body;

    try {
        // Ensure all required fields are provided
        if (!req.body.role || !req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Fill all information please' });
        }

        // generating Users_ID
        const generated_id = (Array.from({ length: 8 }, () => Math.floor(Math.random() * 10))).join("");//(8 digit number for the id)

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt round, it represent how many time the hashing algorithms will be applied on the password, the higher the better

        const user = {
        User_ID: generated_id,
        User_Role: req.body.role,
        User_name: req.body.name,
        Email_address: req.body.email,
        Hashed_password: hashedPassword,
        };

        // Check if email already exists
        database.query('SELECT * FROM users WHERE Email_address = ?', [req.body.email], (error, results) => {
            if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
            }
            
            
            if (results.length > 0) {
            return res.status(409).json({ message: 'email already exists' });
            }

            database.query('INSERT INTO users (User_ID, User_Name, User_Role, Email_address, Hashed_password) VALUES (?, ?, ?, ?, ?)',
                [generated_id, name, role, email, hashedPassword],
                (error, results) => {
                    if (error) {
                        return res.status(500).json({ message: 'Database error' });
                    }
                    console.log(`"${req.body.name}" Was added in the database`) // testing the code 
                    res.status(201).json({message: 'user registrered successfully, please log in'})
            });
    });
    } catch(error) {
        return res.status(500).json({ message: 'Server error, please try again' });
    }
};

//===========================================================================================================
module.exports = Register_logic;