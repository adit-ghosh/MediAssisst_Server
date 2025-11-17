const { success, error } = require('../../common/apiResponse');
const { Appointment } = require('./appointment.model');
const { User } = require('../user/user.model');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, scheduledAt, durationMinutes, location, notes } = req.body;

    if (!patientId || !doctorId || !scheduledAt) {
      return error(res, 'patientId, doctorId and scheduledAt are required', 400);
    }

    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || patient.role !== 'patient') {
      return error(res, 'Invalid patient', 400);
    }
    if (!doctor || doctor.role !== 'doctor') {
      return error(res, 'Invalid doctor', 400);
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      scheduledAt,
      durationMinutes,
      location,
      notes
    });

    return success(res, { appointment }, 'Appointment created', 201);
  } catch (err) {
    console.error(err);
    return error(res, err.message || 'Failed to create appointment', err.statusCode || 500);
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let filter = {};
    if (role === 'patient') filter.patient = userId;
    else if (role === 'doctor') filter.doctor = userId;
    else return error(res, 'Only patients and doctors have appointments', 403);

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ scheduledAt: 1 });

    return success(res, { appointments });
  } catch (err) {
    console.error(err);
    return error(res, 'Failed to fetch appointments', 500);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments
};
