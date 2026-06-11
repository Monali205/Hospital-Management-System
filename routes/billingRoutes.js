const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// Routes for Billing
router.post('/create', billingController.createBilling);
router.get('/all', billingController.getAllBillings);
router.get('/stats', billingController.getBillingStats);
router.get('/patient/:patientId', billingController.getBillingsByPatient);
router.get('/:id', billingController.getBillingById);
router.put('/update/:id', billingController.updateBilling);
router.put('/payment/:id', billingController.updatePaymentStatus);
router.delete('/delete/:id', billingController.deleteBilling);

module.exports = router;
