const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./database-config/db"); 

const userRoutes = require("./user-facility-routes/userRoutes");
const facilityRoutes = require("./user-facility-routes/facilityRoutes");
const authRoutes = require("./user-facility-routes/authRoutes");
const adminRoutes = require("./user-facility-routes/adminRoutes")

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to MediLocate Backend API");
});


//START SERVER 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
