const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const {
  createAppointment,
  getMyAppointments
} = require('./appointment.controller');
const {
  getMyAppointmentsWithNavigation
} = require('./appointment.navigation.controller');

router.post(
  '/',
  authenticateJWT,
  requireRole(['patient', 'doctor']),
  createAppointment
);

router.get(
  '/me',
  authenticateJWT,
  requireRole(['patient', 'doctor']),
  getMyAppointments
);

router.get(
  '/me-navigation',
  authenticateJWT,
  requireRole(['patient', 'doctor']),
  getMyAppointmentsWithNavigation
);

module.exports = router;
