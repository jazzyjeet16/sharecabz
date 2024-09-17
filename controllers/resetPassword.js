const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already registered
    const checkUserPresent = await User.findOne({ email });

    // Generate a unique OTP
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure the OTP is unique by checking against the DB
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Create and save OTP with email
    const otpPayload = { email, otp, context: "resetPassword" };
    const otpBody = await OTP.create(otpPayload);

    console.log("OTP Body", otpBody);

    // You don't need to manually send the email here, the pre-save middleware handles it

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
    try {
        const {email, otp, newpassword, confirmpassword } =req.body;

        if(!email || !otp || !newpassword || !confirmpassword ){
            return res.status(403).json({
                success: false,
                message: "All Fields are required",
            });
        }

        if (newpassword !== confirmpassword) {
            return res.status(400).json({
                success: false,
                message: "New Password and Confirm Password do not match",
            });
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        // Update the user's password
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating password",
            error: error.message,
        });
    }
}