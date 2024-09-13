const express = require ("express");
require('dotenv').config();
const connectDB = require('./config/database');

//********************************Import Routes********************************
const authRoutes = require('./routes/authRoutes')

//********************************database connection********************************
connectDB();

//********************************middlewares********************************
const app = express();
app.use(express.json());

//********************************Routes********************************
app.use('/api/auth', authRoutes);

//********************************start server********************************
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is running successfully at ${PORT}`)
})