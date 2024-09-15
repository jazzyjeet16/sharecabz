const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceLocation: {
      type: String,
      required: true,
    },
    destinationLocation: {
      type: String,
      required: true,
    },
    pickupPoint: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    // Storing all driver info in a single field
    driver: {
      name: { type: String, required: true },
      contactNumber: { type: String, required: true },
      cabNumber: { type: String, required: true },
      carModel: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
