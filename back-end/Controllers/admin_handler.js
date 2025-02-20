//===============================================================================================================
//?  Importing  registering function and the database connection
//===============================================================================================================
const { global_register } = require('./Register_controller');
const database = require('../Database_connection');

//===============================================================================================================
//?  GET, basic function
//===============================================================================================================

const admin_page = (req, res) => { 
    res.json({ message: `Hello, you are admin` });
};

//===============================================================================================================
//? POST, function to add new employees
//===============================================================================================================

const add_employee = async (req, res) => {
    try {
        await global_register({
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
};

//===============================================================================================================
//? DELETE, remove employees
//===============================================================================================================

const remove_employee = async (req, res) => {
    const { id } = req.params; // this extracts the employee id from the URL

    try {
        // Check user existence in the system
        const [results] = await database.query('SELECT * FROM users WHERE User_ID = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: `No user found with this ID: ${id}` });
        }

        // If the user exists, then remove it from the system
        await database.query('DELETE FROM users WHERE User_ID = ?', [id]);
        console.log(`Employee with ID: ${id} is successfully removed`);
        return res.status(201).json({ message: `Employee with ID: ${id} is successfully removed` });
    } catch (error) {
        console.error(`Error occurred while removing employee: ${error}`);
        return res.status(500).json({ message: 'Error occurred while removing employee', error: error.message });
    }
};


//========================================================================================================

module.exports.admin_page = admin_page;
module.exports.add_employee = add_employee;
module.exports.remove_employee = remove_employee;
