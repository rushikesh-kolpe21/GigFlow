const express = require('express');
const router = express.Router();

// Define gig routes here
// Example route
router.get('/', (req, res) => {
    res.send('Gig route is working');
});
module.exports = router;