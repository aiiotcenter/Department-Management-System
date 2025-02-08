//===========================================================================================================
// set up for express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions
//===========================================================================================================
const {receive_rquest}= require('../../Controllers/Requeset_controller');
const {view_requests}= require('../../Controllers/Requeset_controller');
const {update_request}= require('../../Controllers/Requeset_controller');
const {protect} = require('../../Authentication_Middleware');
const {ExtractJWTData} = require('../../Authentication_Middleware');
//===========================================================================================================
// Request logic 
//===========================================================================================================
router.get('/', ExtractJWTData, protect,  view_requests);

router.post('/', ExtractJWTData, protect, receive_rquest );

router.patch('/', protect,  update_request);

//===========================================================================================================
module.exports = router;