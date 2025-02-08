//===========================================================================================================
// set up for express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions
//===========================================================================================================

const {create_appointment}= require('../../Controllers/Appoinment_controller')
const {view_appointment}= require('../../Controllers/Appoinment_controller');
const {update_appointment}= require('../../Controllers/Appoinment_controller');

const {protect} = require('../../Authentication_Middleware');
const {ExtractJWTData} = require('../../Authentication_Middleware');
//===========================================================================================================
// Request logic 
//===========================================================================================================
router.get('/', ExtractJWTData, protect,  view_appointment);

router.post('/', ExtractJWTData, protect, create_appointment );

router.patch('/', protect,  update_appointment);

//===========================================================================================================
module.exports = router;