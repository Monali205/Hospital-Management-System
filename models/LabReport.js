const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  reportNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  laboratoryTestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  testName: String,
  sampleDate: {
    type: Date,
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  results: {
    value: String,
    unit: String,
    referenceRange: String,
    status: {
      type: String,
      enum: ['Normal', 'Abnormal', 'Critical'],
      default: 'Normal'
    }
  },
  notes: String,
  technician: String,
  approvedBy: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Approved', 'Sent to Patient'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('LabReport', labReportSchema);
