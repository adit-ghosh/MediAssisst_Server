const { success, error } = require('../../common/apiResponse');
const prescriptionService = require('./prescription.service');

const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionService.getAllPrescriptions();
    return success(res, { prescriptions });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch prescriptions', 500);
  }
};

const createPrescriptionForPatient = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const { patientId, meds, notes, validUntil } = req.body;

    if (!patientId || !meds || !Array.isArray(meds) || meds.length === 0) {
      return error(res, 'patientId and meds array are required', 400);
    }

    const prescription = await prescriptionService.createPrescription({
      doctorId,
      patientId,
      meds,
      notes,
      validUntil
    });

    return success(res, { prescription }, 'Prescription created', 201);
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Failed to create prescription', err.statusCode || 500);
  }
};

const getMyDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user.userId;
    const prescriptions = await prescriptionService.getPrescriptionsForDoctor(doctorId);
    return success(res, { prescriptions });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch prescriptions', 500);
  }
};

const getMyPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const prescriptions = await prescriptionService.getPrescriptionsForPatient(patientId);
    return success(res, { prescriptions });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch prescriptions', 500);
  }
};

module.exports = {
  createPrescriptionForPatient,
  getMyDoctorPrescriptions,
  getMyPatientPrescriptions,
  getAllPrescriptions
};