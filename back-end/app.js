//===========================================================================================
//? Initializes  Express framework & creates an instance of the Express application "app" & Import CORS 
//(which will be used to define routes, middleware, and handle HTTP requests)
//===========================================================================================

const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');

//===========================================================================================
//? Import Security Middleware 
//===========================================================================================
const { apiLimiter, securityHeaders, errorHandler, requestSizeLimit } = require('./security_middleware');

//===========================================================================================
//? Import the Routes 
//===========================================================================================

const Login_route = require('./API/routes/login');
const Register_route = require('./API/routes/register');
const Logout_route = require('./API/routes/logout');
const Homepage_route = require('./API/routes/homepage');
const Request_route = require('./API/routes/request');
const Appointment_route = require('./API/routes/appointment');
const Announcement_route = require('./API/routes/announcement');

const Admin_route = require('./API/routes/admin');

const Internship_applicatin = require('./API/routes/internship_application');
const CheckAuth_route = require('./API/routes/check-auth');
//===========================================================================================
//? Import Libraries(modules) we will use
//===========================================================================================

const cookieParser = require('cookie-parser'); //middleware for parsing cookies in Express requests

//===========================================================================================
//? Apply Security Middleware FIRST
//===========================================================================================

// Trust proxy (important for rate limiting with reverse proxies)
app.set('trust proxy', 1);

// Apply security headers
app.use(securityHeaders);

// Apply request size limiting
app.use(requestSizeLimit);

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

//===========================================================================================
//? Enable CORS middleware
//===========================================================================================

app.use(cors({
    origin: ['http://localhost:9802', 'http://localhost'], // Allow both Vite dev and Docker/Nginx frontend
    credentials: true
}));

//===========================================================================================
//? Middleware to parse JSON, handle cookies, and serve static files
//===========================================================================================

app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size
app.use(cookieParser()); // Parse cookies

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//===========================================================================================
//? Health check endpoint for Docker
//===========================================================================================

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

//===========================================================================================
//? Root route for health check or basic info
//===========================================================================================
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

//===========================================================================================
//? set up routes handler for the API endpoints
//===========================================================================================

app.use('/api/login', Login_route);
app.use('/api/register', Register_route);
app.use('/api/logout', Logout_route);
app.use('/api/homepage', Homepage_route);
app.use('/api/request', Request_route);
app.use('/api/appointment', Appointment_route);
app.use('/api/announcement', Announcement_route);

app.use('/api/admin', Admin_route);

app.use('/api/internship_application', Internship_applicatin);
app.use('/api/check-auth', CheckAuth_route);

//===========================================================================================
//? Apply Error Handler Middleware LAST
//===========================================================================================

app.use(errorHandler);

//===========================================================================================
//? Export the app
//===========================================================================================

module.exports = app;