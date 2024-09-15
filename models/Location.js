// this schema for admin the admin will have power to add source location destination and pickup point according to sorce location

const mongoose = require("mongoose");

const pickupPointSchema = new mongoose.Schema({
  pointName: {
    type: String,
    required: true,
  },
});

const destinationSchema = new mongoose.Schema({
  destinationName: {
    type: String,
    required: true,
  },
  pickupPoints: [pickupPointSchema], // Each destination has its pickup points
});

// Define the schema for Source Locations
const sourceLocationSchema = new mongoose.Schema(
  {
    sourceName: {
      type: String,
      required: true,
    },
    destinations: [destinationSchema], // Each source has multiple destinations
  },
  { timestamps: true }
);

const SourceLocation = mongoose.model("SourceLocation", sourceLocationSchema);

module.exports = SourceLocation;
