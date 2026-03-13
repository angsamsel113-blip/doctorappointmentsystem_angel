import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const isActive = (path) => location.pathname === path;
  const navLinkClass = (path) => `nav-link ${isActive(path) ? 'active fw-semibold' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span className="fs-4">⚕️</span>
          <span className="fw-semibold text-primary">MedAppoint</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={navLinkClass('/')}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/doctors" className={navLinkClass('/doctors')}>Doctors</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link to="/appointments" className={navLinkClass('/appointments')}>Appointments</Link>
              </li>
            )}
            {user?.role === 'patient' && (
              <li className="nav-item">
                <Link to="/patient/dashboard" className={navLinkClass('/patient/dashboard')}>My Dashboard</Link>
              </li>
            )}
            {user?.role === 'doctor' && (
              <li className="nav-item">
                <Link to="/doctor/dashboard" className={navLinkClass('/doctor/dashboard')}>Doctor Dashboard</Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>Admin Dashboard</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            ) : (
              <>
                <span className="text-muted small d-none d-md-inline">👤 {user.name}</span>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
