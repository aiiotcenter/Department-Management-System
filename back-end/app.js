//===========================================================================================
//? Initializes  Express framework & creates an instance of the Express application "app" & Import CORS 
//(which will be used to define routes, middleware, and handle HTTP requests)
//===========================================================================================

const express = require('express');
const app = express();

const cors = require('cors');

//===========================================================================================
//? Import the Routes 
//===========================================================================================

const Login_route = require('./API/routes/login');
const Register_route = require('./API/routes/register');
const Logout_route = require('./API/routes/logout');
const Homepage_route = require('./API/routes/homepage');
const Request_route = require('./API/routes/request');
const Appointment_route = require('./API/routes/appointment');

const Admin_route = require('./API/routes/admin');

const Internship_applicatin = require('./API/routes/internship_application');
//===========================================================================================
//? Import Libraries(modules) we will use
//===========================================================================================

const cookieParser = require('cookie-parser'); //middleware for parsing cookies in Express requests


//===========================================================================================
//? Enable CORS middleware
//===========================================================================================

app.use(cors());

//===========================================================================================
//? set up for the middleware( handle json reqestes & url & cookies)
//===========================================================================================

app.use(express.json()); // parse(analyse) incoming requestes with json type
app.use(express.urlencoded({ extended: true }));// parse(analyse) incoming body requests
app.use(cookieParser());// allow reading cookies

//===========================================================================================
//? set up routes handler for the API endpoints
//===========================================================================================

app.use('/api/login', Login_route);
app.use('/api/register', Register_route);
app.use('/api/logout', Logout_route);
app.use('/api/homepage', Homepage_route);
app.use('/api/request',Request_route);
app.use('/api/appointment', Appointment_route);

app.use('/api/admin', Admin_route);

app.use('/api/apply_for_internship', Internship_applicatin);

//===========================================================================================
module.exports = app;