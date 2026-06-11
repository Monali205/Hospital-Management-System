const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Routes for Doctors
router.post('/create', doctorController.createDoctor);
router.get('/all', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);
router.put('/update/:id', doctorController.updateDoctor);
router.delete('/delete/:id', doctorController.deleteDoctor);

module.exports = router;
