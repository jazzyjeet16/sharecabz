const User = require("../models/User");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator");

exports.signup = async (req, res) => {
  try {
    const { username, phone, email, password, confirmpassword, otp, role } =
      req.body;

    if (
      !username ||
      !phone ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password != confirmpassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      phone: phone,
      email: email,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`,
      role: role,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("SignUp error --> ", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "72h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

// controller for logout

exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      expires: new Date(0),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error --> ", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
    });
  }
};

exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already registered
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }

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
    const otpPayload = { email, otp, context: "signUp" };
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

// exports.sendotp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if the user already exists
//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists. Please login instead.",
//     // Check if user is already present
//     // Find user with provided email
//     const checkUserPresent = await User.findOne({ email });
//     // to be used in case of signup

//     // If user found with provided email
//     if (checkUserPresent) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is Already Registered`,
//       });
//     }

//     // Generate a 4-digit OTP
//     let otp = otpGenerator.generate(4, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     // Ensure OTP is unique
//     let existingOTP = await OTP.findOne({ otp });
//     while (existingOTP) {
//     const result = await OTP.findOne({ otp: otp });
//     console.log("Result is Generate OTP Func");
//     console.log("OTP", otp);
//     console.log("Result", result);
//     while (result) {
//       otp = otpGenerator.generate(4, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       });
//       existingOTP = await OTP.findOne({ otp });
//     }

//     // Save the OTP to the database with the required fields
//     const otpRecord = await OTP.create({
//       email,
//       otp,
//       type: "signup",  // Specify the type as 'signup' here
//     });

//     // Send the OTP email (use your mail sending logic here)
//     await mailSender(email, "Signup OTP", signUpOtpTemplate(otp));

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully for signup.",
//     });
//   } catch (error) {
//     console.error("Error sending signup OTP:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to send OTP. Please try again later.",
//     });
//   }
// };

// // Send OTP for password reset
// exports.sendResetPasswordOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if the user with the provided email exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User with this email does not exist.",
//       });
//     }

//     // Generate OTP
//     let otp = otpGenerator.generate(4, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     });

//     // Check if this OTP is already generated to avoid duplication
//     let existingOTP = await OTP.findOne({ otp });
//     while (existingOTP) {
//       otp = otpGenerator.generate(4, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       });
//       existingOTP = await OTP.findOne({ otp });
//     }

//     // Save OTP to database with 1-minute expiration and type as 'passwordReset'
//     const otpRecord = await OTP.create({
//       email,
//       otp,
//       type: "passwordReset", // Specify the type as 'passwordReset' here
//     });

//     // Send OTP email
//     await mailSender(email, "Password Reset OTP", passwordResetTemplate(otp));

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully for password reset.",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error sending OTP. Please try again.",
//     });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword, confirmPassword } = req.body;

//     // Check if all fields are provided
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       return res.status(403).json({
//         success: false,
//         message: "All fields are required.",
//       });
//     }

//     // Check if passwords match
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Passwords do not match.",
//       });
//     }

//     // Find the latest OTP for the email
//     const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

//     // Check if OTP exists and is not expired
//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired OTP.",
//       });
//     }

//     // Validate OTP
//     if (otp !== otpRecord.otp) {
//       return res.status(400).json({
//         success: false,
//         message: "The OTP you entered is incorrect.",
//       });
//     }

//     // Find the user and update the password
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password
//     user.password = hashedPassword;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Password has been updated successfully. Please login.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again.",
//       error: error.message,
//     });
//   }
// };
//     }
//     const otpPayload = { email, otp };
//     const otpBody = await OTP.create(otpPayload);
//     console.log("OTP Body", otpBody);
//     res.status(200).json({
//       success: true,
//       message: `OTP Sent Successfully`,
//       otp,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
