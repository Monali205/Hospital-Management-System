const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  prescriptionDate: {
    type: Date,
    default: Date.now
  },
  medicines: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      medicineName: String,
      dosage: String,
      frequency: {
        type: String,
        enum: ['Once daily', 'Twice daily', 'Thrice daily', 'Four times daily', 'As needed'],
        required: true
      },
      duration: String,
      quantity: Number,
      instructions: String,
      notes: String
    }
  ],
  diagnosis: String,
  followUpDate: Date,
  dispensedDate: Date,
  dispensedBy: String,
  totalCost: Number,
  status: {
    type: String,
    enum: ['Pending', 'Dispensed', 'Partial', 'Cancelled'],
    default: 'Pending'
  },
  validityDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
