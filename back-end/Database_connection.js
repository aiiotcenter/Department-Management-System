const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',      
  password: 'DMS123-qaz', 
  database: 'dms'
});

// Export the pool for use in other parts of the application
module.exports = pool.promise();
