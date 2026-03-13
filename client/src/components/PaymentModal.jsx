import { useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './PaymentModal.css';

export default function PaymentModal({ isOpen, onClose, appointmentId, amount = 500, onSuccess }) {
  const { token } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const paymentData = {
        appointmentId,
        amount,
        paymentMethod,
      };

      if (paymentMethod === 'card' || paymentMethod === 'online') {
        if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
          setError('Please fill all card details');
          setLoading(false);
          return;
        }
        paymentData.cardNumber = cardNumber.replace(/\s/g, '');
        paymentData.cardHolderName = cardHolderName;
        paymentData.expiryDate = expiryDate;
        paymentData.cvv = cvv;
      }

      await api.createPayment(paymentData, token);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>Complete Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-amount">
            <p>Total Amount</p>
            <h3>₹{amount}</h3>
          </div>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Credit/Debit Card</option>
                <option value="online">Online Payment</option>
                <option value="cash">Cash (On Arrival)</option>
              </select>
            </div>

            {(paymentMethod === 'card' || paymentMethod === 'online') && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '');
                        if (v.length <= 2) {
                          setExpiryDate(v);
                        } else {
                          setExpiryDate(v.substring(0, 2) + '/' + v.substring(2, 4));
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label>CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'cash' && (
              <div className="alert info">
                You will pay in cash when you arrive for your appointment.
              </div>
            )}

            <div className="payment-modal-footer">
              <button type="button" className="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${amount}`}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: '8px', fontSize: '0.875rem', color: '#666' }}>
            <strong>Note:</strong> This is a simulated payment system for demonstration purposes only. No actual charges will be made.
          </div>
        </div>
      </div>
    </div>
  );
}

