const express = require("express");
const router = express.Router();
const db = require("../database-config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ================= CALCULATING DISTANCE ================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ================= VERIFY ADMIN =================
function verifyAdmin(req, res, next) {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Admin access only"
      });
    }

    req.admin = decoded;
    next();

  } catch (error) {

    return res.status(403).json({
      error: "Invalid token"
    });

  }
}


// ================= DASHBOARD STATS =================
router.get("/stats", verifyAdmin, async (req, res) => {
  try {

    const [userResult] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [facilityResult] = await db.query(
      "SELECT COUNT(*) AS totalFacilities FROM facilities1"
    );

    res.json({
      totalUsers: userResult[0].totalUsers,
      totalFacilities: facilityResult[0].totalFacilities,
      activeSessions: 1
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= ADD FACILITY =================
router.post("/facilities", verifyAdmin, async (req, res) => {
  try {

    const {
      name,
      type,
      category,
      address,
      phone,
      rating,
      distance
    } = req.body;

    if (
      !name ||
      !type ||
      !category ||
      !address ||
      !phone ||
      !rating ||
      !distance
    ) {
      return res.status(400).json({
        error: "All fields required"
      });
    }

    // Generate ID
    let prefix = "f";

    if (type.toLowerCase().includes("hospital")) prefix = "h";
    if (type.toLowerCase().includes("pharmacy")) prefix = "p";
    if (type.toLowerCase().includes("blood")) prefix = "b";

    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM facilities1 WHERE id LIKE ?",
      [`${prefix}%`]
    );

    const newId = prefix + (rows[0].count + 1);

    await db.query(
      `INSERT INTO facilities1
      (id, name, type, category, address, phone, rating, distance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, name, type, category, address, phone, rating, distance]
    );

    res.json({
      message: "Facility added successfully",
      id: newId
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }
});


// ================= GET FACILITIES =================
router.get("/facilities", verifyAdmin, async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const [result] = await db.query("SELECT * FROM facilities1");

    let facilities = result;

    // 🔥 If location provided → calculate distance
    if (lat && lng) {
      facilities = facilities.map(f => {
        if (f.latitude && f.longitude) {
          const distance = calculateDistance(
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(f.latitude),
            parseFloat(f.longitude)
          );

          return { ...f, distance };
        }
        return { ...f, distance: null };
      });

      // 🔥 Sort by nearest
      facilities.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    res.json(facilities);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE FACILITY =================
router.put("/facilities/:id", verifyAdmin, async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      type,
      category,
      address,
      phone,
      rating,
      distance
    } = req.body;

    await db.query(
      `UPDATE facilities1
       SET name=?, type=?, category=?, address=?, phone=?, rating=?, distance=?
       WHERE id=?`,
      [name, type, category, address, phone, rating, distance, id]
    );

    res.json({
      message: "Facility updated successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE FACILITY =================
router.delete("/facilities/:id", verifyAdmin, async (req, res) => {
  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM facilities1 WHERE id=?",
      [id]
    );

    res.json({
      message: "Facility deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;