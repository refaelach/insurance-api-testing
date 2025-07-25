import { Link } from 'react-router-dom';
import { mockPolicies } from '../data/mockData';
import { expireTokenForTesting } from '../utils/auth';
import './Dashboard.css';

const Dashboard = () => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'expired':
        return 'status-expired';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'auto':
        return '🚗';
      case 'home':
        return '🏠';
      case 'health':
        return '🏥';
      case 'life':
        return '💝';
      default:
        return '📄';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Insurance Dashboard</h1>
        <p>Welcome back! Here are your insurance policies.</p>
      </div>

      {/* Quick Actions Section - Natural place for vulnerable endpoints */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/my-profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>View and update your personal information</p>
          </Link>
          
          <Link to="/billing" className="action-card">
            <div className="action-icon">💳</div>
            <h3>Billing & Payments</h3>
            <p>Manage your account and payment methods</p>
          </Link>
          
          <Link to="/my-policy" className="action-card">
            <div className="action-icon">📄</div>
            <h3>My Policy</h3>
            <p>View your current policy information</p>
          </Link>
        </div>
      </div>

      <div className="policies-grid">
        {mockPolicies.map((policy) => (
          <Link 
            to={`/policy/${policy.id}`} 
            key={policy.id} 
            className="policy-card"
          >
            <div className="policy-header">
              <span className="policy-icon">{getTypeIcon(policy.type)}</span>
              <span className={`policy-status ${getStatusColor(policy.status)}`}>
                {policy.status}
              </span>
            </div>
            
            <div className="policy-content">
              <h3>{policy.type} Insurance</h3>
              <p className="policy-number">{policy.policyNumber}</p>
              <p className="policy-holder">Holder: {policy.holderName}</p>
              <p className="policy-amount">
                Coverage: ${policy.insuredAmount.toLocaleString()}
              </p>
              <p className="policy-premium">
                Premium: ${policy.premium.toLocaleString()}/year
              </p>
            </div>
            
            <div className="policy-footer">
              <span className="view-details">View Details →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Policies</h3>
          <p>{mockPolicies.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Policies</h3>
          <p>{mockPolicies.filter(p => p.status === 'Active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Coverage</h3>
          <p>${mockPolicies.reduce((sum, p) => sum + p.insuredAmount, 0).toLocaleString()}</p>
        </div>
      </div>
      
      <div className="testing-tools">
        <h2>Testing Tools</h2>
        <div className="testing-grid">
          <button 
            onClick={() => {
              expireTokenForTesting();
              alert('Token expired! Refresh the page to see the redirect to login.');
            }} 
            className="testing-card"
          >
            <div className="testing-icon">🧪</div>
            <h3>Test Token Expiration</h3>
            <p>Manually expire your JWT token to test the redirect flow</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 