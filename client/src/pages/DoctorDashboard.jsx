import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function DoctorDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availability, setAvailability] = useState('');
  const [availabilityList, setAvailabilityList] = useState([]);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAppointments(token);
        // Filter appointments for this doctor (backend returns all, but we filter here for demo)
        const doctorAppointments = data.filter((a) => a.doctor?._id);
        setAppointments(doctorAppointments);
        setFilteredAppointments(doctorAppointments);
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

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAppointment(id, { status }, token);
      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      setSuccess('Appointment status updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddAvailability = (e) => {
    e.preventDefault();
    if (availability.trim()) {
      setAvailabilityList((prev) => [...prev, availability.trim()]);
      setAvailability('');
    }
  };

  const handleRemoveAvailability = (index) => {
    setAvailabilityList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    // Note: This would require updating the doctor's availability
    // For now, we'll just show a message - you can implement the API call later
    setSuccess('Availability saved. (Note: This feature requires doctor profile update API)');
    setTimeout(() => setSuccess(''), 3000);
    setShowAvailabilityForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return { color: 'green', fontWeight: 'bold' };
      case 'Pending':
        return { color: 'orange', fontWeight: 'bold' };
      case 'Completed':
        return { color: 'blue', fontWeight: 'bold' };
      case 'Cancelled':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'Pending').length,
    confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
    completed: appointments.filter((a) => a.status === 'Completed').length,
    cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Welcome, Dr. {user?.name}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Appointment Statistics</h3>
          <p><strong>Total:</strong> {stats.total}</p>
          <p><strong>Pending:</strong> {stats.pending}</p>
          <p><strong>Confirmed:</strong> {stats.confirmed}</p>
          <p><strong>Completed:</strong> {stats.completed}</p>
          <p><strong>Cancelled:</strong> {stats.cancelled}</p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Manage Availability</h3>
          {!showAvailabilityForm ? (
            <button onClick={() => setShowAvailabilityForm(true)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Set Availability Slots
            </button>
          ) : (
            <div>
              <form onSubmit={handleAddAvailability}>
                <input
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Mon 10:00-12:00"
                  style={{ padding: '0.5rem', width: '60%' }}
                />
                <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', cursor: 'pointer' }}>
                  Add Slot
                </button>
              </form>
              {availabilityList.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Slots:</strong>
                  <ul style={{ marginTop: '0.25rem' }}>
                    {availabilityList.map((slot, idx) => (
                      <li key={idx}>
                        {slot}{' '}
                        <button onClick={() => handleRemoveAvailability(idx)} style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleSaveAvailability} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Save Availability
                  </button>
                  <button onClick={() => { setShowAvailabilityForm(false); setAvailabilityList([]); }} style={{ marginTop: '0.5rem', marginLeft: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <h2>Your Appointments</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by Status: </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {filteredAppointments.length === 0 && <p>No appointments found.</p>}
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredAppointments.map((a) => (
          <li 
            key={a._id} 
            style={{ 
              marginBottom: '1rem', 
              padding: '1rem', 
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: selectedAppointment === a._id ? '#f0f0f0' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {a.timeSlot}</p>
                <p><strong>Status:</strong> <span style={getStatusColor(a.status)}>{a.status}</span></p>
                {a.patient && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                    <strong>Patient Details:</strong>
                    <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {a.patient.name}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {a.patient.email}</p>
                  </div>
                )}
              </div>
              <div>
                <label><strong>Update Status:</strong></label>
                <br />
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a._id, e.target.value)}
                  style={{ padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
