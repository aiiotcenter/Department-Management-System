//===========================================================================================================
//? Import Required Modules and Set Port:
//===========================================================================================================
const http = require('http')
const port = process.env.PORT || 3001; // Use environment variable or default to 3001

//===========================================================================================================
//? Create HTTP Server and Initialize Express App:
//===========================================================================================================
const app = require('./app');
const server = http.createServer(app); //method to creates an HTTP server and passes Express app to handle incoming requests.

//===========================================================================================================
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});