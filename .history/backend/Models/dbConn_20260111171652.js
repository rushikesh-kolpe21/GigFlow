// require('dotenv').config();
const mongoose = require('mongoose');

// load environment variables
const mongo_url = process.env.MONGO_CONN;

// connect to MongoDB
mongoose.connect(mongo_url)
.then(conn => {
  console.log("✅ MongoDB Connected:", conn.connection.host);
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
 });
