import { useState } from 'react';
import { mockErrorMessages } from '../data/mockData';
import './ErrorSimulation.css';

const ErrorSimulation = () => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    isActive: false,
    tags: '',
    description: '',
    longString: ''
  });
  const [errorResult, setErrorResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorResult(null);

    // Simulate API call delay
    setTimeout(() => {
      // Simulate different error scenarios based on input
      let errorType = null;
      let errorDetails = {};

      // Check for various error conditions
      if (formData.userId && isNaN(formData.userId)) {
        errorType = 'validation_error';
        errorDetails = {
          field: 'userId',
          value: formData.userId,
          expected: 'number',
          received: typeof formData.userId
        };
      } else if (formData.amount && parseFloat(formData.amount) < 0) {
        errorType = 'validation_error';
        errorDetails = {
          field: 'amount',
          value: formData.amount,
          message: 'Amount must be positive'
        };
      } else if (formData.longString && formData.longString.length > 1000) {
        errorType = 'validation_error';
        errorDetails = {
          field: 'description',
          value: formData.longString.substring(0, 50) + '...',
          message: 'String too long (max 1000 characters)'
        };
      } else if (formData.userId === '999999') {
        errorType = 'database_error';
        errorDetails = {
          query: 'SELECT * FROM users WHERE id = 999999',
          error: 'Connection timeout to database server'
        };
      } else if (formData.userId === 'admin') {
        errorType = 'authorization_error';
        errorDetails = {
          user: formData.userId,
          action: 'update',
          resource: 'user_profile',
          required_role: 'admin'
        };
      } else if (formData.amount === '999999999') {
        errorType = 'system_error';
        errorDetails = {
          component: 'PaymentProcessor',
          method: 'processPayment',
          line: 45,
          stack: 'NullPointerException in PaymentProcessor.java:45'
        };
      } else {
        // Generate a random error for testing
        const errorTypes = ['validation_error', 'database_error', 'authentication_error', 'authorization_error', 'system_error'];
        errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        errorDetails = {
          timestamp: new Date().toISOString(),
          request_id: 'req_' + Math.random().toString(36).substr(2, 9),
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        };
      }

      setErrorResult({
        type: errorType,
        message: mockErrorMessages[errorType],
        details: errorDetails,
        timestamp: new Date().toISOString(),
        requestId: 'req_' + Math.random().toString(36).substr(2, 9)
      });

      setIsSubmitting(false);
    }, 1000);
  };

  const handleTestError = (errorType) => {
    setIsSubmitting(true);
    setErrorResult(null);

    setTimeout(() => {
      setErrorResult({
        type: errorType,
        message: mockErrorMessages[errorType],
        details: {
          timestamp: new Date().toISOString(),
          request_id: 'req_' + Math.random().toString(36).substr(2, 9),
          test_type: 'manual_trigger'
        },
        timestamp: new Date().toISOString(),
        requestId: 'req_' + Math.random().toString(36).substr(2, 9)
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="error-simulation-container">
      <div className="error-simulation-header">
        <h1>Error Simulation</h1>
        <p>Test error handling and verbose error messages</p>
      </div>

      <div className="error-simulation-content">
        <div className="form-section">
          <h2>Test Form with Various Input Types</h2>
          <form onSubmit={handleSubmit} className="test-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="userId">User ID (Number):</label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="Enter numeric user ID"
                />
                <small>Try: "abc" (string), "999999" (DB error), "admin" (auth error)</small>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (Number):</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                />
                <small>Try: -100 (negative), 999999999 (system error)</small>
              </div>

              <div className="form-group">
                <label htmlFor="isActive">Is Active (Boolean):</label>
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <small>Boolean checkbox input</small>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (Array):</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="tag1,tag2,tag3"
                />
                <small>Comma-separated array input</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description (String):</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows="3"
                />
                <small>Text area input</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="longString">Long String Test:</label>
                <textarea
                  id="longString"
                  name="longString"
                  value={formData.longString}
                  onChange={handleInputChange}
                  placeholder="Enter a very long string to test validation..."
                  rows="4"
                />
                <small>Try entering more than 1000 characters</small>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Submit Form'}
            </button>
          </form>
        </div>

        <div className="quick-test-section">
          <h2>Quick Error Tests</h2>
          <div className="error-test-buttons">
            <button
              onClick={() => handleTestError('validation_error')}
              className="error-test-button validation"
            >
              Test Validation Error
            </button>
            <button
              onClick={() => handleTestError('database_error')}
              className="error-test-button database"
            >
              Test Database Error
            </button>
            <button
              onClick={() => handleTestError('authentication_error')}
              className="error-test-button authentication"
            >
              Test Authentication Error
            </button>
            <button
              onClick={() => handleTestError('authorization_error')}
              className="error-test-button authorization"
            >
              Test Authorization Error
            </button>
            <button
              onClick={() => handleTestError('system_error')}
              className="error-test-button system"
            >
              Test System Error
            </button>
          </div>
        </div>

        {errorResult && (
          <div className="error-result-section">
            <h2>Error Result</h2>
            <div className="error-display">
              <div className="error-header">
                <span className={`error-type ${errorResult.type}`}>
                  {errorResult.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="error-timestamp">{new Date(errorResult.timestamp).toLocaleString()}</span>
              </div>
              
              <div className="error-message">
                <strong>Message:</strong> {errorResult.message}
              </div>
              
              <div className="error-details">
                <strong>Details:</strong>
                <pre className="error-details-json">
                  {JSON.stringify(errorResult.details, null, 2)}
                </pre>
              </div>
              
              <div className="error-metadata">
                <p><strong>Request ID:</strong> {errorResult.requestId}</p>
                <p><strong>Timestamp:</strong> {errorResult.timestamp}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="security-notes">
        <h3>Error Testing Notes:</h3>
        <ul>
          <li>This page simulates various error scenarios for security testing</li>
          <li>Test for verbose error messages that might reveal sensitive information</li>
          <li>Look for stack traces, database queries, or internal system details</li>
          <li>Check if error messages expose file paths, usernames, or configuration details</li>
          <li>Test input validation and error handling for different data types</li>
          <li>Verify that errors don't leak sensitive information to users</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorSimulation; 