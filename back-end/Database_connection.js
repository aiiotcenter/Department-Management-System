//===========================================================================================================
//? Import libraries 
//===========================================================================================================
const mysql = require('mysql2');
require('dotenv').config();

//===========================================================================================================
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dms',
    password:  process.env.Database_Password
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database:", error);
    } else {
        console.log("Connected to MySQL successfully");
    }
});

module.exports = connection;