//===============================================================================================================
//?  Importing  registering function and the database connection
//===============================================================================================================
const {global_register} = require('./Register_controller');// reuse register function for better structure
const database = require('../Database_connection');


//===============================================================================================================
//?  GET, basic function 
//===============================================================================================================

const admin_page = (req, res) => { /// testing
    res.json({message: `Hello, you are admin`});
};

//===============================================================================================================
//? POST, funciton to add new employees
//===============================================================================================================

function add_employee(req, res) {
    try {
        global_register({
            name: req.body.name,
            role: req.body.role,
            email: req.body.email,
            photo_path: req.body.photo_path,
            password: req.body.password
            }, res);
    } catch (error) {
        console.error("Error in add_employee function:", error);
        return res.status(500).json({ message: 'Error occurred while adding employee', error: error.message });
    }
}

//===============================================================================================================
//? DELETE, delete employees 
//===============================================================================================================

function remove_employee(req, res){
    const {id} = req.params; // this extract the employee id from the url 
    
    // Check user existence in the system ----------------------------------------------------------------------
    database.query('SELECT * FROM users WHERE User_ID = ?', [id], async (error, results) => {
    if (error){
        console.error("Database error: ", error);
        return res.status(500).json({ message: `Database Error : ${error}`});
    }
    if (results.length === 0 ){
        return res.status(500).json({ message: `No user found wiht this id ${id}`});
    }

    // If the user user exists, then remove it from the system---------------------------------------------------
    try{
        database.query('DELETE FROM users WHERE User_ID = ?', [id], async (error, results) => {
        if (error){
            console.error("Database error: ", error);
            return res.status(500).json({ message: `Database Error occured while removing employee : ${error}`});
        }
        console.log(`employee with this id: ${id} is successfully removed`);
        return res.status(201).json({message: `employee with this id: ${id} is successfully removed`});

    });

    }catch(error){
        console.log(`error occured while removing user from system ${error}`);
        res.status(500).json({message: 'Internal Server Error', error: error.message });
    }
    }) 
};

//========================================================================================================

module.exports.admin_page = admin_page;
module.exports.add_employee = add_employee;
module.exports.remove_employee = remove_employee;
