const db = require("../database-config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key";

// This code will help the user to register and login, and view their profile

// Firstly the User Registration
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).send({ error: "All fields are required" });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).send({ error: "Database error" });
      res.status(201).send({ message: "User registered successfully" });
    }
  );
};

// Secondly the User Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send({ error: "Database error" });
    if (results.length === 0)
      return res.status(401).send({ error: "Invalid email or password" });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).send({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.send({ message: "Login successful", token });
  });
};

// Lastly the User Profile
exports.getProfile = (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).send({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).send({ error: "User not found" });

      res.send(results[0]);
    }
  );
};
