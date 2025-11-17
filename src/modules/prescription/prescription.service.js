const { Prescription } = require('./prescription.model');
const { User } = require('../user/user.model');

const createPrescription = async ({ doctorId, patientId, meds, notes, validUntil }) => {
  const patient = await User.findById(patientId);
  if (!patient || patient.role !== 'patient') {
    const err = new Error('Invalid patient');
    err.statusCode = 400;
    throw err;
  }

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') {
    const err = new Error('Invalid doctor');
    err.statusCode = 400;
    throw err;
  }

  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctorId,
    meds,
    notes,
    validUntil
  });

  return prescription;
};

const getPrescriptionsForDoctor = async (doctorId) => {
  return Prescription.find({ doctor: doctorId })
    .populate('patient', 'name email')
    .sort({ createdAt: -1 });
};

const getPrescriptionsForPatient = async (patientId) => {
  return Prescription.find({ patient: patientId })
    .populate('doctor', 'name email')
    .sort({ createdAt: -1 });
};

const getAllPrescriptions = async () => {
  return Prescription.find()
    .populate('patient', 'name email')
    .populate('doctor', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = {
  createPrescription,
  getPrescriptionsForDoctor,
  getPrescriptionsForPatient,
  getAllPrescriptions
};