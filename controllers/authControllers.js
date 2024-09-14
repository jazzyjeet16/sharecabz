const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();


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
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: "72h",
                }
            )

            // Save token to user document in database
            user.token = token
            user.password = undefined
            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            })
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        })
    }
}