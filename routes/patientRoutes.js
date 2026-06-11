const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Routes for Patients
router.post('/create', patientController.createPatient);
router.get('/all', patientController.getAllPatients);
router.get('/search', patientController.searchPatients);
router.get('/:id', patientController.getPatientById);
router.put('/update/:id', patientController.updatePatient);
router.delete('/delete/:id', patientController.deletePatient);

module.exports = router;
