import { useState, useEffect } from 'react';
import { getUserProfile, getUserData } from '../utils/auth';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setUserData(profileData.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        // Fallback to stored user data
        const storedUserData = getUserData();
        if (storedUserData) {
          setUserData(storedUserData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px'
        }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="profile-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: 'red'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">Username:</div>
              <div className="info-value">{userData?.username || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Email Address:</div>
              <div className="info-value">{userData?.email || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone Number:</div>
              <div className="info-value">{userData?.phone || 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Address:</div>
              <div className="info-value">{userData?.address || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">User Role:</div>
              <div className="info-value">
                <span className={`role-badge role-${userData?.role || 'user'}`}>
                  {userData?.role || 'user'}
                </span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Member Since:</div>
              <div className="info-value">{userData?.memberSince ? formatDate(userData.memberSince) : 'N/A'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Account Status:</div>
              <div className="info-value">
                <span className="status-badge status-active">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Security Information</h2>
          <div className="profile-info">
            <div className="info-row">
              <div className="info-label">Last Login:</div>
              <div className="info-value">Today at 9:30 AM</div>
            </div>
            <div className="info-row">
              <div className="info-label">Password Last Changed:</div>
              <div className="info-value">30 days ago</div>
            </div>
            <div className="info-row">
              <div className="info-label">Two-Factor Authentication:</div>
              <div className="info-value">
                <span className="status-badge status-inactive">Not Enabled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-button primary">Edit Profile</button>
          <button className="action-button secondary">Change Password</button>
          <button className="action-button secondary">Enable 2FA</button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 