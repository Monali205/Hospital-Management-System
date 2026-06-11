const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  generic_name: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Antibiotic', 'Painkiller', 'Anti-inflammatory', 'Antacid', 'Vitamin', 'Antihistamine', 'Cough Syrup', 'Injection', 'Tablet', 'Capsule', 'Syrup', 'Ointment']
  },
  dosage: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  sideEffects: [String],
  contraindications: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
