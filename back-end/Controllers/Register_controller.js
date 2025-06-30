//===============================================================================================================
//?  Importing  Library and database connection
//===============================================================================================================
const bcrypt = require('bcrypt');
const database = require('../Database_connection');

//===================================================================================================================
//? POST , this function is the inner logic of register, it passes the main information needed for registering user. 
//? (this function is for admin route)
//===================================================================================================================

const innerRegisterLogic = async ({ name, email, password, photo_path }, res) => {
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const role = 'student';
        // Generating Users_ID
        const generated_id = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Check if the email already exists
        const [results] = await database.query('SELECT * FROM users WHERE Email_address = ?', [email]);
        if (results.length !== 0) {
            console.log('Email already exists:', email);
            return res.status(409).json({ message: 'Email already exists' });
        }
        const [new_user] = await database.query(
            'INSERT INTO users (User_ID, User_Name, User_Role, Email_address, Photo_path, Hashed_password) VALUES (?, ?, ?, ?, ?, ?)',
            [generated_id, name, role, email, photo_path || '', hashedPassword]
        );
        if (new_user.affectedRows === 0) {
            console.log('Databaes Error, User was not registered!')
            return res.status(500).json({ message: 'Database error, User was not registered!' });
        }
        console.log(`"${name}" registered successfully, please log in`);
        return res.status(201).json({ message: 'User registered successfully, please log in' });
    } catch (error) {
        console.error('Server error, please try again', error);
        return res.status(500).json({ message: 'Server error, please try again', error });
    }
};

//===========================================================================================
//? initialize the register function for normal users
// ? (this function is for Register route)
//===========================================================================================

const Register_logic = async (req, res) => {
    const { name, email, password, photo_path } = req.body;
    // Call the inner function and pass the data from req.body 
    innerRegisterLogic({ name, email, password, photo_path }, res);
};
//===========================================================================================

module.exports.local_register = Register_logic;
module.exports.global_register = innerRegisterLogic;