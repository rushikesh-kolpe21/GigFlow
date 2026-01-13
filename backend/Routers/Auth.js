const express = require('express');
const router = express.Router();
const { signup,login } = require('../Controllers/AuthControllers');
const { signValidation, loginValidation } = require('../Middlewares/Auth/AuthValidation');
const { googleLogin } = require('../Controllers/AuthGoogleControllers');

// register route
router.post('/register', signValidation, signup);

// login route
router.post('/login', loginValidation, login);

// google auth endpoint
router.post('/google', googleLogin);


// Additional auth routes would go here
module.exports = router;