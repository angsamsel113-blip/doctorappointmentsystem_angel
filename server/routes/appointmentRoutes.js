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
router.put('/:id', protect, requireRole('doctor', 'admin'), updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;


