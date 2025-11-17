const mongoose = require('mongoose');
const { Schema } = mongoose;

const OTPRequestSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const OTPRequest = mongoose.model('OTPRequest', OTPRequestSchema);
module.exports = { OTPRequest };
