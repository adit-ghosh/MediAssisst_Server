const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed', 'no-show'],
      default: 'scheduled'
    },
    location: {
      address: String,
      geo: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
      }
    },
    durationMinutes: {
      type: Number,
      default: 30
    },
    notes: String
  },
  { timestamps: true }
);

appointmentSchema.index({ 'location.geo': '2dsphere' });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Appointment };
