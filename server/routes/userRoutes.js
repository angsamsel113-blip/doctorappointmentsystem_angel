const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require admin role
router.get('/', protect, requireRole('admin'), getUsers);
router.get('/:id', protect, requireRole('admin'), getUser);
router.put('/:id', protect, requireRole('admin'), updateUser);
router.delete('/:id', protect, requireRole('admin'), deleteUser);

module.exports = router;

