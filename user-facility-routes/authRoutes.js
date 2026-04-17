const express = require('express');
const router = express.Router();
const {signUp, login, adminLogin} = require('../user-facility-controllers/authController');

router.post('/signup', signUp);

router.post('/signup', (req,res,next) => {
    console.log("Signup route hit");
    next();
}, signUp);

router.post('/login', login);

router.post('/admin/login', adminLogin);

module.exports = router;