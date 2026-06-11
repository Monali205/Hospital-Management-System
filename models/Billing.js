const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  billNumber: {
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
  billDate: {
    type: Date,
    default: Date.now
  },
  services: [
    {
      description: String,
      amount: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  medicines: [
    {
      medicineId: mongoose.Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }
  ],
  consultationFee: Number,
  labTests: [
    {
      testName: String,
      amount: Number
    }
  ],
  subtotal: Number,
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Card', 'Online', 'Cheque'],
    default: 'Cash'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
