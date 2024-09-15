const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  getLocationsByType,
} = require("../controllers/locationController");

// Create a new location (admin only)
router.post("/location", auth, isAdmin, createLocation);

// Update a location (admin only)
router.put("/location/:locationId", auth, isAdmin, updateLocation);

// Delete a location (admin only)
router.delete("/location/:locationId", auth, isAdmin, deleteLocation);

// Get all locations (admin only)
router.get("/locations", auth, isAdmin, getAllLocations);

// Get locations by type (source or destination, no admin check)
router.get("/locations/:type", auth, getLocationsByType);

module.exports = router;
