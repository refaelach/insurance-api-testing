const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const vulnerableRoutes = require('./routes/vulnerable');
const secureRoutes = require('./routes/secure');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:80',
  'http://frontend:80',
  'http://apitestinginsurance.azurewebsites.net',
  'https://apitestinginsurance.azurewebsites.net',
  'http://ves-io-2b114046-6731-45d9-8696-504488425dff.ac.vh.ves.io',
  'https://ves-io-2b114046-6731-45d9-8696-504488425dff.ac.vh.ves.io',
  'http://dummyinsuranceapp.xyz',
  'https://dummyinsuranceapp.xyz',
  'https://staging.dummyinsuranceapp.xyz'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(null, true); // Still allow for testing purposes
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

// Middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Discovery endpoint - for API discovery tools
app.get('/api/', (req, res) => {
  res.json({
    message: 'Insurance API Backend - API Discovery',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/health',
        description: 'Health check endpoint',
        auth: false
      },
      auth: {
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'User authentication',
          auth: false,
          body: { username: 'string', password: 'string' }
        },
        register: {
          method: 'POST',
          path: '/api/register',
          description: 'User registration',
          auth: false,
          body: { username: 'string', password: 'string' }
        },
        profile: {
          method: 'GET',
          path: '/api/auth/profile',
          description: 'Get user profile',
          auth: true
        },
        users: {
          method: 'GET',
          path: '/api/auth/users',
          description: 'List all users (admin only)',
          auth: true,
          admin: true
        }
      },
      policies: {
        categories: {
          method: 'GET',
          path: '/api/policies/categories',
          description: 'Get policy categories',
          auth: false
        },
        search: {
          method: 'GET',
          path: '/api/policies/search',
          description: 'Search policies',
          auth: false,
          query: { query: 'string', page: 'number', per_page: 'number' }
        },
        details: {
          method: 'GET',
          path: '/api/policies/:id',
          description: 'Get policy details',
          auth: false
        }
      },
      accounts: {
        overview: {
          method: 'GET',
          path: '/api/accounts/overview',
          description: 'Get account overview',
          auth: true
        }
      },
      customers: {
        profile: {
          method: 'GET',
          path: '/api/customers/me',
          description: 'Get customer profile',
          auth: true
        }
      },
      documents: {
        preview: {
          method: 'POST',
          path: '/api/documents/preview',
          description: 'Preview document',
          auth: true,
          body: { documentId: 'string' }
        }
      },
      admin: {
        stats: {
          method: 'GET',
          path: '/api/admin/stats',
          description: 'Get admin statistics',
          auth: true,
          admin: true
        },
        settings: {
          method: 'GET',
          path: '/api/admin/settings',
          description: 'Get admin settings',
          auth: true,
          admin: true
        },
        reports: {
          method: 'GET',
          path: '/api/admin/reports',
          description: 'Get admin reports',
          auth: true,
          admin: true
        }
      }
    },
    documentation: 'This is a backend API for security testing purposes with both secure and vulnerable endpoints'
  });
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
const server = app.listen(PORT, () => {
  console.log(`🚀 Insurance API Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
  console.log(`🌍 Server bound to port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied to bind to port ${PORT}`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 