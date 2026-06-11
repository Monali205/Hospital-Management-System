const Billing = require('../models/Billing');
const Patient = require('../models/Patient');

// Create Billing
exports.createBilling = async (req, res) => {
  try {
    const newBilling = new Billing(req.body);
    const savedBilling = await newBilling.save();
    res.status(201).json({
      success: true,
      message: 'Billing created successfully',
      data: savedBilling
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Billings
exports.getAllBillings = async (req, res) => {
  try {
    const billings = await Billing.find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialization');
    res.status(200).json({
      success: true,
      data: billings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Billing by ID
exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing not found'
      });
    }
    res.status(200).json({
      success: true,
      data: billing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Billings by Patient
exports.getBillingsByPatient = async (req, res) => {
  try {
    const billings = await Billing.find({ patientId: req.params.patientId })
      .populate('patientId')
      .populate('doctorId');
    res.status(200).json({
      success: true,
      data: billings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Billing
exports.updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Billing updated successfully',
      data: billing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paidAmount, paymentStatus } = req.body;
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { 
        paidAmount, 
        paymentStatus,
        remainingAmount: (billing ? billing.totalAmount - paidAmount : 0)
      },
      { new: true }
    );
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: billing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Billing
exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Billing not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Billing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Billing Statistics
exports.getBillingStats = async (req, res) => {
  try {
    const stats = await Billing.aggregate([
      {
        $group: {
          _id: null,
          totalBillings: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' },
          pendingAmount: { $sum: '$remainingAmount' }
        }
      }
    ]);
    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
