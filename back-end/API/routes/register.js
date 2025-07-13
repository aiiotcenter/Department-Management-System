//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();
                                
//===========================================================================================================
// Importing functoion and middleware
//===========================================================================================================
const {prevent} = require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users

const { validateRegistration } = require('../../validation_middleware');
const {local_register} = require('../../Controllers/Register_controller');

//===========================================================================================================
// Route to add new user to the system with validation
//===========================================================================================================
router.post('/', validateRegistration, prevent, local_register);

module.exports = router;