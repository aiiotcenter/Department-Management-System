//===========================================================================================================
//? 1- importing  libraries needed
//===========================================================================================================
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt'); //encryption module
const jwt = require('jsonwebtoken'); // moduel to gernerate and verify jwts for authentication
const mysql = require('mysql2');
const cookieParser = require('cookie-parser'); //middleware for parsing cookies in Express requests
const path = require('path'); //It helps in working with file and directory paths

const app = express();


app.use(express.json()); // parse(analyse) incoming requestes with json type
app.use(express.urlencoded({ extended: true }));// parse(analyse) incoming body requests
app.use(cookieParser());// allow reading cookies (like req.cookie down in code)

//===========================================================================================================
//? 2- Set EJS as the view engine
//===========================================================================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//===========================================================================================================
//? 3- Connecting to the database in MySQL using ('mysql' module)
//===========================================================================================================
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dms',
    password:  process.env.Database_Password
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database:", error);
    } else {
        console.log("Connected to MySQL successfully");
    }
});
//===========================================================================================================
//? 4- Middleware to authenticate JWT in order to restrict access to certain pages (like homepage) for non-logged-in users
//==========================================================================================================
// this function keep hompage secure(it's used in this route), if user did not login or his token expired, then he won't ba able to access homepage
function authenticateToken(req, res, next) {
    const token = req.cookies.token ;// retrieves the token from the cookie

    if (!token) return res.redirect('/login'); // Redirect if no token

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return res.redirect('/login'); // Redirect if token is invalid
        req.user = user;
        next();
    });
}

//=======================================================================================================
//? 5- Middleware to restrict access to some pages ( like login page for a user who alraedy logged in )
//========================================================================================================
function checkNotAuthenticated(req, res, next) {
    const token = req.cookies.token; 

    if (token) {
        return res.redirect('/'); 
    }
    next(); // Allow access if not logged in
}
//===========================================================================================================
//? 6- Registering logic
//===========================================================================================================


app.post('/register', async (req, res) => {
    const { name, role, email, password} = req.body;

    try {
        // Ensure all required fields are provided
        if (!req.body.role || !req.body.name || !req.body.email || !req.body.password) {
        return res.render('register', { messages: { error: 'Fill all information' } }); // .render is method to render(provide) view and display html code in .ejs files
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
        connection.query('SELECT * FROM users WHERE Email_address = ?', [req.body.email], (error, results) => {
            if (error) {
            console.error(error);
            return res.render('register', { messages: { error: 'Internal server error' } });
            }
            
            
            if (results.length > 0) {
            return res.render('register', { messages: { error: 'email already exists' } });
            }

            connection.query('INSERT INTO users (User_ID, User_Name, User_Role, Email_address, Hashed_password) VALUES (?, ?, ?, ?, ?)',
                [generated_id, name, role, email, hashedPassword],
                (error, results) => {
                    if (error) {
                        return res.render('register', { messages: { error: 'database error' } });
                    }
                    console.log(`"${req.body.name}" Was added in the database`) // testing the code 
                    res.redirect('/login');
            });
    });
    } catch(error) {
        res.render('register', { messages: { error: 'Server error, please try again' } });
    }
});




//===========================================================================================================
//? 7- Login logic
//===========================================================================================================

app.post('/login', async (req, res) => {
    const { email, password} = req.body;
    connection.query('SELECT * FROM users WHERE Email_address = ?', [email], async (error, results) => {
        if (error) return res.status(500).json({ message: 'Internal server error' });
        if (results.length === 0) {
            return res.render('login', { messages: { error: 'No user found with this email address' } });
        }

        const user = results[0];
        if (await bcrypt.compare(password, user.Hashed_password)) {
            const token = jwt.sign({ email: user.Email_address }, process.env.JWT_SECRET); // genrate jwt token
            //generate cookie
            res.cookie('token', token, {httpOnly: true, maxAge :7200000}); // 60,000 milisecond = 1 min (cookie name, jwt value,...  )  (7,200,00 is two hours)
            //console.log(`the token is :\n${token}`); // to see the token(test)
            
            console.log(`User "${user.User_name}" logged in\n`);// to test and know who is logging in
            return res.redirect('/');
            

        } else {
            return res.render('login', { messages: { error: 'Incorrect password' } });
        }
    });
});

//===========================================================================================================
//? 8- Logout logic
//===========================================================================================================

app.post('/logout', authenticateToken, (req, res) => {
    res.clearCookie('token');
    const email = req.user.email;
    console.log(`User with this email address: "${email}" logged out\n`); // test i can delete it ( i added "autheticateToken" just for this test line, i can remove it)
    res.redirect('/login');
});

//===========================================================================================================
//? 9- Creating Routes
//===========================================================================================================

app.get('/', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM users WHERE Email_address = ?', [req.user.email], (error, results) => {
        if (error || results.length === 0) {
            return res.status(500).send('Error fetching user');
        }
        res.render('index', { user: results[0] });
    });
});

app.get('/login',checkNotAuthenticated, (req, res) => {
    res.render('login', { messages: {} }); // make sure messages is always defined 
});


app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register', { messages: {} }); //to make sure that messages is always defined
});

//===========================================================================================================

app.listen(3000);// method to start server and listen for incoming request(http request)
