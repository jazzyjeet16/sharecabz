const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
<<<<<<< HEAD
const signupTemplate = require('../mailTemplates/signUpVerification');
const passwordResetTemplate = require('../mailTemplates/passwordResetVerification.js');
=======
const emailTemplate = require("../mailTemplates/signUpVerification");
>>>>>>> 5fa2512ff881dbbcb4601e8ea77b38b6ac1465dd

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
<<<<<<< HEAD
  type: {
    type: String,
    enum: ["signup", "resetPassword"],
    required: true, // specify whether it's for signup or password reset
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // Default expiration of 5 minute
  },
});

// Function to send verification email with OTP for signup
async function sendSignupEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Signup Verification OTP",
      signupTemplate(otp) // use signup template
    );
    console.log("Signup OTP email sent: ", mailResponse.response);
  } catch (error) {
    console.log("Error sending signup OTP email: ", error);
=======
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  // Create a transporter to send emails

  // Define the email options

  // Send the email
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
>>>>>>> 5fa2512ff881dbbcb4601e8ea77b38b6ac1465dd
    throw error;
  }
}

<<<<<<< HEAD
// Function to send OTP email for password reset
async function sendResetPasswordEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Password Reset OTP",
      passwordResetTemplate(otp) // use password reset template
    );
    console.log("Password reset OTP email sent: ", mailResponse.response);
  } catch (error) {
    console.log("Error sending password reset OTP email: ", error);
    throw error;
  }
}

// Pre-save hook to send email after OTP is generated
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.type === "signup") {
      await sendSignupEmail(this.email, this.otp);
    } else if (this.type === "resetPassword") {
      await sendResetPasswordEmail(this.email, this.otp);
    }
=======
// Define a post-save hook to send email after the document has been saved

  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
