const User = require("../models/User");
const bcrypt = require("bcrypt");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get all users (Admin access only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update user profile (self-update only, admin can update any user)
exports.updateUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    const userId = req.user.id;
    let imageUrl; // Declare imageUrl to store image URL

    // Check if the user is authorized to update the profile
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile",
      });
    }

    // Hash the password only if it's provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Handle image upload if image is provided
    if (req.files && req.files.image) {
      const displayPicture = req.files.image;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      imageUrl = image.secure_url; // Extract only the URL or secure URL
    }

    // Prepare updated fields
    const updatedFields = {
      username,
      phone,
      email,
      image:
        imageUrl ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${username}`, // Use imageUrl if available
    };

    // Include password only if it's being updated
    if (hashedPassword) {
      updatedFields.password = hashedPassword;
    }

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// Delete a user (Admin access only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin can delete any user
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this user",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};
