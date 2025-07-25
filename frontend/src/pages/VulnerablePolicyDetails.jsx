import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api.js';
import './VulnerablePolicyDetails.css';

const VulnerablePolicyDetails = () => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        console.log('🔍 Fetching policy data...');
        setLoading(true);
        
        // 🚨 VULNERABLE: No authentication required - this endpoint exposes sensitive data
        const response = await fetch(getApiUrl('api/policies/mine'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Policy data received:', data);
          setPolicyData(data);
        } else {
          console.error('🔍 Response not ok:', response.status);
          setError('Failed to load policy documents');
        }
      } catch (err) {
        console.error('🔍 Error fetching policy data:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  if (loading) {
    return (
      <div className="documents-container">
        <div className="loading">Loading policy documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="documents-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h1>My Policy</h1>
        <p>View your current policy information and documents</p>
      </div>

      <div className="documents-content">
        <div className="policy-info-section">
          <h2>Policy Information</h2>
          <div className="policy-summary">
            <div className="policy-card">
              <div className="policy-header">
                <span className="policy-icon">
                  {policyData?.type === 'Auto' ? '🚗' : 
                   (policyData?.type === 'Home' ? '🏠' : 
                   (policyData?.type === 'Health' ? '🏥' : '💝'))}
                </span>
                <span className="policy-status">
                  {policyData && policyData.status}
                </span>
              </div>
              <div className="policy-details">
                <h3>{policyData?.type} Insurance Policy</h3>
                <p className="policy-number">Policy #: {policyData?.policyNumber}</p>
                <p className="policy-holder">Insured: {policyData?.holderName}</p>
                <p className="policy-coverage">Coverage: ${policyData?.insuredAmount?.toLocaleString()}</p>
                <p className="policy-premium">Premium: ${policyData?.premium?.toLocaleString()}/year</p>
              </div>
            </div>
          </div>
        </div>

        <div className="documents-section">
          <h2>Available Documents</h2>
          <div className="documents-grid">
            <div className="document-item">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <h3>Policy Certificate</h3>
                <p>Official policy certificate and terms</p>
                <span className="document-date">Updated: {policyData?.effectiveDate}</span>
              </div>
              <button className="btn-primary">Download PDF</button>
            </div>

            <div className="document-item">
              <div className="document-icon">📋</div>
              <div className="document-info">
                <h3>Declaration Page</h3>
                <p>Policy declarations and coverage details</p>
                <span className="document-date">Updated: {policyData?.effectiveDate}</span>
              </div>
              <button className="btn-primary">Download PDF</button>
            </div>

            <div className="document-item">
              <div className="document-icon">📝</div>
              <div className="document-info">
                <h3>Application Form</h3>
                <p>Original application and supporting documents</p>
                <span className="document-date">Submitted: {policyData?.applicationDate}</span>
              </div>
              <button className="btn-primary">Download PDF</button>
            </div>

            <div className="document-item">
              <div className="document-icon">📊</div>
              <div className="document-info">
                <h3>Coverage Summary</h3>
                <p>Detailed coverage breakdown and limits</p>
                <span className="document-date">Updated: {policyData?.effectiveDate}</span>
              </div>
              <button className="btn-primary">Download PDF</button>
            </div>
          </div>
        </div>

        <div className="personal-info-section">
          <h2>Personal Information</h2>
          <div className="personal-info">
            <div className="info-group">
              <h3>Primary Insured</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{policyData?.holderName}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{policyData?.dateOfBirth}</p>
                </div>
                <div className="info-item">
                  <label>Social Security Number</label>
                  <p>{policyData?.ssn}</p>
                </div>
                <div className="info-item">
                  <label>Driver's License</label>
                  <p>{policyData?.driversLicense}</p>
                </div>
              </div>
            </div>

            <div className="info-group">
              <h3>Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{policyData?.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{policyData?.phone}</p>
                </div>
                <div className="info-item">
                  <label>Address</label>
                  <p>{policyData?.address}</p>
                </div>
              </div>
            </div>

            <div className="info-group">
              <h3>Emergency Contact</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{policyData?.emergencyContact?.name}</p>
                </div>
                <div className="info-item">
                  <label>Relationship</label>
                  <p>{policyData?.emergencyContact?.relationship}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{policyData?.emergencyContact?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="documents-actions">
          <button className="btn-primary">Download All Documents</button>
          <button className="btn-secondary">Print Documents</button>
          <button className="btn-secondary">Email Documents</button>
          <button className="btn-secondary">Request Changes</button>
        </div>
      </div>
    </div>
  );
};

export default VulnerablePolicyDetails; 