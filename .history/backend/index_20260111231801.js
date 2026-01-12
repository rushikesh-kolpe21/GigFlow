const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

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
