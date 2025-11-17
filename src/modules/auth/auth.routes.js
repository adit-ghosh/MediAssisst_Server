const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('./auth.controller');
const { authenticateJWT } = require('../../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateJWT, logout);

module.exports = router;
