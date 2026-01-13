
const mongoose = require('mongoose');


const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
.then(conn => {
  console.log(" MongoDB Connected:", conn.connection.host);
})
.catch(err => {
  console.error(" MongoDB connection error:", err);
 });
