const express = require('express');
const router = express.Router();
const { authenticateJWT, requireRole } = require('../../middlewares/auth.middleware');
const {
  createPrescriptionForPatient,
  getMyDoctorPrescriptions,
  getMyPatientPrescriptions,
  getAllPrescriptions 
} = require('./prescription.controller');

router.post(
  '/',
  authenticateJWT,
  requireRole(['doctor']),
  createPrescriptionForPatient
);

router.get(
  '/doctor/me',
  authenticateJWT,
  requireRole(['doctor']),
  getMyDoctorPrescriptions
);

router.get(
  '/patient/me',
  authenticateJWT,
  requireRole(['patient']),
  getMyPatientPrescriptions
);

router.get(
  '/',
  authenticateJWT,
  requireRole(['chemist']),
  getAllPrescriptions
);

module.exports = router;