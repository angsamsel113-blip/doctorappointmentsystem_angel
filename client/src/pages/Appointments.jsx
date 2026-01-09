import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function Appointments() {
  const { token } = useAuth();
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

  return (
    <div>
      <h1>Appointments</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {appointments.length === 0 && <p>No appointments.</p>}
      <ul>
        {appointments.map((a) => (
          <li key={a._id}>
            {a.date?.slice(0, 10)} {a.timeSlot} - {a.patient?.name} with {a.doctor?.name} (
            {a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}


