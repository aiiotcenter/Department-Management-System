//===========================================================================================================
// set up for express router
//===========================================================================================================
const express = require('express');
const router = express.Router(); // this method creates a router instance used to define and organize route handlers for different HTTP methods (e.x: GET, POST)

//===========================================================================================================
// Import specific function from file "Authentication_Middleware.js"
//===========================================================================================================
const {protect} = require('../../Authentication_Middleware');

const Logout_logic = require('../../Controllers/Logout_controller');

//===========================================================================================================
// Logout logic
//===========================================================================================================

router.post('/', protect, Logout_logic );

//===========================================================================================================
module.exports = router