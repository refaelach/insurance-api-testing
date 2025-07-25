import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      if (!formData.username.trim() || !formData.password.trim()) {
        setError('Please enter both username and password');
        setIsLoading(false);
        return;
      }

      // Call backend login API
      await loginUser(formData.username, formData.password);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Insurance Portal</h1>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
        
        <div className="demo-info">
          <p><strong>Demo Credentials:</strong></p>
          <p><strong>Admin Users:</strong></p>
          <ul>
            <li>admin1 / adminpass</li>
            <li>admin2 / admin123</li>
            <li>admin.user / admin@insurance</li>
          </ul>
          <p><strong>Regular Users:</strong></p>
          <ul>
            <li>user1 / userpass</li>
            <li>user2 / user123</li>
            <li>john.smith / password123</li>
            <li>sarah.johnson / sarah2024</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login; 