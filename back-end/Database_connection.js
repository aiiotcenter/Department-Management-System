//===========================================================================================================
//? Import libraries 
//===========================================================================================================
const mysql = require('mysql2');
require('dotenv').config();

//===========================================================================================================
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'dms',
    password:  process.env.Database_Password,
    waitForConnections: true,
    connectionLimit: 10, // Allow multiple simultaneous connections
    queueLimit: 0
});

//Use .promise() to enable async/await queries
const promise_pool = pool.promise();

//test the connection
promise_pool.getConnection()
    .then((conn) => {
        console.log("Connected to MySQL successfully");
        conn.release(); // Release connection after testing
    })
    .catch((error) => console.error("Error connecting to database:", error));
//===========================================================================================================

module.exports = promise_pool;