const express = require('express');
const router = express.Router();
const { signup, login, sendotp,sendResetPasswordOTP,resetPassword } = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/login', login);
router.post("/sendotp", sendotp)
// password reset rout
router.post('/forgot-password', sendResetPasswordOTP);
router.post('/reset-password', resetPassword);


module.exports = router;