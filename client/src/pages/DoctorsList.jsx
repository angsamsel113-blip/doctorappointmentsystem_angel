import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PaymentModal from '../components/PaymentModal.jsx';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdAppointmentId, setCreatedAppointmentId] = useState(null);
  const [paymentAmount] = useState(500); // Fixed amount for demo

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!user) {
        setError('Please login as patient to book an appointment.');
        return;
      }
      const appointment = await api.createAppointment(
        { doctor: selectedDoctor, date, timeSlot },
        token
      );
      setCreatedAppointmentId(appointment._id);
      setShowPaymentModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePaymentSuccess = () => {
    setSuccess('Appointment booked and payment completed successfully!');
    setDate('');
    setTimeSlot('');
    setSelectedDoctor('');
    setCreatedAppointmentId(null);
  };

  const selectedDoctorData = doctors.find((d) => d._id === selectedDoctor);

  return (
    <div className="page-wrapper">
      <h1 className="section-title">Available Doctors</h1>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Doctor List</h2>
          {doctors.length === 0 && <p>No doctors available.</p>}
          <div>
            {doctors.map((d) => (
              <div 
                key={d._id} 
                className="card list-item"
                style={{ 
                  marginBottom: '1rem',
                  backgroundColor: selectedDoctor === d._id ? '#f0f0f0' : 'white'
                }}
              >
                <h3 style={{ marginTop: 0, color: '#667eea' }}>{d.name}</h3>
                <p><strong>Specialization:</strong> {d.specialization}</p>
                <p><strong>Experience:</strong> {d.experience} years</p>
                <p><strong>Contact:</strong> {d.contactDetails}</p>
                {d.availability && d.availability.length > 0 ? (
                  <div>
                    <strong>Availability:</strong>
                    <ul style={{ marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                      {d.availability.map((slot, idx) => (
                        <li key={idx}>{slot}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p style={{ color: '#888' }}><em>No availability slots set</em></p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Book Appointment</h2>
            <form onSubmit={handleBook}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                >
                  <option value="">-- Select doctor --</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctorData && selectedDoctorData.availability && selectedDoctorData.availability.length > 0 && (
                <div className="alert info" style={{ marginBottom: '1rem' }}>
                  <strong>Available Time Slots:</strong>
                  <ul style={{ marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                    {selectedDoctorData.availability.map((slot, idx) => (
                      <li key={idx}>{slot}</li>
                    ))}
                  </ul>
                  <small>(You can enter a custom time slot or choose from above)</small>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Time Slot</label>
                <input
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="e.g. 10:00-11:00"
                  required
                />
              </div>

              {!user && (
                <div className="alert error" style={{ marginBottom: '1rem' }}>
                  Please login as a patient to book an appointment.
                </div>
              )}

              <button 
                type="submit" 
                disabled={!user}
                style={{ width: '100%' }}
              >
                Book Appointment (₹{paymentAmount})
              </button>
            </form>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          if (createdAppointmentId) {
            setSuccess('Appointment booked! Please complete payment to confirm.');
          }
        }}
        appointmentId={createdAppointmentId}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
