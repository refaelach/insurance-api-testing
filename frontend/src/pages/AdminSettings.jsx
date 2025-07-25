import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth'
import { getApiUrl } from '../utils/api.js';;
import './AdminSettings.css';

const AdminSettings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminSettings = async () => {
      try {
        console.log('🔍 Fetching admin settings...');
        setLoading(true);
        
        const token = getToken();
        
        // 🚨 VULNERABLE: Weak role validation - this endpoint accepts any valid token
        const response = await fetch(`${getApiUrl('api/admin/settings')}, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Admin settings received:', data);
          setSettingsData(data);
        } else {
          console.error('🔍 Response not ok:', response.status);
          setError('Failed to load admin settings');
        }
      } catch (err) {
        console.error('🔍 Error fetching admin settings:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSettings();
  }, []);

  if (loading) {
    return (
      <div className="admin-settings-container">
        <div className="loading">Loading admin settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-settings-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-settings-container">
      <div className="admin-settings-header">
        <h1>System Settings</h1>
        <p>Configure system parameters and security settings</p>
      </div>

      <div className="admin-settings-content">
        <div className="settings-section">
          <h2>System Configuration</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <h3>Maintenance Mode</h3>
                <div className={`status-badge ${settingsData?.maintenanceMode ? 'enabled' : 'disabled'}`}>
                  {settingsData?.maintenanceMode ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <p className="setting-description">Temporarily disable system access for maintenance</p>
            </div>

            <div className="setting-card">
              <div className="setting-header">
                <h3>System Version</h3>
                <div className="version-badge">{settingsData?.version}</div>
              </div>
              <p className="setting-description">Current system version and build</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Network Security</h2>
          <div className="settings-grid">
            <div className="setting-card wide">
              <h3>Allowed IP Addresses</h3>
              <div className="ip-list">
                {settingsData?.allowedIPs?.map((ip, index) => (
                  <span key={index} className="ip-badge">{ip}</span>
                ))}
              </div>
              <p className="setting-description">IP addresses allowed to access the system</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Database Configuration</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <h3>Database Host</h3>
              <p className="setting-value">{settingsData?.databaseConfig?.host}</p>
              <p className="setting-description">Database server address</p>
            </div>

            <div className="setting-card">
              <h3>Database Port</h3>
              <p className="setting-value">{settingsData?.databaseConfig?.port}</p>
              <p className="setting-description">Database connection port</p>
            </div>

            <div className="setting-card">
              <h3>Database Name</h3>
              <p className="setting-value">{settingsData?.databaseConfig?.name}</p>
              <p className="setting-description">Database instance name</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Security Settings</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <h3>Max Login Attempts</h3>
                <div className="value-badge">{settingsData?.securitySettings?.maxLoginAttempts}</div>
              </div>
              <p className="setting-description">Maximum failed login attempts before lockout</p>
            </div>

            <div className="setting-card">
              <div className="setting-header">
                <h3>Session Timeout</h3>
                <div className="value-badge">{settingsData?.securitySettings?.sessionTimeout}s</div>
              </div>
              <p className="setting-description">Session timeout in seconds</p>
            </div>

            <div className="setting-card">
              <div className="setting-header">
                <h3>Multi-Factor Authentication</h3>
                <div className={`status-badge ${settingsData?.securitySettings?.requireMFA ? 'enabled' : 'disabled'}`}>
                  {settingsData?.securitySettings?.requireMFA ? 'Required' : 'Optional'}
                </div>
              </div>
              <p className="setting-description">Require MFA for user authentication</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Backup Configuration</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <h3>Backup Frequency</h3>
              <p className="setting-value">{settingsData?.backupSettings?.frequency}</p>
              <p className="setting-description">How often backups are performed</p>
            </div>

            <div className="setting-card">
              <h3>Retention Period</h3>
              <p className="setting-value">{settingsData?.backupSettings?.retention}</p>
              <p className="setting-description">How long backups are kept</p>
            </div>

            <div className="setting-card wide">
              <h3>Backup Location</h3>
              <p className="setting-value">{settingsData?.backupSettings?.location}</p>
              <p className="setting-description">Directory where backups are stored</p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary">Save Changes</button>
        <button className="btn-secondary">Reset to Defaults</button>
        <button className="btn-secondary">Export Configuration</button>
      </div>
    </div>
  );
};

export default AdminSettings; 