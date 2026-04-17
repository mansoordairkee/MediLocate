const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "https://medilocate-pjfg.onrender.com",
  user: "root",
  password: "mediloc@123",
  database: "mediloc",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;