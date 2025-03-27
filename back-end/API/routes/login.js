//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing functions, middlewares and libraries(modules)
//===========================================================================================================
const {prevent} = require('../../Authentication_Middleware');
// prevent : middleware to restrict access to some pages ( like login page for a user who alraedy logged in )

const login_logic = require('../../Controllers/Login_controller');

//===========================================================================================================
// Login logic
//===========================================================================================================

router.post('/', prevent, login_logic);

//===========================================================================================================
module.exports = router