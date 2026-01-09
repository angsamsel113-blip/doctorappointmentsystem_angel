const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add doctor name'],
    trim: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization'],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: 0,
  },
  availability: {
    type: [String], // e.g. "Mon 10:00-12:00"
    default: [],
  },
  contactDetails: {
    type: String,
    required: [true, 'Please add contact details'],
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
