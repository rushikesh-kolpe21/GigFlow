const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require("http");
const { Server } = require("socket.io");

// CORS configuration for cookies
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// load environment variables
require('dotenv').config();
require('./Models/dbConn');// only checking connection

const server = http.createServer(app);


// Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// userId - socketId map
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
     onlineUsers.set(userId.toString(), socket.id);
     console.log(` User registered: ${userId.toString()} -> ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    }
  });
});

// make available in routes
app.set("io", io);
app.set("onlineUsers", onlineUsers);



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
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
