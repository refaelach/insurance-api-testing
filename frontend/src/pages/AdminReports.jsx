import { useState, useEffect } from 'react';
import { getToken, isAdmin } from '../utils/auth'
import { getApiUrl } from '../utils/api.js';;
import './AdminReports.css';

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError({ error: 'Authentication required' });
          setLoading(false);
          return;
        }

        const response = await fetch(getApiUrl('api/admin/reports'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (response.ok) {
          setReports(data);
          setUserRole('admin');
        } else if (response.status === 403) {
          setError(data);
          setUserRole('user');
        } else {
          setError(data);
        }
      } catch (err) {
        console.error('Error fetching admin reports:', err);
        setError({
          error: 'Network error',
          message: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="admin-reports-container">
        <div className="loading-section">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error && error.code === 'ADMIN_ACCESS_REQUIRED') {
    return (
      <div className="admin-reports-container">
        <div className="restricted-access">
          <h1>🔒 Access Restricted</h1>
          <div className="restricted-content">
            <h2>Admin Reports</h2>
            <p>You don't have permission to access this page. Admin privileges are required to view system reports.</p>
            
            <div className="access-info">
              <h3>Required Permissions</h3>
              <ul>
                <li>Admin role access</li>
                <li>System reports viewing privileges</li>
                <li>Financial data access</li>
              </ul>
            </div>
            
            <div className="contact-admin">
              <p>If you believe you should have access to this page, please contact your system administrator.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reports-container">
        <div className="error-section">
          <h2>❌ Error Loading Reports</h2>
          <p><strong>Error:</strong> {error.error}</p>
          {error.message && <p><strong>Message:</strong> {error.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-container">
      <div className="admin-reports-header">
        <h1>📊 Admin Reports</h1>
        <p>System reports and analytics dashboard</p>
      </div>

      <div className="reports-content">
        <div className="report-section">
          <h2>💰 Monthly Revenue Report</h2>
          <div className="report-grid">
            <div className="report-card">
              <h3>Total Revenue</h3>
              <div className="metric-value">{reports.monthlyRevenue.total}</div>
            </div>
            <div className="report-card">
              <h3>Active Policies</h3>
              <div className="metric-value">{reports.monthlyRevenue.policies.toLocaleString()}</div>
            </div>
            <div className="report-card">
              <h3>Claims</h3>
              <div className="metric-value">{reports.monthlyRevenue.claims}</div>
            </div>
            <div className="report-card">
              <h3>Net Profit</h3>
              <div className="metric-value">{reports.monthlyRevenue.netProfit}</div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>👥 User Activity Report</h2>
          <div className="report-grid">
            <div className="report-card">
              <h3>Active Users</h3>
              <div className="metric-value">{reports.userActivity.activeUsers.toLocaleString()}</div>
            </div>
            <div className="report-card">
              <h3>New Registrations</h3>
              <div className="metric-value">{reports.userActivity.newRegistrations}</div>
            </div>
            <div className="report-card">
              <h3>Login Attempts</h3>
              <div className="metric-value">{reports.userActivity.loginAttempts.toLocaleString()}</div>
            </div>
            <div className="report-card">
              <h3>Failed Logins</h3>
              <div className="metric-value error">{reports.userActivity.failedLogins}</div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>⚙️ System Metrics</h2>
          <div className="report-grid">
            <div className="report-card">
              <h3>System Uptime</h3>
              <div className="metric-value success">{reports.systemMetrics.uptime}</div>
            </div>
            <div className="report-card">
              <h3>Response Time</h3>
              <div className="metric-value">{reports.systemMetrics.responseTime}</div>
            </div>
            <div className="report-card">
              <h3>DB Connections</h3>
              <div className="metric-value">{reports.systemMetrics.databaseConnections}</div>
            </div>
            <div className="report-card">
              <h3>Cache Hit Rate</h3>
              <div className="metric-value">{reports.systemMetrics.cacheHitRate}</div>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>🔒 Security Report</h2>
          <div className="report-grid">
            <div className="report-card">
              <h3>Suspicious Activities</h3>
              <div className="metric-value warning">{reports.securityReport.suspiciousActivities}</div>
            </div>
            <div className="report-card">
              <h3>Blocked IPs</h3>
              <div className="metric-value">{reports.securityReport.blockedIPs}</div>
            </div>
            <div className="report-card">
              <h3>Failed Auth Attempts</h3>
              <div className="metric-value error">{reports.securityReport.failedAuthAttempts}</div>
            </div>
            <div className="report-card">
              <h3>Last Security Scan</h3>
              <div className="metric-value">{new Date(reports.securityReport.lastSecurityScan).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="report-meta">
          <p><strong>Report Period:</strong> {reports.reportPeriod}</p>
          <p><strong>Generated:</strong> {new Date(reports.generatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 