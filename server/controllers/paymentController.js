const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

// Generate a simple transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// POST /api/payments
const createPayment = async (req, res) => {
  try {
    const { appointmentId, amount, paymentMethod, cardNumber, cardHolderName, expiryDate, cvv } = req.body;

    if (!appointmentId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'appointmentId, amount, and paymentMethod are required' });
    }

    // Verify appointment exists and belongs to patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // For card/online payments, require card details
    if ((paymentMethod === 'card' || paymentMethod === 'online') && (!cardNumber || !cardHolderName || !expiryDate || !cvv)) {
      return res.status(400).json({ message: 'Card details are required for card/online payments' });
    }

    // Simulate payment processing (always succeeds for demo)
    const transactionId = generateTransactionId();
    
    // In a real system, you would call a payment gateway here
    // For demo, we'll simulate a successful payment
    const payment = await Payment.create({
      appointment: appointmentId,
      patient: req.user.id,
      amount: Number(amount),
      paymentMethod,
      cardNumber: cardNumber ? cardNumber.replace(/\s/g, '').slice(-4).padStart(cardNumber.length, '*') : undefined, // Mask card number
      cardHolderName,
      expiryDate,
      cvv: cvv ? '***' : undefined, // Don't store CVV
      status: 'Completed', // Simulated success
      transactionId,
    });

    // Update appointment status to Confirmed after payment
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'Confirmed' });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/payments
const getPayments = async (req, res) => {
  try {
    let filter = {};
    
    // Patients see only their payments
    if (req.user?.role === 'patient') {
      filter = { patient: req.user.id };
    }
    // Admins see all payments
    // Doctors don't see payments (or could see payments for their appointments)

    const payments = await Payment.find(filter)
      .populate('appointment', 'date timeSlot status')
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/payments/:id
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('patient', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Patients can only see their own payments
    if (req.user?.role === 'patient' && payment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// GET /api/payments/appointment/:appointmentId
const getPaymentByAppointment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ appointment: req.params.appointmentId })
      .populate('appointment')
      .populate('patient', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this appointment' });
    }

    // Patients can only see their own payments
    if (req.user?.role === 'patient' && payment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  getPaymentByAppointment,
};

