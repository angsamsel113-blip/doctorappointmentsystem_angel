import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Add Doctor Form State
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [availability, setAvailability] = useState('');

  // Edit Doctor State
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editContactDetails, setEditContactDetails] = useState('');

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [apps, docs, usrs] = await Promise.all([
          api.getAppointments(token),
          api.getDoctors(),
          api.getUsers(token),
        ]);
        setAppointments(apps);
        setDoctors(docs);
        setUsers(usrs);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) load();
  }, [token]);

  // Calculate Stats
  const stats = {
    totalUsers: users.length,
    totalPatients: users.filter((u) => u.role === 'patient').length,
    totalDoctors: users.filter((u) => u.role === 'doctor').length,
    totalAdmins: users.filter((u) => u.role === 'admin').length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === 'Pending').length,
    confirmedAppointments: appointments.filter((a) => a.status === 'Confirmed').length,
    totalDoctorsList: doctors.length,
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const availabilityList = availability
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      const newDoctor = await api.createDoctor(
        {
          name,
          specialization,
          experience: Number(experience),
          contactDetails,
          availability: availabilityList,
        },
        token,
      );
      setDoctors((prev) => [...prev, newDoctor]);
      setSuccess('Doctor added successfully.');
      setName('');
      setSpecialization('');
      setExperience('');
      setContactDetails('');
      setAvailability('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor._id);
    setEditName(doctor.name);
    setEditSpecialization(doctor.specialization);
    setEditExperience(doctor.experience);
    setEditContactDetails(doctor.contactDetails);
  };

  const handleUpdateDoctor = async (id) => {
    setError('');
    setSuccess('');
    try {
      const updated = await api.updateDoctor(
        id,
        {
          name: editName,
          specialization: editSpecialization,
          experience: Number(editExperience),
          contactDetails: editContactDetails,
        },
        token,
      );
      setDoctors((prev) => prev.map((d) => (d._id === id ? updated : d)));
      setSuccess('Doctor updated successfully.');
      setEditingDoctor(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await api.deleteDoctor(id, token);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
      setSuccess('Doctor deleted successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditUser = (usr) => {
    setEditingUser(usr._id);
    setEditUserName(usr.name);
    setEditUserEmail(usr.email);
    setEditUserRole(usr.role);
  };

  const handleUpdateUser = async (id) => {
    setError('');
    setSuccess('');
    try {
      const updated = await api.updateUser(
        id,
        {
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
        },
        token,
      );
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setSuccess('User updated successfully.');
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setSuccess('User deleted successfully.');
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

      <div style={{ marginBottom: '1rem', borderBottom: '2px solid #ccc' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'overview' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'overview' ? 'white' : 'black',
            border: 'none',
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'doctors' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'doctors' ? 'white' : 'black',
            border: 'none',
          }}
        >
          Manage Doctors
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'users' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'users' ? 'white' : 'black',
            border: 'none',
          }}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'appointments' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'appointments' ? 'white' : 'black',
            border: 'none',
          }}
        >
          All Appointments
        </button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <h2>System Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
              <h3>Total Users</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalUsers}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
              <h3>Patients</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalPatients}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              <h3>Doctors</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalDoctors}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
              <h3>Admins</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalAdmins}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <h3>Total Appointments</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.totalAppointments}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
              <h3>Pending</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.pendingAppointments}</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#c8e6c9', borderRadius: '4px' }}>
              <h3>Confirmed</h3>
              <p style={{ fontSize: '2rem', margin: 0 }}>{stats.confirmedAppointments}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div>
          <h2>Manage Doctors</h2>
          <h3>Add New Doctor</h3>
          <form onSubmit={handleAddDoctor} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label>Name</label>
                <br />
                <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label>Specialization</label>
                <br />
                <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label>Experience (years)</label>
                <br />
                <input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>
              <div>
                <label>Contact Details</label>
                <br />
                <input value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>
            </div>
            <div>
              <label>Availability (comma-separated, e.g., "Mon 10:00-12:00, Tue 14:00-16:00")</label>
              <br />
              <input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Mon 10:00-12:00, Tue 14:00-16:00" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Add Doctor</button>
          </form>

          <h3>Doctor List</h3>
          {doctors.length === 0 && <p>No doctors found.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {doctors.map((d) => (
              <li key={d._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                {editingDoctor === d._id ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label>Name</label>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                      <div>
                        <label>Specialization</label>
                        <input value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                      <div>
                        <label>Experience</label>
                        <input type="number" value={editExperience} onChange={(e) => setEditExperience(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                      <div>
                        <label>Contact</label>
                        <input value={editContactDetails} onChange={(e) => setEditContactDetails(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                    </div>
                    <button onClick={() => handleUpdateDoctor(d._id)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingDoctor(null)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p><strong>{d.name}</strong> - {d.specialization} ({d.experience} years)</p>
                    <p><strong>Contact:</strong> {d.contactDetails}</p>
                    {d.availability && d.availability.length > 0 && (
                      <p><strong>Availability:</strong> {d.availability.join(', ')}</p>
                    )}
                    <button onClick={() => handleEditDoctor(d)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteDoctor(d._id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          {users.length === 0 && <p>No users found.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((u) => (
              <li key={u._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                {editingUser === u._id ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label>Name</label>
                        <input value={editUserName} onChange={(e) => setEditUserName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                      <div>
                        <label>Email</label>
                        <input type="email" value={editUserEmail} onChange={(e) => setEditUserEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
                      </div>
                      <div>
                        <label>Role</label>
                        <select value={editUserRole} onChange={(e) => setEditUserRole(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => handleUpdateUser(u._id)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditingUser(null)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <p><strong>{u.name}</strong> ({u.email}) - Role: <strong>{u.role}</strong></p>
                    <button onClick={() => handleEditUser(u)} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeleteUser(u._id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div>
          <h2>All Appointments</h2>
          {appointments.length === 0 && <p>No appointments found.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {appointments.map((a) => (
              <li key={a._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {a.timeSlot}</p>
                <p><strong>Patient:</strong> {a.patient?.name} ({a.patient?.email})</p>
                <p><strong>Doctor:</strong> {a.doctor?.name} ({a.doctor?.specialization})</p>
                <p><strong>Status:</strong> {a.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
