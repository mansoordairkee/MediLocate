const db = require("../database-config/db");

// A user can add a facility, view all facilities, and find nearest facilities based on location
exports.addFacility = (req, res) => {
  const { name, type, latitude, longitude, contact } = req.body;
  if (!name || !type || !latitude || !longitude || !contact)
    return res.status(400).send({ error: "All fields are required" });

  db.query(
    "INSERT INTO facilities (name, type, latitude, longitude, contact) VALUES (?, ?, ?, ?, ?)",
    [name, type, latitude, longitude, contact],
    (err) => {
      if (err) return res.status(500).send({ error: "Database error" });
      res.status(201).send({ message: "Facility added successfully" });
    }
  );
};

// A user can view all facilities or filter by type
exports.getFacilities = (req, res) => {
  const { type } = req.query;
  let sql = "SELECT * FROM facilities";
  const params = [];

  if (type) {
    sql += " WHERE type = ?";
    params.push(type);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send({ error: "Database error" });
    res.send(results);
  });
};

// A user can get nearest facilities based on their location
exports.getNearestFacilities = (req, res) => {
  const { latitude, longitude, type } = req.query;
  if (!latitude || !longitude)
    return res
      .status(400)
      .send({ error: "Latitude and Longitude are required" });

  let sql = `
    SELECT *, 
    (6371 * acos(
      cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + 
      sin(radians(?)) * sin(radians(latitude))
    )) AS distance
    FROM facilities
  `;
  let params = [latitude, longitude, latitude];

  if (type) {
    sql += " WHERE type = ?";
    params.push(type);
  }

  sql += " ORDER BY distance LIMIT 10";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send({ error: "Database error" });
    res.send(results);
  });
};
