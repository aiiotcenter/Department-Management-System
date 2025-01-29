if (process.env.NODE_ENV !== 'production'){// prevents unnecessary loading in production
  require('dotenv').config();
};

//===========================================================================
//? 1- Importing libraries(modules) I will use throuth the code
//===========================================================================

const express = require('express'); 
const app = express();
const bcrypt = require('bcrypt');//encryption module
const passport = require('passport');// middleware for node.js
const session = require('express-session');
const flash = require('express-flash');//display erros on interface
const mysql = require('mysql2');// importing mysql module to connect with db
const methodOverride = require('method-override'); // we will use it in log out (it allow us to override the method we are using (so we use .delete for log out))
const LocalStrategy = require('passport-local').Strategy;

// ===========================================================================

app.use(express.urlencoded({extended: false})); // parse(analyse) incoming body requests 


//===========================================================================================
//? 2- preparing session managment and passport.js initializatin for user authentication
//===========================================================================================

// initialize passport( using funciton in passport-config file)

app.use(flash());

app.use(session({
  secret : process.env.SESSION_SECRET ,
  resave : false ,// so we don't resave the session variable if nothing is changed
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

//===========================================================================
//? 3- Login page logic : check if user exist in database
//===========================================================================

function initialize(passport, getUserByid) { 
    const authenticateUser = async (id, password, done) => {
        try {
            connection.query('SELECT * FROM users WHERE User_ID = ?', [id], async (error, results) => {
                if (error) { 
                    return done(error);
                }

                if (results.length === 0) {
                    return done(null, false, { message: 'No user found with this id' });
                }

                const user = results[0]; // Get the user

                // Compare the provided password with the hashed password in the database
                if (await bcrypt.compare(password, user.Hashed_password)) {
                    return done(null, user); // Successful login
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }
            });
        } catch (error) {
            return done(error);
        }
    };

    // use passport's LocalStrategy to authorize the user (I choosed to check user authentication by his id)
    passport.use(new LocalStrategy({ usernameField: 'id' }, authenticateUser));

    passport.serializeUser((user, done) => {
        done(null, user.User_ID); // Store user ID in the session
    });

    passport.deserializeUser((id, done) => { //retrive all user data using the Id
        connection.query('SELECT * FROM users WHERE User_ID = ?', [id], (error, results) => {
            if (error) {
                return done(error);
            }
            done(null, results[0]);//this fetch user from the database
        });
    });
}

//________________________________________________________________


initialize(passport, id => {
    connection.query('SELECT * FROM users WHERE User_ID = ?', [id], (error, results) => {
      if (error) throw error ;
      return done(null, results[0]); //return the user
    });
  });


//===========================================================================================
//? 4- Connecting to the database in MySQL using ('mysql' module)
//===========================================================================================

// creating mysql connection
const connection = mysql.createConnection({
    host: 'localhost',     
    user: 'root',          
    database: 'dms',      
    password: 'DMS123-qaz'       
});

// to check if datebase is connected
connection.connect( (error) => {
    if (error){
        console.log("error occurred while connecting");
    } else{
        console.log("connection created with mysql successfully");
    }
});

//===========================================================================================
//? 5- Login functin 
//===========================================================================================

app.post('/login', checkNotAuthenticated,  passport.authenticate('local', {
  successRedirect : '/',
  failureRedirect : '/login',
  failureFlash : true // so user see all flash error occurs
}))


//===========================================================================================
//? 6- Register function
//===========================================================================================
//* Store user data in the database ------------------------------------

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    // Ensure all required fields are provided
    if (!req.body.role || !req.body.name || !req.body.email || !req.body.password) {
      req.flash('error', 'Please provide all required fields');
      return res.redirect('/register');
    }

    // generating Users ID
    const year = new Date().getFullYear();
    const Id_suffix = String(Math.floor(Math.random() * 10000)).padStart(4, '0');//(four digit number, if less add leading zero to the beginning)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = {
      User_ID: `${year}${Id_suffix}`,
      User_Role: req.body.role,
      User_name: req.body.name,
      Email_address: req.body.email,
      Hashed_password: hashedPassword,
    };

    
    connection.query('SELECT * FROM users WHERE Email_address = ?', [req.body.email], (error, results) => {
        if (error) {
          console.error(error);
          req.flash('error', 'Internal Server Error');
          return res.redirect('/register');
        }
        
        // Check if email already exists
        if (results.length > 0) {
          req.flash('error', 'Email already exists');
          return res.redirect('/register');
        }

        // Check if username already exists
        connection.query(
          'SELECT * FROM users WHERE User_name = ?', [req.body.name], (error, results) => {
            if (error) {
              console.error(error);
              req.flash('error', 'Internal Server Error');
              return res.redirect('/register');
            }

            if (results.length > 0) {
              req.flash('error', 'Username already exists');
              return res.redirect('/register');
            }

            // Insert the new user into the database
            connection.query('INSERT INTO users SET ?', user, (error, results) => {
              if (error) {
                console.error(error);
                req.flash('error', 'Internal Server Error');
                return res.redirect('/register');
              }

              req.flash('success', 'User registered successfully');
              return res.redirect('/login');
            });
        });
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something is wrong. Please try later');
    return res.redirect('/register');
  }
});

//===========================================================================================
//? 7- Create Routes
//===========================================================================================

app.get('/', checkAuthenticated,  (req, res) => {
  res.render('index.ejs'); // res.render is method to render(provide) view and display html code in .ejs files
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

//===========================================================================================
//? 8- Log out function
//===========================================================================================

app.delete('/logout', (req, res) => {
  req.logOut(req.user, error =>{
    if(error) return nex(error);
    res.redirect('/');
  }); 
});

//=======================================================================================================
//? 9- Protects routes (pages)that require the user to be logged in (like homepage in uzebim or courses)
//=======================================================================================================

function checkAuthenticated(req, res, next){ // prevent access to routes except if user is logged in
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
};

function checkNotAuthenticated(req, res, next){ // here prevert access to routes(login/register) if user already logged in(like he can't acces login or register pages if he's in )
  if(req.isAuthenticated()){
    return res.redirect('/');
  }
  next() // send the user to login page if not authenticated
};

//===========================================================================

app.listen(3000);// method to start server and listen for incoming request(http request)

