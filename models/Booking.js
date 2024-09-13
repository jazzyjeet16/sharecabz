const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startLocation: {
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
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models("Booking", bookingSchema);
