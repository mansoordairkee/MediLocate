const express = require('express');
const router = express.Router();
const db = require('../database-config/db');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Verifying Admin Middleware
function verifyAdmin(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.admin = admin;
    next();
  });
}

// Total number of users
router.get("/facilities/count", varifyAdmin, (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM users", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalUsers: result[0].totalUsers });
  });
});

// Total number of facilities
router.get("/facilities/count", verifyAdmin, (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM facilities", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalFacilities: result[0].totalFacilities });
  });
});

// Active Sessions
let activeSessions = 1;0; // This should ideally be tracked in a more persistent way
router.get("/sessions/count", verifyAdmin, (req, res) => {
  res.json({ activeSessions });
});

module.exports = router;