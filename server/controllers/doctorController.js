const Doctor = require('../models/Doctor');

// GET /api/doctors
const getDoctors = async (_req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/doctors/:id
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// POST /api/doctors (admin)
const createDoctor = async (req, res) => {
  try {
    const { name, specialization, experience, availability = [], contactDetails } = req.body;
    if (!name || !specialization || experience === undefined || !contactDetails) {
      return res.status(400).json({ message: 'Name, specialization, experience, and contactDetails are required' });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      availability,
      contactDetails,
    });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// PUT /api/doctors/:id (admin)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// DELETE /api/doctors/:id (admin)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};


