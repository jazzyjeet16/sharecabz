const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendotp,
  logout,
} = require("../controllers/authControllers");
const { sendResetOtp, resetPassword } = require("../controllers/resetPassword");

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendotp);
router.post("/logout", logout);
router.post("/resetOtp", sendResetOtp);
router.post("/resetpassword", resetPassword);

module.exports = router;
