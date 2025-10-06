const express = require("express");
const router = express.Router();
const auth = require("../jwt-middleware/authentication");
const facilityController = require("../user-facility-controllers/facilityController");

router.post("/", auth, facilityController.addFacility);
router.get("/", facilityController.getFacilities);
router.get("/nearest", facilityController.getNearestFacilities);

module.exports = router;
