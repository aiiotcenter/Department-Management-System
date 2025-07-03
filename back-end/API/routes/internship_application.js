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

const {view_internship_applications, create_internship_application, update_internship_application, delete_internship_application} = require('../../Controllers/internship_application_controller');
const upload = require('../multerConfig');

//===========================================================================================================
// Routes for viewing, creaeting and updating Appointments
//===========================================================================================================
router.get('/', ExtractJWTData, protect, view_internship_applications);

router.post('/', ExtractJWTData, protect, upload.single('cv'), create_internship_application);

router.patch('/', protect, authRole,  update_internship_application);

// DELETE internship application by id
router.delete('/:id', protect, authRole, delete_internship_application);

//===========================================================================================================
module.exports = router;