import { useState, useEffect } from 'react';
import { getUserData, getToken } from '../utils/auth';
import { getApiUrl } from '../utils/api.js';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        const response = await fetch(getApiUrl('api/customers/me'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCustomerData(data);
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{customerData?.fullName || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Username</label>
              <p>{customerData?.username || 'Not available'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{customerData?.email || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{customerData?.phone || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <p>{customerData?.dateOfBirth || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Account Type</label>
              <p className={`account-type ${customerData?.role || 'user'}`}>
                {customerData?.role === 'admin' ? 'Administrator' : 'Standard User'}
              </p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Address Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Street Address</label>
              <p>{customerData?.address?.street || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>City</label>
              <p>{customerData?.address?.city || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>State</label>
              <p>{customerData?.address?.state || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>ZIP Code</label>
              <p>{customerData?.address?.zipCode || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Security</h2>
          <div className="security-info">
            <div className="security-item">
              <span className="security-icon">🔒</span>
              <div>
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
            </div>
            <div className="security-item">
              <span className="security-icon">📧</span>
              <div>
                <h3>Email Notifications</h3>
                <p>Get notified about important account activities</p>
                <button className="btn-secondary">Manage Notifications</button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary">Edit Profile</button>
          <button className="btn-secondary">Change Password</button>
          <button className="btn-secondary">Download Data</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile; 