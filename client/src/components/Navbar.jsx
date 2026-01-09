import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Home
      </Link>
      <Link to="/doctors" style={{ marginRight: '1rem' }}>
        Doctors
      </Link>
      {user && (
        <Link to="/appointments" style={{ marginRight: '1rem' }}>
          Appointments
        </Link>
      )}
      {user?.role === 'patient' && (
        <Link to="/patient/dashboard" style={{ marginRight: '1rem' }}>
          Patient Dashboard
        </Link>
      )}
      {user?.role === 'doctor' && (
        <Link to="/doctor/dashboard" style={{ marginRight: '1rem' }}>
          Doctor Dashboard
        </Link>
      )}
      {user?.role === 'admin' && (
        <Link to="/admin/dashboard" style={{ marginRight: '1rem' }}>
          Admin Dashboard
        </Link>
      )}
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}
      {user && (
        <button style={{ marginLeft: '1rem' }} onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}


