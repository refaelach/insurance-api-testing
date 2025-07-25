const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vulnerableRoutes = require('./routes/vulnerable');
const secureRoutes = require('./routes/secure');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:5173', // Development frontend URL
      'http://localhost:5174', // Docker frontend URL
      'http://frontend:5174',  // Docker internal frontend URL
      'http://127.0.0.1:5173', // Alternative localhost
      'http://127.0.0.1:5174'  // Alternative localhost for Docker
    ];

// Middleware
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', vulnerableRoutes); // 🚨 Vulnerable endpoints for security testing
app.use('/api', secureRoutes); // ✅ Secure endpoints for realistic functionality

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Insurance API Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Insurance API Backend',
    endpoints: {
      health: 'GET /api/health',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile',
      users: 'GET /api/auth/users (admin only)',
      vulnerable: {
        customers: 'GET /api/customers/me (JWT bypass)',
        accounts: 'GET /api/accounts/overview (expired token)',
        policies: 'GET /api/policies/:id (no auth)'
      }
    },
    documentation: 'This is a backend API for security testing purposes'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Insurance API Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🌐 CORS Origins: ${corsOrigins.join(', ')}`);
}); 