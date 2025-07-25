import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth'
import { getApiUrl } from '../utils/api.js';;
import './UserPreferences.css';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load current preferences (simulated)
    setPreferences({
      theme: 'light',
      notifications: true
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    setError(null);

    try {
      console.log('🔍 Updating user preferences:', preferences);
      
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      // 🚨 VULNERABLE: This endpoint is vulnerable to mass assignment
      // But the UI only sends legitimate fields - the vulnerability is hidden
      const response = await fetch(getApiUrl('api/admin/settings'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences)
      });

      console.log('🔍 Response status:', response.status);
      
      const data = await response.json();
      console.log('🔍 Response data:', data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(data);
      }
    } catch (err) {
      console.error('🔍 Error updating preferences:', err);
      setError({
        error: 'Network error',
        message: err.message
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-preferences-container">
      <div className="preferences-header">
        <h1>Admin Settings</h1>
        <p>Configure system preferences and appearance</p>
      </div>

      <div className="preferences-content">
        <div className="preferences-form-section">
          <h2>System Configuration</h2>
          <form onSubmit={handleSubmit} className="preferences-form">
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                name="theme"
                value={preferences.theme}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={preferences.notifications}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="checkmark"></span>
                Enable Notifications
              </label>
              <p className="help-text">Receive updates about your policies and claims</p>
            </div>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-section success">
            <h3>✅ Preferences Updated</h3>
            <div className="result-content">
              <div className="result-details">
                <p><strong>Message:</strong> {result.message}</p>
                <p><strong>Updated By:</strong> {result.settings?.updatedBy}</p>
                <p><strong>Updated At:</strong> {new Date(result.settings?.updatedAt).toLocaleString()}</p>
              </div>
              
              <div className="settings-summary">
                <h4>Current Settings</h4>
                <div className="settings-grid">
                  <div className="setting-item">
                    <span className="setting-label">Theme:</span>
                    <span className="setting-value">{result.settings?.theme}</span>
                  </div>
                  <div className="setting-item">
                    <span className="setting-label">Notifications:</span>
                    <span className="setting-value">{result.settings?.notifications ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="result-section error">
            <h3>❌ Update Failed</h3>
            <div className="result-content">
              <div className="result-details">
                <p><strong>Error:</strong> {error.error}</p>
                {error.message && <p><strong>Message:</strong> {error.message}</p>}
                {error.code && <p><strong>Code:</strong> {error.code}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>About Admin Settings</h3>
          <p>These settings control the system-wide appearance and behavior. Changes affect all users of the platform.</p>
          <div className="info-cards">
            <div className="info-card">
              <h4>Theme</h4>
              <p>Set the default theme for all users. Choose between light and dark themes, or let the system decide.</p>
            </div>
            <div className="info-card">
              <h4>Notifications</h4>
              <p>Configure system-wide notification preferences and alert settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences; 