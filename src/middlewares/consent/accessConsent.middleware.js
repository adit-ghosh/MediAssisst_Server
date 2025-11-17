const { AccessRequest } = require('../../modules/access/access.model');
const { AuditLog } = require('../../modules/audit/audit.model');

const requireConsent = async (req, res, next) => {
  const doctorId = req.user.userId;
  const patientId = req.params.patientId || req.body.patientId;

  if (!patientId) {
    return res.status(400).json({ success: false, message: 'Missing patientId' });
  }

  const reqStatus = await AccessRequest.findOne({
    doctor: doctorId,
    patient: patientId,
    status: 'approved',
    expiresAt: { $gt: new Date() }
  });

  if (!reqStatus) {
    await AuditLog.create({
      actor: doctorId,
      patient: patientId,
      action: 'ACCESS_DENIED',
      details: 'Consent not granted'
    });
    return res.status(403).json({ success: false, message: 'Consent required' });
  }

  await AuditLog.create({
    actor: doctorId,
    patient: patientId,
    action: 'VIEW',
    details: 'Access granted via consent'
  });

  next();
};

module.exports = { requireConsent };
