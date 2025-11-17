const mongoose = require('mongoose');
const { Schema } = mongoose;

const conditionSchema = new Schema({
  name: String,
  diagnosedAt: Date,
  notes: String
});

const medicationSchema = new Schema({
  name: String,
  dosage: String,      
  frequency: String,   
  startDate: Date,
  endDate: Date
});

const documentSchema = new Schema({
  label: String,       
  url: String,         
  uploadedAt: { type: Date, default: Date.now }
});

const patientProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    allergies: [String],
    conditions: [conditionSchema],
    medications: [medicationSchema],
    documents: [documentSchema]
  },
  { timestamps: true }
);

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);

module.exports = { PatientProfile };
