// routes/bid.js
const express = require("express");
const router = express.Router();
const Bid = require("../Models/Bid");
const auth = require("../Middlewares/auth");

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

// my applications
router.get("/my", auth, async (req, res) => {
  const bids = await Bid.find({ freelancerId: req.user.id })
    .populate("gigId", "title budget status"); // gig details

  res.json(bids);
});

// get bids for a gig (only owner can see)
router.get("/:gigId", auth, async (req, res) => {
  const { gigId } = req.params;

  // 1️⃣ Gig find karo
  const gig = await Gig.findById(gigId);

  if (!gig) {
    return res.status(404).json({ message: "Gig not found" });
  }

  // 2️⃣ Owner check (CRUCIAL)
  if (gig.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  // 3️⃣ Is gig ke saare bids lao
  const bids = await Bid.find({ gigId })
    .populate("freelancerId", "name email");

  res.json(bids);
});

module.exports = router;
