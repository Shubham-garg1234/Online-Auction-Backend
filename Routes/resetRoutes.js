
const express = require('express');
const resetController = require('../Controllers/resetController');
const router = express.Router();

router.post('/forgot-pass', resetController.forgotPass)
router.post('/verify-otp', resetController.verifyOtp)
router.post('/reset-pass', resetController.resetPass)

module.exports = router;

