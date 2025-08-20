const TOKEN_KEY = 'insurance_jwt_token';
const USER_ROLE_KEY = 'insurance_user_role';
const USER_DATA_KEY = 'insurance_user_data';

import { getApiUrl } from './api.js';

const API_BASE_URL = getApiUrl('api');

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  // Basic JWT expiration check (without API call)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('🔍 Token expired locally, clearing auth');
      clearAuth();
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('🔍 Error parsing token, clearing auth');
    clearAuth();
    return false;
  }
};

export const saveUserRole = (role) => {
  localStorage.setItem(USER_ROLE_KEY, role);
};

export const getUserRole = () => {
  return localStorage.getItem(USER_ROLE_KEY) || 'user';
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const clearAuth = () => {
  removeToken();
};

// New functions for backend integration
export const registerUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Save token and user data (same as login)
    saveToken(data.token);
    saveUserRole(data.user.role);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Save token and user data
    saveToken(data.token);
    saveUserRole(data.user.role);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get profile');
    }

    const data = await response.json();
    
    // Update stored user data
    saveUserRole(data.user.role);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    // Try to get user profile to validate token
    await getUserProfile();
    return true;
  } catch (error) {
    console.log('🔍 Token validation failed:', error.message);
    
    // If token is expired or invalid, clear it and return false
    if (error.message.includes('Token expired') || 
        error.message.includes('Invalid token') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('401')) {
      console.log('🔍 Clearing expired/invalid token');
      clearAuth();
    }
    return false;
  }
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Utility function for testing - manually expire the current token
export const expireTokenForTesting = () => {
  const token = getToken();
  if (!token) {
    console.log('🔍 No token to expire');
    return;
  }
  
  try {
    // Decode the token
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    // Create a new payload with expired timestamp
    const expiredPayload = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    };
    
    // Re-encode the token (this is just for testing, not a real JWT)
    const expiredToken = parts[0] + '.' + btoa(JSON.stringify(expiredPayload)) + '.' + parts[2];
    
    // Save the expired token
    localStorage.setItem(TOKEN_KEY, expiredToken);
    console.log('🔍 Token manually expired for testing');
  } catch (error) {
    console.error('🔍 Error expiring token:', error);
  }
}; 