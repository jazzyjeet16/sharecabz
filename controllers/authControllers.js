const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async(req, res) => {
    try {
        const { username, phone, email, password, confirmpassword, role } = req.body;

        if(!username || !phone || !email || !password || !confirmpassword){
            return res.status(403).json({
                success: false,
                message: "All Fields are required",
            });
        }

        if( password != confirmpassword ){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again."
            });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username:username,
            phone:phone,
            email:email,
            password:hashedPassword,
        })

        return res.status(200).json({
            success:true,
            user,
            message:"User registered successfully"
        })

    } catch (error) {
        console.error("SignUp error --> ", error)
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        })
    }
}

exports.login = async(req, res) => {
    try {
        console.log("Login")
    } catch (error) {
        console.log(error)
    }
}