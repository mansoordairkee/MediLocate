const express = require("express");
const router = express.Router();
const auth = require("../jwt-middleware/authentication");
const userController = require("../user-facility-controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", auth, userController.getProfile);

module.exports = router;
