const express = require('express');
const router = express.Router();

// register route
router.post('/register',signup);

// Additional auth routes would go here
module.exports = router;