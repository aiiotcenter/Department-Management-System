//===========================================================================================================
// Setting up Express router
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions and middlewares
//===========================================================================================================
const {ExtractJWTData} = require('../../Authentication_Middleware');
const {protect, authRole} = require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users

const {create_request, view_requests, update_request }= require('../../Controllers/Request_controller');
//===========================================================================================================
// Routes for viewing, adding and updating Requestes 
//===========================================================================================================
router.get('/', ExtractJWTData, protect,  view_requests);

router.post('/', ExtractJWTData, protect, create_request );

router.patch('/', protect, authRole, update_request);

//===========================================================================================================
module.exports = router;