const express = require('express');
const router = express.Router();
const { signup } = require('../Controllers/AuthControllers');

// register route
router.post('/register',signup);

// login route
router.post('/login', login);



// Additional auth routes would go here
module.exports = router;