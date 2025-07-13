const express = require('express');
const db = require('./Database_connection'); // Import database connection

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Test endpoint removed for security reasons
// The previous endpoint exposed all user data publicly without authentication

// This file should not start its own server as server.js handles that
// Export the app for use in server.js
module.exports = app;
