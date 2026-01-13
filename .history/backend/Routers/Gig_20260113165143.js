const express = require('express');
const router = express.Router();
const Gig = require('../Models/Gig');
const auth = require('../Middlewares/auth');

// GET all gigs
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      status: "open",
      title: { $regex: search, $options: "i" }
    });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET my posted jobs
router.get("/my-jobs", auth, async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new gig
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    console.log(" Creating gig for user:", req.user.id);

    if (!title || !description || !budget) {
      return res.status(400).json({ error: "All fields required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
      status: "open"
    });

    console.log(" Gig created:", gig._id);
    res.status(201).json(gig);
  } catch (err) {
    console.error(" Gig creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;