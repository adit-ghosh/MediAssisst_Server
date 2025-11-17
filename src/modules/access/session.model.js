// src/modules/access/session.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccessSessionSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    graceExpiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const AccessSession = mongoose.models.AccessSession || mongoose.model('AccessSession', AccessSessionSchema);

module.exports = { AccessSession };
