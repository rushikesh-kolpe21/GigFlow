// routes/bid.js
const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");
const auth = require("../Middlewares/auth");
const Gig = require("../Models/Gig");

router.post("/", auth, async (req, res) => {
  try {
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
      freelancerId: req.user.id, // from cookie (real user)
      message,
      price
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// my applications
router.get("/my", auth, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate("gigId", "title budget status"); // gig details

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// get bids for a gig (only owner can see)
router.get("/gig/:gigId", auth, async (req, res) => {
  try {
    const { gigId } = req.params;

    // Find gig
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Owner check
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // All bids for this gig
    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "firstName lastName email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
