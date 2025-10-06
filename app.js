const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database-config/db"); 

const userRoutes = require("./user-facility-routes/userRoutes");
const facilityRoutes = require("./user-facility-routes/facilityRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/facilities", facilityRoutes);

//START SERVER 
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
