const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// load environment variables
require('dotenv').config();
require('./Models/dbConn');// only checking connection


// Auth router
const authRouter = require('./Routers/Auth');
app.use('/api/auth', authRouter);
// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
