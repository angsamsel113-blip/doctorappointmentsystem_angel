import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [contactDetails, setContactDetails] = useState('');

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

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const newDoctor = await api.createDoctor(
        {
          name,
          specialization,
          experience: Number(experience),
          contactDetails,
        },
        token,
      );
      setDoctors((prev) => [...prev, newDoctor]);
      setSuccess('Doctor added successfully.');
      setName('');
      setSpecialization('');
      setExperience('');
      setContactDetails('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h2>Add Doctor</h2>
      <form onSubmit={handleAddDoctor} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Name</label>
          <br />
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Specialization</label>
          <br />
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Experience (years)</label>
          <br />
          <input
            type="number"
            min="0"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contact Details</label>
          <br />
          <input
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Doctor</button>
      </form>

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

