const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// GET /api/appointments
// - patients: only their appointments
// - others: all appointments (simple for demo)
const getAppointments = async (req, res) => {
  try {
    const filter = req.user?.role === 'patient' ? { patient: req.user.id } : {};
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization contactDetails');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/appointments/:id
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization contactDetails');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Simple access control: patients can only see their own
    if (req.user?.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// POST /api/appointments
const createAppointment = async (req, res) => {
  try {
    const { doctor, date, timeSlot } = req.body;
    if (!doctor || !date || !timeSlot) {
      return res.status(400).json({ message: 'doctor, date, and timeSlot are required' });
    }

    // Ensure doctor exists
    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      date,
      timeSlot,
      status: 'Pending',
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// PUT /api/appointments/:id
const updateAppointment = async (req, res) => {
  try {
    const updates = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// DELETE /api/appointments/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};


