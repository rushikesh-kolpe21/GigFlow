// models/Gig.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gigSchema = new Schema({
  title: String,
  description: String,
  budget: Number,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open"
  }
});

module.exports = mongoose.model("Gig", gigSchema);
