const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Load users from JSON file
const loadUsers = async () => {
  try {
    const usersPath = path.join(__dirname, '../data/users.json');
    const usersData = await fs.readFile(usersPath, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to JSON file
const saveUsers = async (users) => {
  try {
    const usersPath = path.join(__dirname, '../data/users.json');
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// POST /register - Vulnerable Registration (OWASP API2:2023)
// This endpoint accepts weak passwords without validation
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic input validation (only checks if fields exist, not strength)
    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'Username and password are required'
      });
    }

    // Load existing users
    const users = await loadUsers();
    
    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({
        error: 'Username already exists',
        message: 'Please choose a different username'
      });
    }

    // 🚨 VULNERABLE: No password strength validation
    // This endpoint accepts ANY password, including:
    // - Short passwords (e.g., "123", "pass")
    // - Numeric-only passwords (e.g., "123456")
    // - Common/guessable passwords (e.g., "password", "admin", "qwerty")
    // - Passwords under 6 characters
    // - Empty passwords (if not caught by basic validation)
    
    // Create new user with weak password (no hashing for simplicity)
    const newUser = {
      username: username,
      password: password, // 🚨 Stored in plain text
      role: 'user' // Default role for new registrations
    };

    // Add user to the list
    users.push(newUser);
    
    // Save updated users list
    await saveUsers(users);

    // Generate JWT token for the new user
    const payload = {
      username: newUser.username,
      role: newUser.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '15m' // 15 minutes expiration
    });

    // Return success response
    res.status(201).json({
      message: 'Registration successful',
      token: token,
      user: {
        username: newUser.username,
        role: newUser.role
      },
      expiresIn: '15m'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during registration'
    });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Username and password are required'
      });
    }

    // Load users from file
    const users = await loadUsers();
    
    // Find user by username
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // Check password (in real app, this would be hashed)
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const payload = {
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '15m' // 15 minutes expiration
    });

    // Return success response
    res.json({
      message: 'Login successful',
      token: token,
      user: {
        username: user.username,
        role: user.role
      },
      expiresIn: '15m'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during login'
    });
  }
});

// GET /profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    // Return user information from JWT token
    res.json({
      message: 'Profile retrieved successfully',
      user: {
        username: req.user.username,
        role: req.user.role
      },
      tokenInfo: {
        issuedAt: new Date(req.user.iat * 1000).toISOString(),
        expiresAt: new Date(req.user.exp * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving profile'
    });
  }
});

// GET /users (admin only - for testing)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin role required to view users'
      });
    }

    // Load users from file
    const users = await loadUsers();
    
    // Return users without passwords
    const safeUsers = users.map(user => ({
      username: user.username,
      role: user.role
    }));

    res.json({
      message: 'Users retrieved successfully',
      users: safeUsers,
      count: safeUsers.length
    });

  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving users'
    });
  }
});

module.exports = router; 