import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to MedAppoint
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          Your modern solution for managing doctor appointments online. 
          Book appointments, manage your schedule, and streamline healthcare access.
        </p>

        {!user && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Get Started
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Login
              </button>
            </Link>
          </div>
        )}

        {user && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
            {user.role === 'patient' && (
              <Link to="/patient/dashboard" style={{ textDecoration: 'none' }}>
                <button className="success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                  Go to Dashboard
                </button>
              </Link>
            )}
            {user.role === 'doctor' && (
              <Link to="/doctor/dashboard" style={{ textDecoration: 'none' }}>
                <button className="success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                  Go to Dashboard
                </button>
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
                <button className="success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                  Go to Dashboard
                </button>
              </Link>
            )}
            <Link to="/doctors" style={{ textDecoration: 'none' }}>
              <button className="secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Browse Doctors
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-3" style={{ marginTop: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>For Patients</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Easily browse doctors, check availability, and book appointments online. 
            Manage your appointments and track your medical history.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍⚕️</div>
          <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>For Doctors</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Manage your schedule, view upcoming appointments, and update appointment statuses. 
            Streamline your practice management.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>For Admins</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Monitor system activity, manage users and doctors, and oversee all appointments. 
            Complete administrative control.
          </p>
        </div>
      </div>
    </div>
  );
}
