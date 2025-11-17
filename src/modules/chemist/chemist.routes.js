const express = require('express');
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const { getMyChemistProfile } = require('./chemist.controller');

const router = express.Router();

router.get('/me', authenticateJWT, requireRole(['chemist']), getMyChemistProfile);

module.exports = router;