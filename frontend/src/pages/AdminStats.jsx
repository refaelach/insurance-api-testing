import { useState, useEffect } from 'react';
import './AdminStats.css';

const AdminStats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        console.log('🔍 Fetching admin stats...');
        setLoading(true);
        
        // 🚨 VULNERABLE: No authentication required - this endpoint exposes admin data
        const response = await fetch(`${getApiUrl('api/admin/stats')}, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Admin stats received:', data);
          setStatsData(data);
        } else {
          console.error('🔍 Response not ok:', response.status);
          setError('Failed to load admin statistics');
        }
      } catch (err) {
        console.error('🔍 Error fetching admin stats:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-stats-container">
        <div className="loading">Loading admin statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-stats-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <div className="admin-stats-header">
        <h1>System Statistics</h1>
        <p>Real-time system performance and business metrics</p>
      </div>

      <div className="admin-stats-content">
        <div className="stats-overview">
          <h2>Business Overview</h2>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Policies</h3>
                <p className="stat-value">{statsData?.totalPolicies?.toLocaleString()}</p>
                <p className="stat-label">Active insurance policies</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">{statsData?.totalRevenue}</p>
                <p className="stat-label">Annual revenue</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Active Claims</h3>
                <p className="stat-value">{statsData?.activeClaims}</p>
                <p className="stat-label">Open claims</p>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending Approvals</h3>
                <p className="stat-value">{statsData?.pendingApprovals}</p>
                <p className="stat-label">Awaiting review</p>
              </div>
            </div>
          </div>
        </div>

        <div className="system-metrics">
          <h2>System Health</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>System Status</h3>
              <div className={`status-indicator ${statsData?.systemHealth?.toLowerCase()}`}>
                {statsData?.systemHealth}
              </div>
            </div>

            <div className="metric-card">
              <h3>Active Users</h3>
              <p className="metric-value">{statsData?.activeUsers}</p>
              <p className="metric-label">Currently online</p>
            </div>

            <div className="metric-card">
              <h3>Database Size</h3>
              <p className="metric-value">{statsData?.databaseSize}</p>
              <p className="metric-label">Current storage</p>
            </div>

            <div className="metric-card">
              <h3>Last Backup</h3>
              <p className="metric-value">{new Date(statsData?.lastBackup).toLocaleDateString()}</p>
              <p className="metric-label">System backup</p>
            </div>
          </div>
        </div>

        <div className="security-metrics">
          <h2>Security Overview</h2>
          <div className="security-grid">
            <div className="security-card alert">
              <div className="security-icon">🚨</div>
              <div className="security-content">
                <h3>Security Alerts</h3>
                <p className="security-value">{statsData?.securityAlerts}</p>
                <p className="security-label">Active alerts</p>
              </div>
            </div>

            <div className="security-card warning">
              <div className="security-icon">🔒</div>
              <div className="security-content">
                <h3>Failed Logins</h3>
                <p className="security-value">{statsData?.failedLogins}</p>
                <p className="security-label">Last 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats; 