const express = require ("express");
require('dotenv').config();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors");

//********************************Import Routes********************************
const authRoutes = require('./routes/authRoutes')

//********************************database connection********************************
connectDB();

//********************************middlewares********************************
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

//********************************Routes********************************
app.use('/api/auth', authRoutes);

//********************************start server********************************
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is running successfully at ${PORT}`)
})