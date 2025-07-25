const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

// GET /api/policies/categories - Available Insurance Policy Types
// No authentication required - public information
router.get('/policies/categories', (req, res) => {
  try {
    const categories = [
      "Auto",
      "Home", 
      "Health",
      "Travel",
      "Pet",
      "Life",
      "Business",
      "Motorcycle",
      "Boat",
      "RV"
    ];

    res.json(categories);
  } catch (error) {
    console.error('Error fetching policy categories:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch policy categories'
    });
  }
});

// GET /api/user/notifications - User Notifications and Alerts
// Requires valid JWT token
router.get('/user/notifications', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Generate mock notifications based on user
    const notifications = [
      {
        id: 1,
        type: "policy",
        message: `Your policy INS-${Math.floor(Math.random() * 900000) + 100000} will expire in ${Math.floor(Math.random() * 30) + 10} days.`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 2,
        type: "payment",
        message: `Payment received for invoice #INV-2024-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}.`,
        timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: 3,
        type: "claim",
        message: "Your claim CLM-2024-9876 has been approved and payment will be processed within 3-5 business days.",
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        read: false
      },
      {
        id: 4,
        type: "system",
        message: "Your account has been successfully verified. Welcome to our insurance platform!",
        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch notifications'
    });
  }
});

// POST /api/claims/estimate - Submit Claim Estimate Request
// Requires valid JWT token
router.post('/claims/estimate', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate request body
    const { policyId, incidentType, estimatedDamage } = req.body;
    
    if (!policyId) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'policyId is required'
      });
    }
    
    if (!incidentType) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'incidentType is required'
      });
    }
    
    if (!estimatedDamage || isNaN(estimatedDamage) || estimatedDamage <= 0) {
      return res.status(400).json({
        error: 'Invalid estimated damage',
        message: 'estimatedDamage must be a positive number'
      });
    }
    
    // Generate claim ID
    const claimId = `CLM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    
    // Mock response
    const response = {
      claimId: claimId,
      status: "estimate-received",
      submittedBy: decoded.username,
      submittedAt: new Date().toISOString(),
      policyId: policyId,
      incidentType: incidentType,
      estimatedDamage: parseFloat(estimatedDamage),
      nextSteps: [
        "A claims adjuster will review your estimate within 24-48 hours",
        "You may be contacted for additional information or photos",
        "A final claim decision will be provided within 5-7 business days"
      ]
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error submitting claim estimate:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to submit claim estimate'
    });
  }
});

// GET /api/coverage/details - User's Active Coverage Summary
// Requires valid JWT token
router.get('/coverage/details', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization token is required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Mock coverage data based on user
    const coverageData = {
      policyNumber: `INS-${Math.floor(Math.random() * 900000) + 100000}`,
      policyType: "Auto Insurance",
      effectiveDate: "2024-01-01",
      expirationDate: "2025-01-01",
      status: "Active",
      coverage: {
        liability: {
          bodilyInjury: "$100,000 per person / $300,000 per accident",
          propertyDamage: "$50,000 per accident"
        },
        collision: {
          deductible: "$500",
          coverage: "Yes"
        },
        comprehensive: {
          deductible: "$500", 
          coverage: "Yes"
        },
        uninsuredMotorist: {
          bodilyInjury: "$100,000 per person / $300,000 per accident",
          propertyDamage: "$50,000 per accident"
        },
        medicalPayments: "$5,000 per person",
        rentalReimbursement: "$30 per day, up to 30 days",
        roadsideAssistance: "Yes",
        glassCoverage: "Yes"
      },
      premium: {
        monthly: "$125.00",
        annual: "$1,500.00",
        nextPayment: "2024-02-01"
      },
      vehicle: {
        year: "2020",
        make: "Toyota",
        model: "Camry",
        vin: "1HGBH41JXMN109186"
      }
    };

    res.json(coverageData);
  } catch (error) {
    console.error('Error fetching coverage details:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please log in again'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch coverage details'
    });
  }
});

module.exports = router; 