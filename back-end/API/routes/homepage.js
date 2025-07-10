//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions and middlewares 
//===========================================================================================================
const {protect} = require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users

const homepage_logic = require('../../Controllers/Homepage_controller');
const { change_password } = require('../../Controllers/Login_controller');

//===========================================================================================================
// Router for viewing homepage 
//===========================================================================================================
router.get('/', protect, homepage_logic);
router.patch('/change_password', protect, change_password);
//===========================================================================================================

module.exports = router