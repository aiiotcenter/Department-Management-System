//===========================================================================================================
// Setting up Express router 
//===========================================================================================================
const express = require('express');
const router = express.Router();

//===========================================================================================================
// Importing the functions and middlewares 
//===========================================================================================================
const {protect, authRole, ExtractJWTData}= require('../../Authentication_Middleware');
// protect  : restrict access to certain pages for non-logged-in users
// authRole : ensures only admins can access certain pages.
// ExtractJWTData : function to extract user data from the token(jwt)

const {admin_page, add_employee, remove_employee, get_all_users, get_staff_users, update_employee} = require('../../Controllers/admin_handler');


//===========================================================================================================
// Routes for adding and removing employees 
//===========================================================================================================
router.get('/',protect, ExtractJWTData, authRole, admin_page );

router.get('/users', protect, ExtractJWTData, authRole, get_all_users);

router.get('/staff', protect, ExtractJWTData, authRole, get_staff_users);

router.post('/add_employee', protect, ExtractJWTData, authRole, add_employee);

router.patch('/update_employee/:id', protect, ExtractJWTData, authRole, update_employee);

router.delete('/delete_employee/:id', protect, ExtractJWTData, authRole, remove_employee )

//===========================================================================================================
module.exports = router;