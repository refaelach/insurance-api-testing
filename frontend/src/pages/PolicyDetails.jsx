import { useParams, Link } from 'react-router-dom';
import { mockPolicies } from '../data/mockData';
import './PolicyDetails.css';

const PolicyDetails = () => {
  const { id } = useParams();
  const policy = mockPolicies.find(p => p.id === parseInt(id));

  if (!policy) {
    return (
      <div className="policy-details-container">
        <div className="error-message">
          <h2>Policy Not Found</h2>
          <p>The requested policy could not be found.</p>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

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
    <div className="policy-details-container">
      <div className="policy-details-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <div className="policy-title">
          <span className="policy-icon-large">{getTypeIcon(policy.type)}</span>
          <div>
            <h1>{policy.type} Insurance Policy</h1>
            <p className="policy-number-large">{policy.policyNumber}</p>
          </div>
        </div>
        <span className={`policy-status-large ${getStatusColor(policy.status)}`}>
          {policy.status}
        </span>
      </div>

      <div className="policy-details-content">
        <div className="policy-section">
          <h2>Policy Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Policy Number:</label>
              <span>{policy.policyNumber}</span>
            </div>
            <div className="info-item">
              <label>Policy Type:</label>
              <span>{policy.type} Insurance</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={getStatusColor(policy.status)}>{policy.status}</span>
            </div>
            <div className="info-item">
              <label>Coverage Amount:</label>
              <span>${policy.insuredAmount.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Annual Premium:</label>
              <span>${policy.premium.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Start Date:</label>
              <span>{new Date(policy.startDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>End Date:</label>
              <span>{new Date(policy.endDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Coverage Type:</label>
              <span>{policy.coverage}</span>
            </div>
          </div>
        </div>

        <div className="policy-section">
          <h2>Policy Holder Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{policy.holderName}</span>
            </div>
          </div>
        </div>

        {policy.type === 'Auto' && (
          <div className="policy-section">
            <h2>Vehicle Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Make:</label>
                <span>{policy.vehicleMake}</span>
              </div>
              <div className="info-item">
                <label>Model:</label>
                <span>{policy.vehicleModel}</span>
              </div>
              <div className="info-item">
                <label>Year:</label>
                <span>{policy.vehicleYear}</span>
              </div>
            </div>
          </div>
        )}

        {policy.type === 'Home' && (
          <div className="policy-section">
            <h2>Property Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Address:</label>
                <span>{policy.propertyAddress}</span>
              </div>
              <div className="info-item">
                <label>Property Type:</label>
                <span>{policy.propertyType}</span>
              </div>
            </div>
          </div>
        )}

        {policy.type === 'Health' && (
          <div className="policy-section">
            <h2>Health Plan Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Plan Type:</label>
                <span>{policy.planType}</span>
              </div>
            </div>
          </div>
        )}

        {policy.type === 'Life' && (
          <div className="policy-section">
            <h2>Life Insurance Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Policy Type:</label>
                <span>{policy.policyType}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDetails; 