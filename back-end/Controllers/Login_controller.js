//===========================================================================================================
// Import libraries 
//===========================================================================================================
const database = require('../Database_connection');
const bcrypt = require('bcrypt'); //encryption module
const jwt = require('jsonwebtoken'); // moduel to gernerate and verify jwts for authentication



//===========================================================================================================
const login_logic = async (req, res) => {
    const { email, password} = req.body;

    // Ensure all required fields are provided
    if ( !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Fill all information please' });
    }

    database.query('SELECT * FROM users WHERE Email_address = ?', [email], async (error, results) => {
        if (error) return res.status(500).json({ message: 'Internal server error' });
        if (results.length === 0) {
            return res.status(404).json({ message: 'No user found with this email address' });
        }

        const user = results[0];
        if (await bcrypt.compare(password, user.Hashed_password)) {
            // genrate jwt token
            const token = jwt.sign({ email: user.Email_address }, process.env.JWT_SECRET); 
            //generate cookie
            res.cookie('token', token, {httpOnly: true, maxAge :7200000}); // 60,000 milisecond = 1 min (cookie name, jwt value,...  )  (7,200,00 is two hours)
            //console.log(`the token is :\n${token}`); // to see the token(test)
            
            console.log(`User "${user.User_name}" logged in\n`);// to test and know who is logging in
            return res.status(200).json({ message: 'Login successful', token: token });
            

        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    });
}

//===========================================================================================================
module.exports = login_logic;