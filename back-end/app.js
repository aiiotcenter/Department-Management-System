//===========================================================================================
//? Initializes  Express framework & creates an instance of the Express application "app" 
//(which will be used to define routes, middleware, and handle HTTP requests)
//===========================================================================================

const express = require('express');
const app = express();

//===========================================================================================
//? Import the Routes 
//===========================================================================================

const Login_route = require('./API/routes/login');
const Register_route = require('./API/routes/register');
const Logout_route = require('./API/routes/logout');
const Homepage_route = require('./API/routes/homepage')

//===========================================================================================
//? Import Libraries(modules) we will use
//===========================================================================================

const cookieParser = require('cookie-parser'); //middleware for parsing cookies in Express requests

//===========================================================================================
//? set up for the middleware( handle json reqestes & url & cookies)
//===========================================================================================

app.use(express.json()); // parse(analyse) incoming requestes with json type
app.use(express.urlencoded({ extended: true }));// parse(analyse) incoming body requests
app.use(cookieParser());// allow reading cookies (like req.cookie down in code)

//===========================================================================================
//? set up routes handler for the API endpoints
//===========================================================================================

app.use('/api/login', Login_route);
app.use('/api/register', Register_route);
app.use('/api/logout', Logout_route);
app.use('/api/homepage', Homepage_route);



module.exports = app;