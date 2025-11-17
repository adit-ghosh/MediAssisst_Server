const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccessRequestSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending'
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: Date,
    deniedAt: Date,
    expiresAt: Date
  },
  { timestamps: true }
);

const AccessRequest = mongoose.model('AccessRequest', AccessRequestSchema);
module.exports = { AccessRequest };
