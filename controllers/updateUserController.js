const User = require("../models/User");
const cloudinary = require("../config/cloudinary.js");
const bcrypt= require('bcrypt');

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone, email,password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user is authorized to update the profile
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this profile",
      });
    }

    let imageUrl;

    // Check if there's an image in the request and upload it to Cloudinary
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'profile_pictures', // Optional: define folder in Cloudinary
      });
      imageUrl = result.secure_url; // Get the image URL
    }

    // Update the user data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        username, 
        phone, 
        email,
        password:hashedPassword,
        image: imageUrl || `https://api.dicebear.com/5.x/initials/svg?seed=${username}`  // If an image was uploaded, use the URL
      },
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
