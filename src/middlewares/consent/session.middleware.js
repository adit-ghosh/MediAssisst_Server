const { AccessSession } = require('../../modules/access/session.model');

const requireSession = async (req, res, next) => {
  const doctorId = req.user.userId;
  const { patientId } = req.query;

  const session = await AccessSession.findOne({
    doctor: doctorId,
    patient: patientId
  });

  if (!session) {
    return res.status(403).json({ success: false, message: 'Session required' });
  }

  const now = Date.now();

  if (now < session.expiresAt) {
    return next();
  }

  if (now < session.graceExpiresAt) {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Session expired' });
};

module.exports = { requireSession };
