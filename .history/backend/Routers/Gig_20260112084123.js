const express = require('express');
const router = express.Router();
const Gig = require('../Models/Gig');

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

// POST new gig
router.post("/", async (req, res) => {
  try {
    const { title, description, budget, ownerId } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId,
      status: "open"
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;