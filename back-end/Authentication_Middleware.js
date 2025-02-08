//===========================================================================================================
//? Import libraries 
//===========================================================================================================
const jwt = require('jsonwebtoken');
require('dotenv').config();
 
//===========================================================================================================
//?  middleware to authenticate JWT in order to restrict access to certain pages (like homepage) for non-logged-in users
//==========================================================================================================
// this function keep hompage secure(protect it), if user did not login or his token expired, then he won't ba able to access homepage
function authenticateToken(req, res, next) {
    const token = req.cookies.token ;// retrieves the token from the cookie

    if (!token) {
        return res.json({message: 'Access Denied, No token provided. Log in to access'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error){
            return res.json({message: 'Invalid or expired token. Please log in again.'})
        }
        req.user = user;
        next();
    });
}

//=======================================================================================================
//?  middleware to restrict access to some pages ( like login page for a user who alraedy logged in ) , prevent access
//========================================================================================================
function checkNotAuthenticated(req, res, next) {
    const token = req.cookies.token; 

    if (token) {
        return res.status(403).json({ message: 'You are already logged in. Log out first if you want to switch accounts or create a new one.'});
    }
    next(); // Allow access if not logged in
}


//=======================================================================================================
//? function to extract user data from the token(jwt)
//========================================================================================================


function RetrieveDataFromJWT(req, res, next){
    const token = req.cookies.token ;// retrieves the token from the cookie
    if (!token) return res.status(401).json({message : 'No token found, please log in again'});
    console.log(`This is the token: ${token}`); // for testing
    
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => { //verify and decode the jwt to get information from it
        if (error) return res.status(401).json({message: 'Invalid or expired token. Please log in again.'});
        req.user = user;
    next(); // here I have to call next() to pass contorl to next function or route , otherwise the code will get stuck

    });
};


//========================================================================================================
module.exports.protect = authenticateToken;
module.exports.prevent = checkNotAuthenticated;
module.exports.ExtractJWTData = RetrieveDataFromJWT;