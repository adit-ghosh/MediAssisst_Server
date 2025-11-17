const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const { sendOTP, verifyOTP } = require('./otp.controller');

router.post('/send', authenticateJWT, requireRole(['doctor', 'chemist']), sendOTP);
router.post('/verify', authenticateJWT, requireRole(['doctor', 'chemist']), verifyOTP);

module.exports = router;
