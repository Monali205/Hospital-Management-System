const Laboratory = require('../models/Laboratory');
const LabReport = require('../models/LabReport');

// Create Lab Test
exports.createLabTest = async (req, res) => {
  try {
    const newTest = new Laboratory(req.body);
    const savedTest = await newTest.save();
    res.status(201).json({
      success: true,
      message: 'Lab test created successfully',
      data: savedTest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Lab Tests
exports.getAllLabTests = async (req, res) => {
  try {
    const tests = await Laboratory.find();
    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Lab Test by ID
exports.getLabTestById = async (req, res) => {
  try {
    const test = await Laboratory.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }
    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Lab Tests by Category
exports.getLabTestsByCategory = async (req, res) => {
  try {
    const tests = await Laboratory.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Lab Test
exports.updateLabTest = async (req, res) => {
  try {
    const test = await Laboratory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lab test updated successfully',
      data: test
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Lab Test
exports.deleteLabTest = async (req, res) => {
  try {
    const test = await Laboratory.findByIdAndDelete(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lab test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Lab Report
exports.createLabReport = async (req, res) => {
  try {
    const newReport = new LabReport(req.body);
    const savedReport = await newReport.save();
    res.status(201).json({
      success: true,
      message: 'Lab report created successfully',
      data: savedReport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Lab Reports
exports.getAllLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find()
      .populate('patientId', 'firstName lastName email')
      .populate('laboratoryTestId', 'testName testCode');
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Lab Reports by Patient
exports.getLabReportsByPatient = async (req, res) => {
  try {
    const reports = await LabReport.find({ patientId: req.params.patientId })
      .populate('laboratoryTestId');
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Lab Report
exports.updateLabReport = async (req, res) => {
  try {
    const report = await LabReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Lab report not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lab report updated successfully',
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
