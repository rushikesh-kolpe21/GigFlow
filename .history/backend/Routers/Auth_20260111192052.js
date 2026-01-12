const express = require('express');
const router = express.Router();
const { signup,login } = require('../Controllers/AuthControllers');

// register route
router.post('/signup',signup);

// login route
router.post('/login', login);



// Additional auth routes would go here
module.exports = router;