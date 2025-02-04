//===========================================================================================================
// set up for express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing libraries
//===========================================================================================================
const {prevent} = require('../../Authentication_Middleware');
const database = require('../../Database_connection');
const bcrypt = require('bcrypt'); //encryption module
const jwt = require('jsonwebtoken'); // moduel to gernerate and verify jwts for authentication

const login_logic = require('../../Controllers/Login_controller');

//===========================================================================================================
// Login logic
//===========================================================================================================

router.post('/', prevent, login_logic);

//===========================================================================================================
module.exports = router