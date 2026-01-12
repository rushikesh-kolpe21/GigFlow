const express = require('express');
const router = express.Router();

// register route
router.post('/register', (req, res) => {
    // registration logic here
    res.send('User registered');
});