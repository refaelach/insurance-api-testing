import { useState, useEffect } from 'react';
import { getUserData, getToken } from '../utils/auth'
import { getApiUrl } from '../utils/api.js';;
import './AccountOverview.css';

const AccountOverview = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        const response = await fetch(getApiUrl('api/accounts/overview'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAccountData(data);
        } else {
          setError('Failed to load account information');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return (
      <div className="billing-container">
        <div className="loading">Loading account information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Billing & Payments</h1>
        <p>Manage your account billing and payment methods</p>
      </div>

      <div className="billing-content">
        <div className="billing-section">
          <h2>Account Overview</h2>
          <div className="account-summary">
            <div className="summary-card">
              <div className="summary-icon">💳</div>
              <div className="summary-content">
                <h3>Account Type</h3>
                <p className="account-type">{accountData?.accountType || 'Standard'}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📅</div>
              <div className="summary-content">
                <h3>Next Renewal</h3>
                <p>{accountData?.renewalDate || 'Not available'}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>Monthly Premium</h3>
                <p>${accountData?.monthlyPremium || '0'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="billing-section">
          <h2>Payment Methods</h2>
          <div className="payment-methods">
            <div className="payment-method">
              <div className="payment-icon">💳</div>
              <div className="payment-details">
                <h3>Primary Payment Method</h3>
                <p>Visa ending in {accountData?.paymentMethod?.last4 || '****'}</p>
                <p>Expires: {accountData?.paymentMethod?.expiry || 'N/A'}</p>
              </div>
              <button className="btn-secondary">Edit</button>
            </div>
            <button className="btn-primary">Add Payment Method</button>
          </div>
        </div>

        <div className="billing-section">
          <h2>Recent Transactions</h2>
          <div className="transactions">
            {accountData?.recentTransactions?.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-info">
                  <h4>{transaction.description}</h4>
                  <p>{transaction.date}</p>
                </div>
                <div className="transaction-amount">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                  </span>
                  <span className="transaction-status">{transaction.status}</span>
                </div>
              </div>
            )) || (
              <p className="no-transactions">No recent transactions</p>
            )}
          </div>
        </div>

        <div className="billing-section">
          <h2>Billing Preferences</h2>
          <div className="billing-preferences">
            <div className="preference-item">
              <div>
                <h3>Paperless Billing</h3>
                <p>Receive bills electronically instead of paper</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={accountData?.paperlessBilling} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h3>Auto-Pay</h3>
                <p>Automatically pay your premium each month</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={accountData?.autoPay} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h3>Email Notifications</h3>
                <p>Get notified about upcoming payments</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={accountData?.emailNotifications} />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="billing-actions">
          <button className="btn-primary">Make Payment</button>
          <button className="btn-secondary">Download Statement</button>
          <button className="btn-secondary">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview; 