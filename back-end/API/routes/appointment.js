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

const { validateAppointment } = require('../../validation_middleware');
const {create_appointment, view_appointment, update_appointment, view_student_appointments, view_all_appointments, delete_appointment}= require('../../Controllers/Appointment_controller');

//===========================================================================================================
// Routes for viewing, creaeting and updating Appointments
//===========================================================================================================
router.get('/', ExtractJWTData, protect,  view_appointment);

router.get('/all', ExtractJWTData, protect, authRole, view_all_appointments);

router.post('/', ExtractJWTData, protect, validateAppointment, create_appointment);

router.patch('/', protect, authRole,  update_appointment);

router.delete('/:id', protect, authRole, delete_appointment);

router.get('/student', ExtractJWTData, protect, view_student_appointments);

//===========================================================================================================
module.exports = router;