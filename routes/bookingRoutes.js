const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  updateBookingStatus,
  deleteBooking,
  updateBooking,
} = require("../controllers/bookingController");

const { assignDriver } = require('../controllers/adminController')

// Create a new booking (user)
router.post("/createbooking", auth, createBooking);

// Get all bookings (admin only)
router.get("/getallbookings", auth, isAdmin, getAllBookings);

// Get a specific booking by ID
router.get("/getbooking/:bookingId", auth, isAdmin, getBookingById);

// Get bookings by user (user only)
router.get("/user/bookings", auth, getBookingsByUserId);

// Update booking status (admin only)
router.put("/getbooking/:bookingId/status", auth, isAdmin, updateBookingStatus);

// Delete a booking
router.delete("/deletebooking/:bookingId", auth, deleteBooking);

// Update booking (admin only route)
router.put("/updatebooking/:bookingId", auth, isAdmin, updateBooking);

router.put("/assign-driver/:bookingId", auth, isAdmin, assignDriver);

module.exports = router;
