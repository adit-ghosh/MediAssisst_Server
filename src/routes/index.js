const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const patientRoutes = require('../modules/patient/patient.routes');
const doctorRoutes = require('../modules/doctor/doctor.routes');
const prescriptionRoutes = require('../modules/prescription/prescription.routes');
const appointmentRoutes = require('../modules/appointment/appointment.routes');
const accessRoutes = require('../modules/access/access.routes');
const publicRoutes = require('../modules/public/public.routes');
const otpRoutes = require('../modules/access/otp.routes');
const chemistRoutes = require('../modules/chemist/chemist.routes');

router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mediassist-backend' });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/access', accessRoutes);
router.use('/public', publicRoutes);
router.use('/otp', otpRoutes);
router.use('/chemists', chemistRoutes);

module.exports = router;