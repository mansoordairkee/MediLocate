const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database-config/db"); 
// const mysql = require("mysql2");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const userRoutes = require("./user-facility-routes/userRoutes");
const facilityRoutes = require("./user-facility-routes/facilityRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/facilities", facilityRoutes);

// const JWT_SECRET = "your_secret_key";

// // Database connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "mediloc@123",   // your MySQL password
//   database: "mediloc"
// });

// db.connect((err) => {
//   if (err) console.error("Database connection failed:", err);
//   else console.log("Connected to MySQL Database");
// });

// // Middleware for JWT authentication
// function authMiddleware(req, res, next) {
//     let token = req.header("Authorization");
//     if (!token) return res.status(401).send({ error: "No token provided" });

//     // Accept Bearer <token> format
//     if (token.startsWith("Bearer ")) {
//         token = token.slice(7).trim();
//     }

//     try {
//         const verified = jwt.verify(token, JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch {
//         res.status(400).send({ error: "Invalid token" });
//     }
// }

// // ================= USER ROUTES =================

// // Register User
// app.post("/register", (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).send({ error: "All fields are required" });
//   }

//   const hashedPassword = bcrypt.hashSync(password, 10);

//   db.query(
//     "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//     [name, email, hashedPassword],
//     (err, result) => {
//       if (err) return res.status(500).send({ error: "Database error" });
//       res.status(201).send({ message: "User registered successfully" });
//     }
//   );
// });

// // Login User
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//     if (err) return res.status(500).send({ error: "Database error" });
//     if (results.length === 0)
//       return res.status(401).send({ error: "Invalid email or password" });

//     const user = results[0];
//     if (!bcrypt.compareSync(password, user.password)) {
//       return res.status(401).send({ error: "Invalid email or password" });
//     }

//     const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
//     res.send({ message: "Login successful", token });
//   });
// });

// // Get Profile
// app.get("/profile", authMiddleware, (req, res) => {
//   db.query(
//     "SELECT id, name, email FROM users WHERE id = ?",
//     [req.user.id],
//     (err, results) => {
//       if (err) return res.status(500).send({ error: "Database error" });
//       if (results.length === 0)
//         return res.status(404).send({ error: "User not found" });

//       res.send(results[0]);
//     }
//   );
// });

// // ================= FACILITY ROUTES =================

// // Add Facility
// app.post("/facilities", authMiddleware, (req, res) => {
//   const { name, type, latitude, longitude, contact } = req.body;
//   if (!name || !type || !latitude || !longitude || !contact) {
//     return res.status(400).send({ error: "All fields are required" });
//   }

//   db.query(
//     "INSERT INTO facilities (name, type, latitude, longitude, contact) VALUES (?, ?, ?, ?, ?)",
//     [name, type, latitude, longitude, contact],
//     (err, result) => {
//       if (err) return res.status(500).send({ error: "Database error" });
//       res.status(201).send({ message: "Facility added successfully" });
//     }
//   );
// });

// // Get All Facilities
// app.get("/facilities", (req, res) => {
//   const { type } = req.query;
//   let sql = "SELECT * FROM facilities";
//   const params = [];

//   if (type) {
//     sql += " WHERE type = ?";
//     params.push(type);
//   }

//   db.query(sql, params, (err, results) => {
//     if (err) return res.status(500).send({ error: "Database error" });
//     res.send(results);
//   });
// });

// // Get Nearest Facilities
// app.get("/facilities/nearest", (req, res) => {
//   const { latitude, longitude, type } = req.query;
//   if (!latitude || !longitude) {
//     return res.status(400).send({ error: "Latitude and Longitude are required" });
//   }

//   let sql = `
//     SELECT *, 
//     (6371 * acos(
//       cos(radians(?)) * cos(radians(latitude)) * 
//       cos(radians(longitude) - radians(?)) + 
//       sin(radians(?)) * sin(radians(latitude))
//     )) AS distance
//     FROM facilities
//   `;
//   let params = [latitude, longitude, latitude];

//   if (type) {
//     sql += " WHERE type = ?";
//     params.push(type);
//   }

//   sql += " ORDER BY distance LIMIT 10";

//   db.query(sql, params, (err, results) => {
//     if (err) return res.status(500).send({ error: "Database error" });
//     res.send(results);
//   });
// });

// //Search Hospitals Near User
// app.get("/facilities/search", (req, res) => {
//   const { latitude, longitude, type } = req.query;

//   if (!latitude || !longitude || !type) {
//     return res.status(400).send({ error: "Latitude, Longitude and type are required" });
//   }

//   const sql = `
//     SELECT *, 
//     (6371 * acos(
//       cos(radians(?)) * cos(radians(latitude)) * 
//       cos(radians(longitude) - radians(?)) + 
//       sin(radians(?)) * sin(radians(latitude))
//     )) AS distance
//     FROM facilities
//     WHERE type = ?
//     ORDER BY distance
//     LIMIT 10
//   `;

//   db.query(sql, [latitude, longitude, latitude, type], (err, results) => {
//     if (err) return res.status(500).send({ error: "Database error" });
//     res.send(results);
//   });
// });

//START SERVER 
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
