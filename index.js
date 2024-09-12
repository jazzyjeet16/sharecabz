const express = require ("express");
require('dotenv').config();

//********************************middlewares********************************
const app = express();
app.use(express.json());

//********************************start server********************************
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is running successfully at ${PORT}`)
})