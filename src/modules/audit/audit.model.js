const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['VIEW', 'UPDATE', 'CREATE', 'ACCESS_DENIED', 'CONSENT_REQUEST'],
      required: true
    },
    details: String,
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

module.exports = { AuditLog };
