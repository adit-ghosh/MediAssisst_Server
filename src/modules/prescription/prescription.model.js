const mongoose = require('mongoose');
const { Schema } = mongoose;

const medItemSchema = new Schema({
  name: { type: String, required: true },         
  strength: String,                               
  dose: String,                                   
  frequency: String,                              
  route: String,                                  
  duration: String,                               
  instructions: String                            
});

const prescriptionSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meds: [medItemSchema],
    notes: String,
    issuedAt: { type: Date, default: Date.now },
    validUntil: Date
  },
  { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = { Prescription };
