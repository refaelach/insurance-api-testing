const jwt = require('jsonwebtoken');

// JWT secret from environment variable or fallback to hardcoded value
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-security-testing-2024';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'No authorization token provided'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'JWT token has expired',
          expiredAt: err.expiredAt
        });
      }
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'JWT token is invalid or malformed'
      });
    }

    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `Access denied. Required role: ${role}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
}; 