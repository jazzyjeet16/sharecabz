const Booking = require("../models/Booking");

exports.bookCab = async (req, res) => {
  const {
    userId,
    startLocation,
    destinationLocation,
    pickupPoint,
    seats,
    startDate,
    endDate,
  } = req.body;

  const newBooking = new Booking({
    user: userId,
    startLocation,
    destinationLocation,
    pickupPoint,
    seats,
    startDate,
    endDate,
  });

  await newBooking.save();
  res.status(201).json({ message: "Booking successful" });
};

// get all booking function (for admins only)

exports.getBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user");
  res.status(200).json(bookings);
};
