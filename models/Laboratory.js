const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    trim: true
  },
  testCode: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['Blood Test', 'Urine Test', 'Stool Test', 'X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'ECG', 'EEG', 'Allergy Test', 'DNA Test', 'COVID-19']
  },
  specimen: String,
  referenceRange: String,
  normalValues: String,
  abnormalValues: [String],
  turnaroundTime: String,
  cost: {
    type: Number,
    required: true
  },
  preparationInstructions: [String],
  equipment: String,
  qualifications: [String],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Laboratory', laboratorySchema);
