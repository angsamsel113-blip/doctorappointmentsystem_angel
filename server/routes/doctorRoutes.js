const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.post('/', protect, requireRole('admin'), createDoctor);
router.put('/:id', protect, requireRole('admin'), updateDoctor);
router.delete('/:id', protect, requireRole('admin'), deleteDoctor);

module.exports = router;


