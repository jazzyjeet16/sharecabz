const Location = require("../models/Location");

// Controller to create a new location (admin only)
exports.createLocation = async (req, res) => {
  try {
    const { name, type, pickupPoints } = req.body;

    // Create a new Location object
    const newLocation = new Location({
      name,
      type,
      pickupPoints,
    });

    // Save to database
    await newLocation.save();

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      location: newLocation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating location", error });
  }
};

// Controller to update a location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const updatedData = req.body;

    // Find location by ID and update it
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      updatedData,
      { new: true }
    );

    if (!updatedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: updatedLocation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating location", error });
  }
};

// Controller to delete a location (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    // Find location by ID and delete it
    const deletedLocation = await Location.findByIdAndDelete(locationId);

    if (!deletedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
      location: deletedLocation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting location", error });
  }
};

// Controller to get all locations (admin only)
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching locations", error });
  }
};

// Controller to get locations by type (source or destination)
exports.getLocationsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Validate the type parameter
    if (type !== "source" && type !== "destination") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid location type" });
    }

    // Find locations by type
    const locations = await Location.find({ type });

    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching locations", error });
  }
};
