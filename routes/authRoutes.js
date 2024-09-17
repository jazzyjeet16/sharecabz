const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { signup, login, sendotp,sendResetPasswordOTP,resetPassword } = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/login', login);
router.post("/sendotp", sendotp)
// password reset rout
router.post('/forgot-password', sendResetPasswordOTP);
router.post('/reset-password', resetPassword);

=======
const { signup, login, sendotp } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendotp);
>>>>>>> 5fa2512ff881dbbcb4601e8ea77b38b6ac1465dd

module.exports = router;
