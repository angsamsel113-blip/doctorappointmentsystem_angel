import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [apps, docs] = await Promise.all([
          api.getAppointments(token),
          api.getDoctors(),
        ]);
        setAppointments(apps);
        setDoctors(docs);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) load();
  }, [token]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Doctors</h2>
      <ul>
        {doctors.map((d) => (
          <li key={d._id}>
            {d.name} - {d.specialization}
          </li>
        ))}
      </ul>
      <h2>All Appointments</h2>
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


