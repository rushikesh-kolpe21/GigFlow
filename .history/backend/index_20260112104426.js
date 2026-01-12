const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

// CORS configuration for cookies
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// load environment variables
require('dotenv').config();
require('./Models/dbConn');// only checking connection

// bid router
const bidRouter = require('./Routers/Bid');
app.use('/api/bids', bidRouter);

// gig router
const gigRouter = require('./Routers/Gig');
app.use('/api/gigs', gigRouter);


// Auth router
const authRouter = require('./Routers/Auth');
app.use('/api/auth', authRouter);

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
