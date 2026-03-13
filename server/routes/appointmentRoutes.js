const express = require('express');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, requireRole('patient', 'admin'), createAppointment);
// Role-aware update handled in controller (doctor/admin update status, patient can cancel)
router.put('/:id', protect, updateAppointment);
// Patients can delete/cancel their own; admins can delete any
router.delete('/:id', protect, deleteAppointment);

module.exports = router;


