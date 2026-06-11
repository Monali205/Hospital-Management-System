const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Routes for Medicines
router.post('/create', medicineController.createMedicine);
router.get('/all', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/:id', medicineController.getMedicineById);
router.get('/category/:category', medicineController.getMedicinesByCategory);
router.put('/update/:id', medicineController.updateMedicine);
router.put('/stock/:id', medicineController.updateStock);
router.delete('/delete/:id', medicineController.deleteMedicine);

module.exports = router;
