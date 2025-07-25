import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken, isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const hasValidated = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple validation attempts
      if (hasValidated.current) {
        return;
      }
      
      hasValidated.current = true;
      
      try {
        console.log('🔍 Checking authentication...');
        
        // First check if token exists
        if (!isAuthenticated()) {
          console.log('🔍 No token found, redirecting to login');
          setIsValid(false);
          setRedirectToLogin(true);
          setIsValidating(false);
          return;
        }

        // Validate token with backend
        console.log('🔍 Validating token with backend...');
        const isValidToken = await validateToken();
        
        if (isValidToken) {
          console.log('🔍 Token is valid');
          setIsValid(true);
        } else {
          console.log('🔍 Token is invalid/expired, redirecting to login');
          setIsValid(false);
          setRedirectToLogin(true);
        }
      } catch (error) {
        console.error('🔍 Token validation error:', error);
        setIsValid(false);
        setRedirectToLogin(true);
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, []);

  if (isValidating) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Validating authentication...
      </div>
    );
  }

  if (redirectToLogin) {
    console.log('🔍 Redirecting to login page');
    return <Navigate to="/login" replace />;
  }

  if (!isValid) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Authentication required. Please log in.
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 