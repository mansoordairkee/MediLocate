const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database-config/db");
require("dotenv").config();


// ================= USER SIGNUP =================

exports.signUp = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // Check if user exists
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Signup successful"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Internal server error"
    });

  }
};



// ================= USER LOGIN =================

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        role: "user",
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Internal server error"
    });

  }
};

// ================= ADMIN SIGNUP =================

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    //  Check admin secret key
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        error: "Unauthorized: Invalid admin key"
      });
    }

    //  Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    //  Check if admin already exists
    const [existingAdmin] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        error: "Admin already exists"
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Insert admin into DB
    await db.query(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Admin signup successful"
    });

  } catch (error) {
    console.error("Admin Signup Error:", error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
};

// ================= ADMIN LOGIN =================

exports.adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res.status(400).json({
        error: "Admin not found"
      });
    }

    const admin = result[0];

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        id: admin.id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Internal server error"
    });

  }
};