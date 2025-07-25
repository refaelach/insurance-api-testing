# Insurance API Backend

A Node.js Express backend for the Insurance Portal application, designed for API security testing.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and user roles
- **Static User Management**: User data stored in JSON file
- **CORS Support**: Configured for frontend integration
- **Security Testing Ready**: Designed for OWASP API testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3001)

### JWT Configuration
- **Secret**: Hardcoded for testing purposes
- **Expiration**: 15 minutes
- **Algorithm**: HS256

## 📡 API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin1",
  "password": "adminpass"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin1",
    "role": "admin"
  },
  "expiresIn": "15m"
}
```

#### POST /api/auth/register
🚨 **VULNERABLE ENDPOINT** - Register new user (accepts weak passwords)

**Request Body:**
```json
{
  "username": "newuser",
  "password": "123"  // 🚨 Accepts any password, including weak ones
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "newuser",
    "role": "user"
  },
  "expiresIn": "15m"
}
```

**Vulnerability Details:**
- Accepts passwords of any length (including single characters)
- Accepts common weak passwords (123, password, admin, etc.)
- No password strength validation
- Stores passwords in plain text
- Violates OWASP API2:2023 - Broken Authentication

#### GET /api/auth/profile
Get user profile information (requires JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "username": "admin1",
    "role": "admin"
  },
  "tokenInfo": {
    "issuedAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-15T10:45:00.000Z"
  }
}
```

#### GET /api/auth/users
Get list of users (admin only, requires JWT token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "username": "admin1",
      "role": "admin"
    },
    {
      "username": "user1",
      "role": "user"
    }
  ],
  "count": 2
}
```

### Health Check

#### GET /api/health
Check API health status.

**Response:**
```json
{
  "message": "Insurance API Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### ✅ Secure Endpoints (Realistic Functionality)

These endpoints provide realistic, secure insurance app functionality:

#### GET /api/policies/categories
**Description:** Returns available insurance policy types
- **Auth:** No authentication required
- **Response:** Array of policy categories

**Example Response:**
```json
[
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
]
```

#### GET /api/user/notifications
**Description:** Returns recent user alerts and notifications
- **Auth:** Requires valid JWT token
- **Response:** Array of notification objects

**Example Response:**
```json
[
  {
    "id": 1,
    "type": "policy",
    "message": "Your policy INS-123456 will expire in 30 days.",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "read": false
  },
  {
    "id": 2,
    "type": "payment",
    "message": "Payment received for invoice #INV-2024-003.",
    "timestamp": "2024-01-14T15:45:00.000Z",
    "read": true
  }
]
```

#### POST /api/claims/estimate
**Description:** Submit a basic claim estimate request
- **Auth:** Requires valid JWT token
- **Input:** JSON with policyId, incidentType, estimatedDamage
- **Response:** Claim estimate confirmation

**Request Body:**
```json
{
  "policyId": "INS-123456",
  "incidentType": "vehicle",
  "estimatedDamage": 3000
}
```

**Example Response:**
```json
{
  "claimId": "CLM-2024-9876",
  "status": "estimate-received",
  "submittedBy": "user1",
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "policyId": "INS-123456",
  "incidentType": "vehicle",
  "estimatedDamage": 3000,
  "nextSteps": [
    "A claims adjuster will review your estimate within 24-48 hours",
    "You may be contacted for additional information or photos",
    "A final claim decision will be provided within 5-7 business days"
  ]
}
```

#### GET /api/coverage/details
**Description:** Return a summary of current user's active coverage
- **Auth:** Requires valid JWT token
- **Response:** Detailed coverage information

**Example Response:**
```json
{
  "policyNumber": "INS-123456",
  "policyType": "Auto Insurance",
  "effectiveDate": "2024-01-01",
  "expirationDate": "2025-01-01",
  "status": "Active",
  "coverage": {
    "liability": {
      "bodilyInjury": "$100,000 per person / $300,000 per accident",
      "propertyDamage": "$50,000 per accident"
    },
    "collision": {
      "deductible": "$500",
      "coverage": "Yes"
    },
    "comprehensive": {
      "deductible": "$500",
      "coverage": "Yes"
    }
  },
  "premium": {
    "monthly": "$125.00",
    "annual": "$1,500.00",
    "nextPayment": "2024-02-01"
  }
}
```

### 🚨 Vulnerable Endpoints (For Security Testing)

⚠️ **These endpoints are intentionally vulnerable for security testing purposes.**

#### GET /api/customers/me
**Vulnerability:** JWT Signature Bypass (API2:2023)
- Uses `jwt.decode()` instead of `jwt.verify()`
- Does not validate JWT signature
- **Test:** Modify JWT payload to change role to 'admin'

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Customer profile retrieved successfully",
  "customer": {
    "username": "admin1",
    "role": "admin",
    "profileType": "Premium Customer",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "accountStatus": "Active"
  }
}
```

#### GET /api/accounts/overview
**Vulnerability:** Expired Token Acceptance (API2:2023)
- Uses `ignoreExpiration: true` in JWT verification
- **Test:** Use expired JWT token - should still work

**Headers:**
```
Authorization: Bearer <expired_jwt_token>
```

**Response:**
```json
{
  "message": "Account overview retrieved successfully",
  "account": {
    "accountType": "Enterprise",
    "renewalDate": "2025-12-01",
    "balance": 2500.00,
    "lastPayment": "2024-01-15",
    "nextBilling": "2024-02-15",
    "accountStatus": "Active",
    "customerSince": "2022-03-15"
  }
}
```

#### GET /api/policies/mine
**Vulnerability:** Missing Authentication (API1:2023)
- No JWT or middleware required
- Returns sensitive PII data without authentication
- **Test:** Access without any token

#### GET /api/admin/stats
**Vulnerability:** Unauthenticated Admin Access (API5:2023)
- No JWT or middleware required
- Returns sensitive admin statistics without authentication
- **Pure API vulnerability:** No UI access, must be discovered by attacker
- **Test:** Access without any token

#### GET /api/admin/settings
**Vulnerability:** Privilege Escalation (API5:2023)
- Requires valid JWT but has weak role validation
- Accepts any valid token regardless of user role
- **Test:** Access with standard user token

**Response:**
```json
{
  "policyNumber": "INS-123456",
  "coverage": "Comprehensive",
  "premium": "$500",
  "expires": "2026-12-01",
  "type": "Auto",
  "status": "Active",
  "holderName": "John A. Smith",
  "insuredAmount": 500000,
  "effectiveDate": "2024-01-01",
  "applicationDate": "2023-12-15",
  "dateOfBirth": "1985-03-15",
  "ssn": "123-45-6789",
  "driversLicense": "CA123456789",
  "email": "john.smith@example.com",
  "phone": "+1-555-123-4567",
  "address": "123 Main Street, Anytown, CA 90210",
  "emergencyContact": {
    "name": "Jane Smith",
    "relationship": "Spouse",
    "phone": "+1-555-987-6543"
  }
}
```

**Response:**
```json
{
  "totalPolicies": 4520,
  "activeClaims": 134,
  "totalRevenue": "$2.1M",
  "pendingApprovals": 23,
  "systemHealth": "Excellent",
  "lastBackup": "2024-01-15T10:30:00Z",
  "databaseSize": "1.2GB",
  "activeUsers": 892,
  "failedLogins": 12,
  "securityAlerts": 3
}
```

#### POST /api/support/contact
**Vulnerability:** Verbose Error Disclosure (API8:2023)
- Exposes detailed error messages including stack traces
- Reveals internal file paths and database errors
- **Test:** Submit invalid data to trigger errors

#### POST /api/documents/preview
**Vulnerability:** SSRF via Document Preview (API7:2023)
- Makes HTTP requests to hardcoded URL without validation
- No domain or protocol validation performed
- Vulnerable to SSRF attacks via direct API calls
- **Test:** Modify backend to accept configurable URLs

#### PATCH /api/admin/settings
**Vulnerability:** Mass Assignment (API6:2023)
- Admin-only endpoint accessible to standard users (missing role check)
- Accepts all fields from request body without validation
- Allows privilege escalation through injected fields
- **Pure API vulnerability:** No UI access for standard users
- **Test:** Send request with `isAdmin: true` or `role: "admin"`

#### GET /api/admin/reports
**Vulnerability:** HTTP Method Bypass (API5:2023)
- GET method properly checks admin role (returns 403 for standard users)
- DELETE method does NOT check role (vulnerable to method bypass)
- **Test:** Standard users get 403 on GET, but can use DELETE method

#### GET /api/policies/search
**Vulnerability:** Excessive Record Retrieval (API4:2023)
- No maximum limit enforced on per_page parameter
- Allows retrieval of thousands of records by tampering with per_page
- **Test:** Send request with per_page=1000 to retrieve excessive records

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Test message"
}
```

**Error Response Example:**
```json
{
  "error": "Database connection failed",
  "code": "DB_CONNECTION_ERROR",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req-1705312200000",
  "stackTrace": "Error: Database connection failed\n    at Connection.connect (/app/node_modules/pg/lib/connection.js:127:15)\n    at Pool.connect (/app/node_modules/pg/lib/pool.js:45:12)",
  "file": "/app/database/postgresql.js",
  "line": 127,
  "databaseError": "ERROR: connection to server at \"db-insurance-prod.company.com\" (10.0.0.15), port 5432 failed: FATAL: password authentication failed for user \"insurance_user\""
}
```

#### GET /api/admin/settings
**Vulnerability:** Privilege Escalation (API5:2023)
- Requires valid JWT but has weak role validation
- Accepts any valid token regardless of user role
- **Test:** Access with standard user token

**Response:**
```json
{
  "maintenanceMode": false,
  "version": "v3.2.1",
  "allowedIPs": ["127.0.0.1", "192.168.1.0/24", "10.0.0.0/8"],
  "databaseConfig": {
    "host": "db-insurance-prod.company.com",
    "port": 5432,
    "name": "insurance_prod"
  },
  "securitySettings": {
    "maxLoginAttempts": 5,
    "sessionTimeout": 3600,
    "requireMFA": false
  },
  "backupSettings": {
    "frequency": "daily",
    "retention": "30 days",
    "location": "/backups/prod"
  }
}
```

## 👥 Available Users

### Admin Users
- **admin1** / adminpass
- **admin2** / admin123
- **admin.user** / admin@insurance

### Regular Users
- **user1** / userpass
- **user2** / user123
- **john.smith** / password123
- **sarah.johnson** / sarah2024
- **mike.davis** / mike123
- **emily.wilson** / emily2024

## 🔐 Security Features

### JWT Token Structure
```json
{
  "username": "admin1",
  "role": "admin",
  "iat": 1705312200,
  "exp": 1705313100
}
```

### Authentication Flow
1. User submits credentials via `/api/auth/login`
2. Server validates against static user list
3. JWT token generated with user role
4. Token returned to client
5. Client includes token in Authorization header for protected endpoints

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Authentication failed",
  "message": "Invalid username or password"
}
```

#### 403 Forbidden
```json
{
  "error": "Access denied",
  "message": "Admin role required to view users"
}
```

#### 401 Token Expired
```json
{
  "error": "Token expired",
  "message": "JWT token has expired",
  "expiredAt": "2024-01-15T10:45:00.000Z"
}
```

## 🧪 Testing

### Using curl

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin1", "password": "adminpass"}'
```

#### Get Profile
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get Users (Admin Only)
```bash
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer <admin_jwt_token>"
```

### Testing Vulnerable Endpoints

#### JWT Signature Bypass
```bash
# Get a valid token first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "userpass"}'

# Use the token (or modify it to change role to admin)
curl -X GET http://localhost:3001/api/customers/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Expired Token Acceptance
```bash
# Use an expired token - should still work
curl -X GET http://localhost:3001/api/accounts/overview \
  -H "Authorization: Bearer <expired_jwt_token>"
```

#### Missing Authentication (No Token Required)
```bash
# Access sensitive PII without any authentication
curl -X GET http://localhost:3001/api/policies/mine

# Access admin statistics without any authentication
curl -X GET http://localhost:3001/api/admin/stats
```

#### Privilege Escalation (Weak Role Validation)
```bash
# Access admin settings with standard user token
# Note: This is a pure API vulnerability - no UI access provided
curl -X GET http://localhost:3001/api/admin/settings \
  -H "Authorization: Bearer <standard_user_jwt_token>"
```

#### Verbose Error Disclosure
```bash
# Test missing field error
curl -X POST http://localhost:3001/api/support/contact \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "message": "Test"}'

# Test database error
curl -X POST http://localhost:3001/api/support/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "test@error.com", "message": "Test"}'

# Test SQL injection error
curl -X POST http://localhost:3001/api/support/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "test@example.com", "message": "'\'' OR '\''1'\''='\''1"}'
```

#### SSRF via Document Preview
```bash
# Normal request (UI sends this)
curl -X POST http://localhost:3001/api/documents/preview \
  -H "Content-Type: application/json" \
  -d '{}'

# SSRF attack (requires backend modification to accept configurable URLs)
# The vulnerability is that the backend makes requests to hardcoded URLs without validation
```

#### Mass Assignment
```bash
# Normal request (UI sends this)
curl -X PATCH http://localhost:3001/api/admin/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "notifications": true}'

# Mass assignment attack (attacker discovers and exploits)
curl -X PATCH http://localhost:3001/api/admin/settings \
  -H "Authorization: Bearer <standard_user_token>" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "notifications": true, "isAdmin": true, "role": "admin"}'
```

#### HTTP Method Bypass
```bash
# Standard user GET request (should be blocked)
curl -X GET http://localhost:3001/api/admin/reports \
  -H "Authorization: Bearer <standard_user_token>"

# Standard user DELETE request (vulnerable - should be blocked but isn't)
curl -X DELETE http://localhost:3001/api/admin/reports \
  -H "Authorization: Bearer <standard_user_token>"

# Admin user GET request (should work)
curl -X GET http://localhost:3001/api/admin/reports \
  -H "Authorization: Bearer <admin_token>"
```

#### Secure Endpoints
```bash
# Get policy categories (no auth required)
curl "http://localhost:3001/api/policies/categories"

# Get user notifications (auth required)
curl -X GET http://localhost:3001/api/user/notifications \
  -H "Authorization: Bearer <your_jwt_token>"

# Get coverage details (auth required)
curl -X GET http://localhost:3001/api/coverage/details \
  -H "Authorization: Bearer <your_jwt_token>"

# Submit claim estimate (auth required)
curl -X POST http://localhost:3001/api/claims/estimate \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"policyId": "INS-123456", "incidentType": "vehicle", "estimatedDamage": 3000}'
```

#### Excessive Record Retrieval
```bash
# Normal search (UI behavior)
curl "http://localhost:3001/api/policies/search?query=john&page=1&per_page=10"

# Vulnerable search (attacker behavior)
curl "http://localhost:3001/api/policies/search?query=&page=1&per_page=1000"

# Extreme record retrieval
curl "http://localhost:3001/api/policies/search?query=&page=1&per_page=1500"
```

#### Weak Password Registration
```bash
# Test weak password acceptance
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123"}'

# Test more weak passwords
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser2", "password": "password"}'

curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser3", "password": "a"}'
```

#### Automated Vulnerability Testing
Run the comprehensive vulnerability test:
```bash
node test-vulnerabilities.js
```

Run the weak password vulnerability test:
```bash
node test-weak-passwords.js
```

### Using Postman

1. **Login Request:**
   - Method: POST
   - URL: `http://localhost:3001/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body: Raw JSON with username and password

2. **Protected Requests:**
   - Add header: `Authorization: Bearer <token_from_login>`

## 🔧 Development

### File Structure
```
backend/
├── data/
│   └── users.json          # Static user data
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── secure.js           # ✅ Secure endpoints for realistic functionality
│   └── vulnerable.js       # 🚨 Vulnerable endpoints for security testing
├── server.js               # Main server file
├── test-api.js             # API testing script
├── test-secure-endpoints.js # ✅ Secure endpoints testing script
├── test-vulnerabilities.js # 🚨 Vulnerability testing script
├── test-weak-passwords.js  # 🚨 Weak password vulnerability testing script
├── test-http-method-bypass.js # 🚨 HTTP method bypass testing script
├── test-excessive-records.js  # 🚨 Excessive record retrieval testing script
├── decode-jwt.js           # JWT token decoder utility
├── package.json
└── README.md
```

### Adding New Users
Edit `data/users.json` to add new users:
```json
{
  "username": "newuser",
  "password": "newpass",
  "role": "user"
}
```

### Modifying JWT Settings
Update `middleware/auth.js`:
- Change `JWT_SECRET` for different secret
- Modify token expiration in `routes/auth.js`

## 🚨 Security Notes

⚠️ **This is a testing environment with intentional security weaknesses:**

- JWT secret is hardcoded (should be in environment variables)
- Passwords are stored in plain text (should be hashed)
- No rate limiting implemented
- No input sanitization for security testing
- Static user list (no database)

## 🔗 Frontend Integration

The backend is configured to work with the React frontend running on `http://localhost:5173`.

CORS is enabled for the frontend domain to allow cross-origin requests.

## 📝 License

This project is for educational and security testing purposes only. 