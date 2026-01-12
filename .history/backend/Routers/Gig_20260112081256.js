const express = require('express');
const router = express.Router();
const Gig = require('../Models/Gig');
// Define gig routes here
// Example route
router.get('/', async (req, res) => {
     const search = req.query.search || "";

  const gigs = await Gig.find({
    status: "open",
    title: { $regex: search, $options: "i" }
  });

  res.json(gigs);
});


router.post("/", auth, async (req, res) => {
  const { title, description, budget } = req.body;

  const gig = await Gig.create({
    title,
    description,
    budget,
    ownerId: req.user.id, // login user
    status: "open"
  });

  res.status(201).json(gig);
});

module.exports = router;