const express = require('express');
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const { getMyPatientProfile } = require('./patient.controller');

const router = express.Router();

router.get('/me', authenticateJWT, requireRole(['patient']), getMyPatientProfile);

module.exports = router;
