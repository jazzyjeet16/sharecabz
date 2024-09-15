const mongoose = require("mongoose");

// Define the Pickup Point schema
const pickupPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Name of the pickup point
  description: { type: String }, // Optional description for the pickup point
});

// Define the Location schema
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the location (e.g., Gangtok, Darjeeling)
  type: {
    // Type of location (e.g., source, destination)
    type: String,
    enum: ["source", "destination"],
    required: true,
  },
  pickupPoints: [pickupPointSchema], // Array of pickup points associated with the location
});

// Create the Location model
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
