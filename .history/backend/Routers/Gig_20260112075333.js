const express = require('express');
const router = express.Router();

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
module.exports = router;