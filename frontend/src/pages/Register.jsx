import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear registration error when user makes changes
    if (registrationError) {
      setRegistrationError('');
    }
  };

  const validatePassword = (password) => {
    const weakPasswords = ['123456', 'password', 'admin', 'qwerty', 'letmein', '123', 'a', 'test'];
    const isWeak = weakPasswords.includes(password.toLowerCase());
    
    return {
      isWeak,
      message: isWeak ? 'Warning: This is a weak password commonly used in attacks' : ''
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegistrationError('');
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Check for weak password but don't block submission (vulnerability)
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation.isWeak) {
      newErrors.password = passwordValidation.message;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Call the real backend registration endpoint
      await registerUser(formData.username, formData.password);
      
      // Registration successful - redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationError(error.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Insurance Portal</h1>
        <h2>Create Account</h2>
        
        {registrationError && (
          <div className="error-message registration-error">
            {registrationError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className={`error-message ${passwordValidation.isWeak ? 'warning' : ''}`}>
                {errors.password}
              </div>
            )}
            {formData.password && !errors.password && passwordValidation.isWeak && (
              <div className="warning-message">
                ⚠️ Weak password detected - this will be allowed for testing purposes
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="register-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="demo-info">
          <p><strong>Security Testing Notes:</strong></p>
          <ul>
            <li>🚨 Weak passwords like "123456", "123", "a" are accepted</li>
            <li>🚨 No password complexity requirements enforced</li>
            <li>🚨 Backend stores passwords in plain text</li>
            <li>🚨 No rate limiting on registration attempts</li>
            <li>✅ Real backend registration endpoint used</li>
            <li>✅ JWT token issued immediately after registration</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register; 