const express = require('express');
const { signup, login,cashierLogin,cashierSignup } = require('../Controllers/authController');
const { verifyToken, verifyAdmin } = require('../Middlewares/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/cashierSignup', verifyToken, verifyAdmin, cashierSignup);
router.post('/cashierLogin', cashierLogin);

module.exports = router;