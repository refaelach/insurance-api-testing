# CORS Troubleshooting Guide

## 🚨 CORS Error Resolution

### Problem
The frontend (running on port 5174) cannot communicate with the backend (running on port 3001) due to CORS (Cross-Origin Resource Sharing) restrictions.

### Solution Implemented

#### 1. Updated Backend CORS Configuration
The backend now supports multiple origins:

```javascript
// backend/server.js
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : [
      'http://localhost:5173', // Development frontend URL
      'http://localhost:5174', // Docker frontend URL
      'http://frontend:5174',  // Docker internal frontend URL
      'http://127.0.0.1:5173', // Alternative localhost
      'http://127.0.0.1:5174'  // Alternative localhost for Docker
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### 2. Environment Variable Support
CORS origins can be configured via environment variables:

```bash
# In docker-compose.yml
environment:
  - CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://frontend:5174

# Or via command line
CORS_ORIGINS=http://localhost:5173,http://localhost:5174 docker-compose up
```

#### 3. Docker Compose Configuration
Both development and production configurations include CORS settings:

```yaml
# docker-compose.yml
backend:
  environment:
    - CORS_ORIGINS=http://localhost:5173,http://localhost:5174,http://frontend:5174

# docker-compose.prod.yml
backend:
  environment:
    - CORS_ORIGINS=${CORS_ORIGINS:-http://localhost:5173,http://localhost:5174,http://frontend:5174}
```

## 🔍 Testing CORS Configuration

### 1. Test Preflight Request
```bash
curl -X OPTIONS http://localhost:3001/api/auth/login \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With
```

### 2. Test Actual Request
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5174" \
  -d '{"username": "user1", "password": "userpass"}' \
  -v
```

**Expected Response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Credentials: true
Content-Type: application/json; charset=utf-8

{"message":"Login successful","token":"...","user":{"username":"user1","role":"user"},"expiresIn":"15m"}
```

## 🛠️ Troubleshooting Steps

### If CORS errors persist:

1. **Check Backend Logs**
   ```bash
   docker-compose logs backend
   ```
   Look for: `🌐 CORS Origins: http://localhost:5173, http://localhost:5174, http://frontend:5174`

2. **Verify Container Status**
   ```bash
   docker-compose ps
   ```
   Ensure both frontend and backend containers are running.

3. **Rebuild Backend**
   ```bash
   docker-compose down
   docker-compose build backend
   docker-compose up -d
   ```

4. **Check Environment Variables**
   ```bash
   docker-compose exec backend env | grep CORS
   ```

5. **Test Direct API Access**
   ```bash
   curl http://localhost:3001/api/health
   ```

### Common Issues and Solutions

#### Issue: "Access to fetch at 'http://localhost:3001/api/auth/login' from origin 'http://localhost:5174' has been blocked by CORS policy"

**Solution:** Ensure the backend CORS configuration includes `http://localhost:5174`

#### Issue: "Request header field Authorization is not allowed by Access-Control-Allow-Headers"

**Solution:** The backend now includes `Authorization` in the allowed headers.

#### Issue: "The request client is not a secure context and the resource is in more-restrictive private network"

**Solution:** This is a browser security feature. Use `http://localhost` instead of `http://127.0.0.1` or ensure both are in the CORS origins.

## 🌐 Cloud Deployment CORS

### For Cloud Deployments
When deploying to cloud platforms, update the CORS origins to include your domain:

```bash
# For production deployment
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com docker-compose up -d

# For staging
CORS_ORIGINS=https://staging.yourdomain.com docker-compose up -d
```

### AWS/GCP/Azure Considerations
- Use HTTPS URLs in production
- Include both www and non-www versions of your domain
- Consider using environment-specific CORS configurations

## ✅ Verification Checklist

- [ ] Backend logs show correct CORS origins
- [ ] Preflight OPTIONS requests return 204 with correct headers
- [ ] Actual API requests include CORS headers in response
- [ ] Frontend can successfully make API calls
- [ ] Login functionality works from frontend
- [ ] All API endpoints are accessible from frontend

## 📞 Support

If CORS issues persist after following this guide:

1. Check the browser's developer console for specific error messages
2. Verify the backend is running and accessible
3. Confirm the frontend is making requests to the correct backend URL
4. Check that the CORS origins include the exact frontend URL being used 