// routes/bid.js
const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { gigId, message, price } = req.body;

  // optional: prevent duplicate bid
  const alreadyBid = await Bid.findOne({
    gigId,
    freelancerId: req.user.id
  });

  if (alreadyBid) {
    return res.status(400).json({ message: "You already applied" });
  }

  const bid = await Bid.create({
    gigId,
    freelancerId: req.user.id, // 👈 from cookie (real user)
    message,
    price
  });

  res.status(201).json(bid);
});

module.exports = router;
