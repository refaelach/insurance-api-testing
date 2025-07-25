import { useState } from 'react';
import { getApiUrl } from '../utils/api.js';
import './ContactSupport.css';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      console.log('🔍 Submitting contact form...');
      
      // 🚨 VULNERABLE: This endpoint exposes detailed error messages
      const response = await fetch(getApiUrl('api/support/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('🔍 Response data:', data);

      if (response.ok) {
        setResponse(data);
      } else {
        // 🚨 VULNERABLE: Display the full error response without sanitization
        setError(data);
      }
    } catch (err) {
      console.error('🔍 Error submitting form:', err);
      setError({
        error: 'Network error',
        message: err.message,
        stackTrace: err.stack
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="contact-support-container">
      <div className="contact-support-header">
        <h1>Contact Support</h1>
        <p>Get help with your insurance policies and account</p>
      </div>

      <div className="contact-support-content">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe your issue or question"
                rows="5"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {response && (
          <div className="response-section success">
            <h3>✅ Success Response</h3>
            <div className="response-content">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>
        )}

        {error && (
          <div className="response-section error">
            <h3>Error Response</h3>
            <div className="response-content">
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSupport; 