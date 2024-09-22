const createBookingTemplate = require("../mailTemplates/bookingConfirmation");
const cancelBookingTemplate = require("../mailTemplates/cancelBooking");
const Booking = require("../models/Booking");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      sourceLocation,
      destinationLocation,
      pickupPoint,
      seats,
      departureTime,
      startDate,
      endDate,
    } = req.body;

    // Fetch the user's username from the database using the user ID from req.user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Calculate the total days between start and end date
    const totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    // Create a new booking
    const newBooking = new Booking({
      userId: req.user._id, // assuming req.user is populated with authenticated user details
      username: user.username,
      sourceLocation,
      destinationLocation,
      pickupPoint,
      seats,
      departureTime,
      startDate,
      endDate,
      totalDays,
    });

    // Save booking to the database
    await newBooking.save();

    const userEmail = user.email;
    const emailBody = createBookingTemplate(
      newBooking.username,
      newBooking.sourceLocation,
      newBooking.destinationLocation,
      newBooking.startDate,
      newBooking.departureTime,
      newBooking.pickupPoint,
      newBooking.seats
    );

    const mailResponse = await mailSender(userEmail, "Your booking is confirmed with ShareCabz", emailBody);

    res.status(201).json({
      success: true,
      mailResponse,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating booking", error });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "phone email"); // Populating user details

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings", error });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate(
      "userId",
      "phone email image"
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching booking", error });
  }
};

// Get bookings by user ID (for users to view their bookings)
exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(1);;

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching bookings", error });
  }
};

// Update booking status (admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body;

    // Update booking's payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error,
    });
  }
};

// Delete a booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingToDelete = await Booking.findById(bookingId).populate('userId');

    if (!bookingToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const userEmail = bookingToDelete.userId.email;

    // Find and delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    const emailBody = cancelBookingTemplate(
      bookingToDelete.username,
      bookingToDelete.sourceLocation,
      bookingToDelete.destinationLocation,
      bookingToDelete.startDate,
      bookingToDelete.departureTime
    );

    const mailResponse = await mailSender(userEmail, "Your Booking in Share Cabz is cancelled", emailBody);

    res.status(200).json({
      success: true,
      mailResponse,
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
      console.log(error);
      res.status(500).json({ 
        success: false, 
        message: "Error deleting booking", 
        error 
      });
  }
};

// Update booking status and driver details (admin only)
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, driver } = req.body;

    // Update booking's payment status and driver details
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus,
        driver: {
          name: driver?.name,
          contactNumber: driver?.contactNumber,
          cabNumber: driver?.cabNumber,
          carModel: driver?.carModel,
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error,
    });
  }
};
