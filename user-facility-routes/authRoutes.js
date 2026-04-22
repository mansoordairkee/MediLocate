const express = require('express');
const router = express.Router();
const {signUp, login, adminLogin, adminSignup} = require('../user-facility-controllers/authController');

router.post('/signup', signUp);

router.post('/signup', (req,res,next) => {
    console.log("Signup route hit");
    next();
}, signUp);

router.post('/login', login);

router.post('/admin/login', adminLogin);
router.post('/admin/signup', adminSignup);

module.exports = router;