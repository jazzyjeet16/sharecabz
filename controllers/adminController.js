const Booking = require("../models/Booking");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const smsSender = require("../utils/smsSender");

exports.assignDriver = async (req, res) => {
  try {
    const { bookingId, driverDetails } = req.body;
    
    // Ensure the admin provides the required driver details
    if (!driverDetails.name || !driverDetails.contactNumber || !driverDetails.cabNumber || !driverDetails.carModel) {
      return res.status(400).json({
        success: false,
        message: "All  details are required.",
      });
    }

    // Find the booking and update it with driver information
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { driver: driverDetails },
      { new: true }
    ).populate("userId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const user = booking.userId;

    // Send driver details to the user via email
    const emailBody = `
      <h3>Driver Assigned for Your Booking</h3>
      <p>Dear ${user.username},</p>
      <p>Your driver details for the trip from ${booking.sourceLocation} to ${booking.destinationLocation} are as follows:</p>
      <ul>
        <li><strong>Driver Name:</strong> ${driverDetails.name}</li>
        <li><strong>Contact Number:</strong> ${driverDetails.contactNumber}</li>
        <li><strong>Cab Number:</strong> ${driverDetails.cabNumber}</li>
        <li><strong>Car Model:</strong> ${driverDetails.carModel}</li>
      </ul>
      <p>We hope you have a pleasant trip!</p>
    `;
    
    await mailSender(user.email, "Driver Assigned for Your Booking", emailBody);

    // Send SMS with driver details
    const smsMessage = `Your driver for the trip from ${booking.sourceLocation} to ${booking.destinationLocation}: Driver Name: ${driverDetails.name}, Contact: ${driverDetails.contactNumber}, Cab: ${driverDetails.cabNumber}, Car Model: ${driverDetails.carModel}. Have a pleasant trip!`;
    
    await smsSender(user.phone, smsMessage);

    return res.status(200).json({
      success: true,
      message: "Driver details assigned and notification sent to the user.",
      booking,
    });
  } catch (error) {
    console.error("Error assigning driver:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign driver. Please try again.",
    });
  }
};
