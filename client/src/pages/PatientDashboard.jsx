import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function PatientDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payments, setPayments] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const [apps, pays] = await Promise.all([
          api.getAppointments(token),
          api.getPayments(token),
        ]);
        setAppointments(apps);
        setFilteredAppointments(apps);
        
        // Create a map of appointment ID to payment
        const paymentMap = {};
        pays.forEach((p) => {
          paymentMap[p.appointment?._id || p.appointment] = p;
        });
        setPayments(paymentMap);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) load();
  }, [token]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter((a) => a.status === filterStatus));
    }
  }, [filterStatus, appointments]);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.deleteAppointment(id, token);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setSuccess('Appointment cancelled successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'confirmed';
      case 'Pending':
        return 'pending';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="page-wrapper">
      <h1 className="section-title">Patient Dashboard</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>Welcome, {user?.name}</p>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="section">
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ margin: 0, fontWeight: 600 }}>Filter by Status: </label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>No appointments found.</p>
          </div>
        )}
        
        <div>
          {filteredAppointments.map((a) => {
            const payment = payments[a._id];
            return (
              <div key={a._id} className="card list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Appointment Details</h3>
                      <span className={`badge ${getStatusColor(a.status)}`}>{a.status}</span>
                    </div>
                    <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {a.timeSlot}</p>
                    <p><strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})</p>
                    
                    {payment ? (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                        <p style={{ margin: '0.25rem 0' }}><strong>Payment Status:</strong> 
                          <span className={`badge ${payment.status === 'Completed' ? 'confirmed' : 'pending'}`} style={{ marginLeft: '0.5rem' }}>
                            {payment.status}
                          </span>
                        </p>
                        <p style={{ margin: '0.25rem 0' }}><strong>Amount:</strong> ₹{payment.amount}</p>
                        <p style={{ margin: '0.25rem 0' }}><strong>Method:</strong> {payment.paymentMethod}</p>
                        {payment.transactionId && (
                          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                            <strong>Transaction ID:</strong> {payment.transactionId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                        <p style={{ margin: 0, color: '#856404' }}>⚠️ Payment pending</p>
                      </div>
                    )}
                  </div>
                  
                  {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                    <button 
                      onClick={() => handleCancel(a._id)} 
                      className="danger"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
