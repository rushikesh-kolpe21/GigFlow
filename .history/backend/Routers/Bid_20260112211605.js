// routes/bid.js
const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");
const auth = require("../Middlewares/auth");
const Gig = require("../Models/Gig");

const mongoose = require("mongoose");

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

// hire a freelancer (select a bid)

router.patch("/:bidId/hire", auth, async (req, res) => {
  try {
    const { bidId } = req.params;

    // 1️⃣ Selected bid lao
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // 2️⃣ Gig lao
    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 3️⃣ Owner check
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 4️⃣ Gig already assigned?
    if (gig.status === "assigned") {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // 5️⃣ Gig status update
    gig.status = "assigned";
    await gig.save();

    // 6️⃣ Selected bid → hired
    bid.status = "hired";
    await bid.save();

    // 7️⃣ Other bids → rejected
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.json({ message: "Freelancer hired successfully" });

  } catch (error) {
    console.error("Hire error:", error);
    res.status(500).json({ message: error.message || "Hiring failed" });
  }
});

module.exports = router;
