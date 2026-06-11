const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

// Create Prescription
exports.createPrescription = async (req, res) => {
  try {
    const newPrescription = new Pharmacy(req.body);
    const savedPrescription = await newPrescription.save();
    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: savedPrescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Pharmacy.find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialization');
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Pharmacy.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId')
      .populate('medicines.medicineId');
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Prescriptions by Patient
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Pharmacy.find({ patientId: req.params.patientId })
      .populate('doctorId')
      .populate('medicines.medicineId');
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Prescription
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patientId').populate('doctorId');
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Dispense Prescription
exports.dispensePrescription = async (req, res) => {
  try {
    const { dispensedBy } = req.body;
    const prescription = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Dispensed',
        dispensedDate: new Date(),
        dispensedBy
      },
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prescription dispensed successfully',
      data: prescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Pending Prescriptions
exports.getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Pharmacy.find({ status: 'Pending' })
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName');
    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
