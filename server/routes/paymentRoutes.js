const express = require('express');
const {
  createPayment,
  getPayments,
  getPayment,
  getPaymentByAppointment,
} = require('../controllers/paymentController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, requireRole('patient', 'admin'), createPayment);
router.get('/', protect, getPayments);
router.get('/:id', protect, getPayment);
router.get('/appointment/:appointmentId', protect, getPaymentByAppointment);

module.exports = router;

