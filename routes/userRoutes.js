const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
} = require("../controllers/userController");
const { auth, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all users - Admin only
router.get("/users", auth, isAdmin, getAllUsers);

// Get user by ID
router.get("/users/:id", auth, getUserById);

// Update user profile
router.put("/users/:id", auth, updateUser);

// Delete user - Admin only
router.delete("/users/:id", auth, isAdmin, deleteUser);

// Get logged-in user profile
router.get("/profile", auth, getProfile);

module.exports = router;
