const express = require('express');
const router = express.Router();
const authController = require('../auth-controllers/authController');

router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;