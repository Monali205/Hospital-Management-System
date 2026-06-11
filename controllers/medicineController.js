const Medicine = require('../models/Medicine');

// Create Medicine
exports.createMedicine = async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    const savedMedicine = await newMedicine.save();
    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: savedMedicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Medicines by Category
exports.getMedicinesByCategory = async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: medicine
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Search Medicines
exports.searchMedicines = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { generic_name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ]
    };
    const medicines = await Medicine.find(query);
    res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
