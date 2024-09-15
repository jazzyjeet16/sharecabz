const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//********************************Import Routes********************************
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const locationRoutes = require("./routes/locationRoutes");

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
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/location", locationRoutes);

//********************************start server********************************
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running successfully at ${PORT}`);
});
