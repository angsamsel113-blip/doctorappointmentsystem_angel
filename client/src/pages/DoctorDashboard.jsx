import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function DoctorDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getAppointments(token);
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) load();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAppointment(id, { status }, token);
      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Welcome, Dr. {user?.name}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Appointments</h2>
      {appointments.length === 0 && <p>No appointments assigned.</p>}
      <ul>
        {appointments.map((a) => (
          <li key={a._id}>
            {a.date?.slice(0, 10)} {a.timeSlot} with {a.patient?.name} ({a.status}){' '}
            <select
              value={a.status}
              onChange={(e) => handleStatusChange(a._id, e.target.value)}
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}


