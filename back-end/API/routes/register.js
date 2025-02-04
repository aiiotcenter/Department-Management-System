//===========================================================================================================
// set up for express router
//===========================================================================================================
const express = require('express');
const router = express.Router();// we use it to define routes separately and attach them to the main app using app.use() ,
                                // in which keep the routes organized and manageable 
                                
//===========================================================================================================
// Import libraries & function
//===========================================================================================================
const {prevent} = require('../../Authentication_Middleware');

const Register_logic = require('../../Controllers/Register_controller');

//===========================================================================================================
// Register logic
//===========================================================================================================
router.post('/', prevent, Register_logic);

//===========================================================================================================
module.exports = router;