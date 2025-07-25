import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, isAdmin, getUserData } from '../utils/auth';
import './Navigation.css';

const Navigation = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage (set during login)
    const user = getUserData();
    setUserData(user);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">Insurance Portal</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/search" className="nav-link">Search</Link>
                                  <Link to="/my-profile" className="nav-link">My Profile</Link>
            <Link to="/billing" className="nav-link">Billing</Link>
            <Link to="/documents" className="nav-link">Documents</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {isAdmin() && (
              <>
                <Link to="/admin/reports" className="nav-link admin-link">Reports</Link>
                <Link to="/preferences" className="nav-link admin-link">Admin Settings</Link>
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              </>
            )}
          <div className="user-info">
            <span className="username">{userData?.username || 'User'}</span>
            <span className={`role-badge role-${userData?.role || 'user'}`}>
              {userData?.role || 'user'}
            </span>
          </div>
          <button onClick={handleLogout} className="nav-link logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 