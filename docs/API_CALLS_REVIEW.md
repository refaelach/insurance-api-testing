# API Calls Review - Frontend to Backend Communication

## ✅ **Review Summary**

All API calls in the UI code have been reviewed and are working correctly. The frontend is properly configured to communicate with the backend using the `getApiUrl` utility function, which supports both development and Docker environments.

## 🔧 **API Configuration**

### **API Utility (`src/utils/api.js`)**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
```

**Environment Support:**
- **Development**: `http://localhost:3001`
- **Docker**: `http://backend:3001` (via `VITE_API_BASE_URL`)

## 📋 **API Calls by Page/Component**

### **1. Authentication (`src/utils/auth.js`)**
✅ **All calls working correctly**

| Function | Endpoint | Method | Status |
|----------|----------|--------|--------|
| `loginUser` | `/api/auth/login` | POST | ✅ Working |
| `registerUser` | `/api/auth/register` | POST | ✅ Working |
| `getUserProfile` | `/api/auth/profile` | GET | ✅ Working |
| `validateToken` | `/api/auth/profile` | GET | ✅ Working |

### **2. Login Page (`src/pages/Login.jsx`)**
✅ **Using `loginUser` function correctly**

### **3. Register Page (`src/pages/Register.jsx`)**
✅ **Using `registerUser` function correctly**

### **4. Customer Profile (`src/pages/CustomerProfile.jsx`)**
✅ **API call working correctly**

```javascript
const response = await fetch(getApiUrl('api/customers/me'), {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **5. Account Overview (`src/pages/AccountOverview.jsx`)**
✅ **API call working correctly**

```javascript
const response = await fetch(getApiUrl('api/accounts/overview'), {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **6. Vulnerable Policy Details (`src/pages/VulnerablePolicyDetails.jsx`)**
✅ **Fixed syntax error - now working correctly**

```javascript
// 🚨 VULNERABLE: No authentication required
const response = await fetch(getApiUrl('api/policies/mine'), {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

**Fixed Issues:**
- ❌ **Syntax Error**: `${getApiUrl('api/policies/mine')},` → ✅ `getApiUrl('api/policies/mine')`
- ❌ **Missing Import**: Added `import { getApiUrl } from '../utils/api.js';`

### **7. Search Page (`src/pages/Search.jsx`)**
✅ **API call working correctly**

```javascript
const response = await fetch(`${getApiUrl('api/policies/search')}?query=${encodeURIComponent(query)}&page=1`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});
```

### **8. Contact Support (`src/pages/ContactSupport.jsx`)**
✅ **Fixed missing import - now working correctly**

```javascript
// 🚨 VULNERABLE: Verbose error disclosure
const response = await fetch(getApiUrl('api/support/contact'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
```

**Fixed Issues:**
- ❌ **Missing Import**: Added `import { getApiUrl } from '../utils/api.js';`

### **9. Document Preview (`src/pages/DocumentPreview.jsx`)**
✅ **Fixed missing import - now working correctly**

```javascript
// 🚨 VULNERABLE: SSRF via hardcoded URL
const response = await fetch(getApiUrl('api/documents/preview'), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({})
});
```

**Fixed Issues:**
- ❌ **Missing Import**: Added `import { getApiUrl } from '../utils/api.js';`

### **10. User Preferences (`src/pages/UserPreferences.jsx`)**
✅ **API call working correctly**

```javascript
// 🚨 VULNERABLE: Mass assignment
const response = await fetch(getApiUrl('api/admin/settings'), {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(preferences)
});
```

### **11. Admin Reports (`src/pages/AdminReports.jsx`)**
✅ **API call working correctly**

```javascript
const response = await fetch(getApiUrl('api/admin/reports'), {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});
```

### **12. Profile Page (`src/pages/Profile.jsx`)**
✅ **Using `getUserProfile` function correctly**

### **13. Protected Route (`src/components/ProtectedRoute.jsx`)**
✅ **Using `validateToken` function correctly**

### **14. Navigation (`src/components/Navigation.jsx`)**
✅ **Using auth functions correctly**

## 🧪 **Backend API Testing Results**

### **Authentication Endpoints**
- ✅ `POST /api/auth/login` - Returns JWT token
- ✅ `POST /api/auth/register` - Accepts weak passwords
- ✅ `GET /api/auth/profile` - Returns user profile

### **Vulnerable Endpoints**
- ✅ `GET /api/customers/me` - JWT bypass vulnerability
- ✅ `GET /api/accounts/overview` - Expired token acceptance
- ✅ `GET /api/policies/mine` - No authentication required
- ✅ `GET /api/policies/search` - Excessive record retrieval
- ✅ `POST /api/documents/preview` - SSRF vulnerability
- ✅ `POST /api/support/contact` - Verbose error disclosure
- ✅ `PATCH /api/admin/settings` - Mass assignment vulnerability
- ✅ `GET /api/admin/reports` - HTTP method bypass

### **Secure Endpoints**
- ✅ `GET /api/policies/categories` - No auth required
- ✅ `GET /api/user/notifications` - Requires JWT
- ✅ `POST /api/claims/estimate` - Requires JWT
- ✅ `GET /api/coverage/details` - Requires JWT

## 🔍 **Issues Found and Fixed**

### **1. Syntax Error in VulnerablePolicyDetails.jsx**
- **Issue**: Malformed fetch URL with extra comma
- **Fix**: Corrected to `getApiUrl('api/policies/mine')`
- **Status**: ✅ Fixed

### **2. Missing Imports**
- **Issue**: Several pages missing `getApiUrl` import
- **Files Fixed**:
  - `src/pages/VulnerablePolicyDetails.jsx`
  - `src/pages/ContactSupport.jsx`
  - `src/pages/DocumentPreview.jsx`
- **Status**: ✅ Fixed

## 🌐 **CORS Configuration**

### **Backend CORS Setup**
```javascript
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:5173', // Development
      'http://localhost:5174', // Docker
      'http://frontend:5174',  // Docker internal
      'http://127.0.0.1:5173', // Alternative
      'http://127.0.0.1:5174'  // Alternative Docker
    ];
```

### **Docker Environment Variables**
```yaml
environment:
  - CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://frontend:5174
```

## ✅ **Verification Checklist**

- [x] All API calls use `getApiUrl` utility function
- [x] Authentication endpoints working correctly
- [x] Vulnerable endpoints accessible and functional
- [x] Secure endpoints properly protected
- [x] CORS configuration working for Docker environment
- [x] Frontend serving on port 5174
- [x] Backend serving on port 3001
- [x] All syntax errors fixed
- [x] All missing imports added
- [x] Error handling implemented
- [x] Loading states implemented

## 🚀 **Deployment Status**

### **Docker Environment**
- ✅ Frontend container running on port 5174
- ✅ Backend container running on port 3001
- ✅ Internal Docker networking working
- ✅ CORS configuration working
- ✅ Environment variables configured

### **API Communication**
- ✅ Frontend can reach backend via internal DNS
- ✅ All endpoints responding correctly
- ✅ Authentication flow working
- ✅ Vulnerable endpoints accessible
- ✅ Error handling working

## 📝 **Recommendations**

1. **Monitor API Calls**: Consider adding logging for API calls in production
2. **Error Handling**: All pages have proper error handling
3. **Loading States**: All pages have loading states implemented
4. **Security**: Vulnerable endpoints are intentionally exposed for testing
5. **Documentation**: All API calls are properly documented

## 🎯 **Conclusion**

All API calls in the UI code are working correctly. The frontend is properly configured to communicate with the backend in both development and Docker environments. All syntax errors have been fixed, and missing imports have been added. The application is ready for security testing with all vulnerable endpoints accessible and functional. 