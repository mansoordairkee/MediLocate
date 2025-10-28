const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database-config/db"); 

const userRoutes = require("./user-facility-routes/userRoutes");
const facilityRoutes = require("./user-facility-routes/facilityRoutes");
const authRoutes = require("./user-facility-routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/facilities", facilityRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to MediLocate Backend API");
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

//START SERVER 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
