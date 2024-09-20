const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const signUpTemplate = require("../mailTemplates/signUpVerification");
const passwordResetTemplate = require("../mailTemplates/passwordResetVerification"); // Import password reset template

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  context: {
    type: String, // To store the context like 'resetPassword' or 'signUp'
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp, context) {
  // Choose the template based on context
  let emailTemplate;
  let subject;

  if (context === "resetPassword") {
    emailTemplate = passwordResetTemplate(otp);
    subject = "Password Reset OTP";
  } else if (context === "signUp") {
    emailTemplate = signUpTemplate(otp);
    subject = "SignUp Verification Email";
  }

  // Send the email using mailSender
  try {
    const mailResponse = await mailSender(email, subject, emailTemplate);
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp, this.context); // Pass context to select template
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
