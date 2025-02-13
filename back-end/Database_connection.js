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

// Signup API
app.post("/signup", upload.single("image"), async (req, res) => {
  const { name, email, studentID, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query(
    "INSERT INTO users (name, email, studentID, password) VALUES (?, ?, ?, ?)",
    [name, email, studentID, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Signup successful!" });
    }
  );
});

// Login API
app.post("/login", (req, res) => {
  const { studentID, password } = req.body;
  db.query("SELECT * FROM users WHERE studentID = ?", [studentID], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (validPassword) {
        const token = jwt.sign({ id: results[0].id }, "secretkey", { expiresIn: "1h" });
        return res.json({ success: true, token });
      }
    }
    res.json({ success: false, message: "Invalid credentials" });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));


module.exports = connection;