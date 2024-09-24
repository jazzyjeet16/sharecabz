// bookingController.js
const Booking = require("../models/Booking");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const driversTemplate = require('../mailTemplates/driverDetails')

const assignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, contactNumber, cabNumber, carModel } = req.body;

    if(!name || !contactNumber || !cabNumber || !carModel){
      return res.status(403).json({
        success:false,
        message:'Fill all credentials'
      })
    }

    const booking = await Booking.findById(bookingId).populate('userId');
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    // Update booking with driver details
    booking.driver = {
      name,
      contactNumber,
      cabNumber,
      carModel,
    };

    await booking.save();

    const userEmail = booking.userId.email;
    const username = booking.userId.username;

    const emailBody = driversTemplate(
      username,
      booking.sourceLocation,
      booking.destinationLocation,
      name,
      contactNumber,
      cabNumber,
      carModel
    );

    const mailResponse = await mailSender(userEmail, "Driver Assigned for Your Booking by Share Cabz", emailBody);

    res.status(200).json({ 
      success:true,
      booking,
      message: "Driver details assigned and email sent successfully." 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success:false,
      message: "Something went wrong", 
      error: error.message 
    });
  }
};

module.exports = { assignDriver };
