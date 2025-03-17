//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions and middlwares
//===========================================================================================================
const {protect, authRole, ExtractJWTData} = require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users
// ExtractJWTData : function to extract user data from the token(jwt)

const {view_internship_applications, create_internship_application, update_internship_application} = require('../../Controllers/internship_application_controller');

//===========================================================================================================
// Routes for viewing, creaeting and updating Appointments
//===========================================================================================================
router.get('/', ExtractJWTData, protect, authRole,  view_internship_applications);

router.post('/', ExtractJWTData, protect, create_internship_application );

router.patch('/', protect, authRole,  update_internship_application);

//===========================================================================================================
module.exports = router;