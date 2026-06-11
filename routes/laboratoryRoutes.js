const express = require('express');
const router = express.Router();
const laboratoryController = require('../controllers/laboratoryController');

// Routes for Laboratory Tests
router.post('/test/create', laboratoryController.createLabTest);
router.get('/test/all', laboratoryController.getAllLabTests);
router.get('/test/:id', laboratoryController.getLabTestById);
router.get('/test/category/:category', laboratoryController.getLabTestsByCategory);
router.put('/test/update/:id', laboratoryController.updateLabTest);
router.delete('/test/delete/:id', laboratoryController.deleteLabTest);

// Routes for Lab Reports
router.post('/report/create', laboratoryController.createLabReport);
router.get('/report/all', laboratoryController.getAllLabReports);
router.get('/report/patient/:patientId', laboratoryController.getLabReportsByPatient);
router.put('/report/update/:id', laboratoryController.updateLabReport);

module.exports = router;
