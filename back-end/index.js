const express = require('express');
const db = require('./Database_connection'); // Import database connection

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Test endpoint: Fetch all rows from a table
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows); // Send the rows as a JSON response
  } catch (error) {
    res.status(500).send('Database query failed');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
