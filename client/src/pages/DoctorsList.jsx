import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [success, setSuccess] = useState('');

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
      await api.createAppointment(
        { doctor: selectedDoctor, date, timeSlot },
        token
      );
      setSuccess('Appointment booked successfully!');
      setDate('');
      setTimeSlot('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Doctors</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <ul>
        {doctors.map((d) => (
          <li key={d._id}>
            {d.name} - {d.specialization} ({d.experience} years) | {d.contactDetails}
          </li>
        ))}
      </ul>
      <h2>Book Appointment</h2>
      <form onSubmit={handleBook}>
        <div>
          <label>Doctor</label>
          <br />
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} - {d.specialization}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date</label>
          <br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Time Slot</label>
          <br />
          <input
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            placeholder="e.g. 10:00-11:00"
            required
          />
        </div>
        <button type="submit">Book</button>
      </form>
    </div>
  );
}


