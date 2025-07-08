//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions and middlwares
//===========================================================================================================
const {protect, authRole,  ExtractJWTData} = require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users
// ExtractJWTData : function to extract user data from the token(jwt)

const {create_appointment, view_appointment, update_appointment, view_student_appointments}= require('../../Controllers/Appointment_controller');
//===========================================================================================================
// Routes for viewing, creaeting and updating Appointments
//===========================================================================================================
router.get('/', ExtractJWTData, protect,  view_appointment);

router.post('/', ExtractJWTData, protect, create_appointment );

router.patch('/', protect, authRole,  update_appointment);

router.get('/student', ExtractJWTData, protect, view_student_appointments);

//===========================================================================================================
module.exports = router;