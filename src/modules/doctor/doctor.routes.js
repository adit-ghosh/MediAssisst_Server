const express = require('express');
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const { getMyDoctorProfile } = require('./doctor.controller');

const router = express.Router();

router.get('/me', authenticateJWT, requireRole(['doctor']), getMyDoctorProfile);

module.exports = router;
