const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// Routes for Pharmacy
router.post('/create', pharmacyController.createPrescription);
router.get('/all', pharmacyController.getAllPrescriptions);
router.get('/pending', pharmacyController.getPendingPrescriptions);
router.get('/patient/:patientId', pharmacyController.getPrescriptionsByPatient);
router.get('/:id', pharmacyController.getPrescriptionById);
router.put('/update/:id', pharmacyController.updatePrescription);
router.put('/dispense/:id', pharmacyController.dispensePrescription);
router.delete('/delete/:id', pharmacyController.deletePrescription);

module.exports = router;
