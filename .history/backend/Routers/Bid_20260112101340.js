const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");

router.post("/", async (req, res) => {
  const { gigId, message, price } = req.body;

  const bid = await Bid.create({
    gigId,
    message,
    price,
    freelancerId: "66b2b2b2b2b2b2b2b2b2b2b2", // 👈 dummy user
    status: "pending"
  });

  res.status(201).json(bid);
});

module.exports = router;
