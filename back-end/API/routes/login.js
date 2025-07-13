//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

//===========================================================================================================
// Rate limiting for login attempts to prevent brute force attacks
//===========================================================================================================
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 login attempts per IP per window
    message: {
        message: 'Too many login attempts from this IP, please try again in 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: true, // Don't count successful requests
});

//===========================================================================================================
// Importing functions, middlewares and libraries(modules)
//===========================================================================================================
const {prevent} = require('../../Authentication_Middleware');
// prevent : middleware to restrict access to some pages ( like login page for a user who alraedy logged in )

const { validateLogin } = require('../../validation_middleware');
const login_logic = require('../../Controllers/Login_controller');

//===========================================================================================================
// Login logic with rate limiting and input validation
//===========================================================================================================

router.post('/', loginLimiter, validateLogin, prevent, login_logic);

module.exports = router;