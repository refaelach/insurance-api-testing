# Insurance API Security Testing App

A Dockerized demo application for security testing of common API vulnerabilities, including OWASP API Security Top 10. Built with React, Node.js, and designed for integration with F5 XC Load Balancer.

## 🎯 Purpose

This project provides a **realistic insurance application** with **intentional vulnerabilities** for:
- API security testing and training
- Load balancer configuration testing (F5 XC, etc.)
- Security tool evaluation
- Penetration testing practice

## 🔐 Features

### Authentication & Security
- **JWT-based Authentication**: Real backend authentication with token management
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Role-based Access**: Admin and regular user roles
- **Token Management**: Secure JWT token storage and validation

### Vulnerable Endpoints (For Testing)
- **BOLA (Broken Object Level Authorization)**: `/api/customers/me` - JWT bypass
- **SSRF (Server-Side Request Forgery)**: `/api/documents/preview` - URL fetching
- **Verbose Error Messages**: Detailed error responses for testing
- **Weak Authentication**: Multiple weak password accounts
- **Missing Rate Limiting**: Endpoints without rate limiting
- **Insecure Direct Object References**: Direct ID access

### Realistic Application
- **Insurance Portal**: Complete frontend with policies, claims, documents
- **Admin Panel**: Administrative functions and reporting
- **User Management**: Registration, profiles, preferences
- **Document Management**: File uploads and previews

### Production-like Architecture
- **NGINX Reverse Proxy**: Single entry point (port 80)
- **Docker Containerization**: Easy deployment and scaling
- **Traffic Simulation**: Automated realistic API traffic
- **Multi-cloud Ready**: Deployment scripts for major cloud providers

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   NGINX         │    │   Services      │
│   Browser       │───▶│   Reverse Proxy │───▶│   Frontend      │
│                 │    │   Port 80       │    │   Backend       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
/
├── frontend/             # React frontend (Vite)
├── backend/              # Express API with vulnerabilities
├── nginx/                # NGINX reverse proxy config
├── scripts/              # Traffic simulation & utilities
├── docs/                 # Documentation
├── aws/                  # AWS deployment configs
├── azure/                # Azure deployment configs
├── gcp/                  # Google Cloud deployment configs
├── digitalocean/         # DigitalOcean deployment configs
├── docker-compose.yml    # Development environment
├── docker-compose.prod.yml # Production environment
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone and Deploy
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/insurance-api-testing.git
cd insurance-api-testing

# Build and start all services
docker-compose up --build
```

### 2. Access the Application
- **Frontend**: http://localhost
- **API Health Check**: http://localhost/api/health
- **Admin Login**: `admin1` / `adminpass`
- **User Login**: `user1` / `userpass`

### 3. Test Vulnerabilities
- **BOLA**: Try accessing `/api/customers/me` without proper JWT
- **SSRF**: Use `/api/documents/preview` with external URLs
- **Weak Auth**: Try common passwords on weak accounts
- **Verbose Errors**: Trigger errors to see detailed responses

## 🔧 Configuration

### Environment Variables
Create a `.env` file for customization:
```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-security-testing-2024

# Traffic Simulation
TRAFFIC_BASE_URL=http://nginx
SIMULATION_DURATION=5
CONCURRENT_USERS=8
MAX_REQUESTS_PER_USER=30

# Backend Configuration
PORT=3001
NODE_ENV=production
CORS_ORIGINS=http://localhost,http://localhost:80,http://nginx:80
```

### Traffic Simulation
The app includes automated traffic simulation for API discovery:
- **Frequency**: Every 2 minutes
- **Duration**: 5 minutes per run
- **Requests**: ~2,640 requests per simulation
- **Users**: 8 concurrent users with realistic authentication

## 🐳 Docker Commands

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build frontend
```

## ☁️ Cloud Deployment

### Quick Deploy Scripts
```bash
# AWS ECS
./scripts/deploy-aws.sh

# Azure Container Instances
./scripts/deploy-azure.sh

# Google Cloud Run
./scripts/deploy-gcp.sh

# DigitalOcean App Platform
./scripts/deploy-digitalocean.sh
```

### Manual Deployment
See `docs/CLOUD_DEPLOYMENT_GUIDE.md` for detailed instructions on:
- AWS ECS/EC2 deployment
- Azure Container Instances/App Service
- Google Cloud Run/Compute Engine
- DigitalOcean App Platform/Droplet
- Custom domain configuration
- SSL certificate setup

## 🧪 Security Testing

### Available Vulnerabilities
1. **Authentication Bypass**: Weak JWT validation
2. **Authorization Flaws**: Missing role checks
3. **Input Validation**: SSRF in document preview
4. **Error Handling**: Verbose error messages
5. **Rate Limiting**: Missing on vulnerable endpoints
6. **Data Exposure**: Sensitive data in responses

### Testing Tools Integration
- **F5 XC Load Balancer**: API discovery and monitoring
- **OWASP ZAP**: Automated vulnerability scanning
- **Burp Suite**: Manual security testing
- **Postman**: API testing and automation

## 📚 Documentation

- **API Documentation**: See `docs/API_CALLS_REVIEW.md`
- **Cloud Deployment**: See `docs/CLOUD_DEPLOYMENT_GUIDE.md`
- **CORS Configuration**: See `docs/CORS_TROUBLESHOOTING.md`
- **Docker Setup**: See `docs/DOCKER_SUMMARY.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Security Notice

**This application contains intentional vulnerabilities for security testing purposes. Do not deploy to production environments or expose to the public internet without proper security measures.**

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `docs/` directory
- **Security**: Report security issues privately

---

**Built for security testing and education purposes** 🔒
