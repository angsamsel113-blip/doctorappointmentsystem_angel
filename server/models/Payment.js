const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'cash', 'online'],
      default: 'card',
    },
    cardNumber: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card' || this.paymentMethod === 'online';
      },
    },
    cardHolderName: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card' || this.paymentMethod === 'online';
      },
    },
    expiryDate: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card' || this.paymentMethod === 'online';
      },
    },
    cvv: {
      type: String,
      required: function() {
        return this.paymentMethod === 'card' || this.paymentMethod === 'online';
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);

