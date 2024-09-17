const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
} = require("../controllers/userController.js");
const { auth, isAdmin } = require("../middlewares/authMiddleware.js");
const { upload } = require('../middlewares/multerMiddleware.js');

const router = express.Router();

// Get all users - Admin only
router.get("/getallusers", auth, isAdmin, getAllUsers);

// Get user by ID
router.get("/getuser/:id", auth, getUserById);

// Update user profile
router.put("/update", auth, updateUser);

// Delete user - Admin only
router.delete("/deleteuser/:id", auth, isAdmin, deleteUser);

// Get logged-in user profile
router.get("/profile", auth, getProfile);

module.exports = router;
