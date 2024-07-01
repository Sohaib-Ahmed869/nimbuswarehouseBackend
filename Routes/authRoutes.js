const express = require('express');
const { signup, login,cashierLogin,cashierSignup } = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/cashierSignup', cashierSignup);
router.post('/cashierLogin', cashierLogin);


module.exports = router;