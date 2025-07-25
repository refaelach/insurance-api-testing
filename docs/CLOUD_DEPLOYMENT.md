# Cloud Deployment Guide

This guide covers deploying the Insurance API Security Testing App to various cloud platforms.

## 🚀 Quick Start

### Local Docker Deployment
```bash
# Clone the repository
git clone <repository-url>
cd api-testing-project

# Deploy using the provided script
./deploy.sh

# Or manually with Docker Compose
docker-compose up --build -d
```

## ☁️ Cloud Platform Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
```bash
# Launch Ubuntu 22.04 LTS instance
# Instance type: t3.medium or larger
# Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (API), 5174 (Frontend)
```

#### 2. Install Docker and Docker Compose
```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Deploy Application
```bash
# Clone repository
git clone <repository-url>
cd api-testing-project

# Set environment variables
export JWT_SECRET="your-super-secure-jwt-secret-key-2024"

# Deploy
./deploy.sh
```

#### 4. Configure Domain (Optional)
```bash
# Install Nginx for reverse proxy
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/insurance-app

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5174;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/insurance-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Google Cloud Platform (GCP) Deployment

#### 1. Create Compute Engine Instance
```bash
# Create instance with Docker support
gcloud compute instances create insurance-app \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server \
  --metadata=startup-script='#! /bin/bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose'
```

#### 2. Configure Firewall
```bash
# Allow HTTP and HTTPS traffic
gcloud compute firewall-rules create allow-http \
  --allow tcp:80,tcp:443,tcp:3001,tcp:5174 \
  --target-tags=http-server \
  --description="Allow HTTP traffic"
```

#### 3. Deploy Application
```bash
# SSH into instance
gcloud compute ssh insurance-app --zone=us-central1-a

# Clone and deploy
git clone <repository-url>
cd api-testing-project
export JWT_SECRET="your-super-secure-jwt-secret-key-2024"
./deploy.sh
```

### Azure Deployment

#### 1. Create Azure Container Instances
```bash
# Login to Azure
az login

# Create resource group
az group create --name insurance-app-rg --location eastus

# Create container registry (optional)
az acr create --resource-group insurance-app-rg --name insuranceappacr --sku Basic

# Build and push images
docker-compose build
az acr login --name insuranceappacr
docker tag insurance-api-testing-project_frontend insuranceappacr.azurecr.io/frontend:latest
docker tag insurance-api-testing-project_backend insuranceappacr.azurecr.io/backend:latest
docker push insuranceappacr.azurecr.io/frontend:latest
docker push insuranceappacr.azurecr.io/backend:latest
```

#### 2. Deploy with Azure Container Instances
```bash
# Deploy backend
az container create \
  --resource-group insurance-app-rg \
  --name backend \
  --image insuranceappacr.azurecr.io/backend:latest \
  --ports 3001 \
  --environment-variables JWT_SECRET="your-super-secure-jwt-secret-key-2024" \
  --dns-name-label insurance-backend

# Deploy frontend
az container create \
  --resource-group insurance-app-rg \
  --name frontend \
  --image insuranceappacr.azurecr.io/frontend:latest \
  --ports 5174 \
  --environment-variables VITE_API_BASE_URL="http://insurance-backend.eastus.azurecontainer.io:3001"
```

## 🔧 Environment Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret | `your-super-secret-jwt-key-for-security-testing-2024` | No |
| `VITE_API_BASE_URL` | Backend API URL | `http://backend:3001` | No |
| `PORT` | Backend port | `3001` | No |
| `NODE_ENV` | Node environment | `production` | No |

### Production Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret
2. **HTTPS**: Always use HTTPS in production
3. **Firewall**: Restrict access to necessary ports only
4. **Monitoring**: Set up logging and monitoring
5. **Backups**: Regular backups of user data
6. **Updates**: Keep Docker images and dependencies updated

## 📊 Monitoring and Logs

### View Application Logs
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# View logs with timestamps
docker-compose logs -f --timestamps
```

### Health Checks
```bash
# Check backend health
curl http://your-domain.com/api/health

# Check frontend
curl http://your-domain.com

# Check Docker containers
docker-compose ps
```

## 🔄 Updates and Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build -d

# Or use the deployment script
./deploy.sh
```

### Backup and Restore
```bash
# Backup user data
docker-compose exec backend tar -czf /tmp/backup.tar.gz /app/data

# Copy backup from container
docker cp insurance-api-testing-project_backend_1:/tmp/backup.tar.gz ./backup.tar.gz

# Restore (if needed)
docker-compose exec backend tar -xzf /tmp/backup.tar.gz -C /
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3001
   
   # Kill process or change port in docker-compose.yml
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs backend
   
   # Check container status
   docker-compose ps
   ```

3. **Frontend Can't Connect to Backend**
   ```bash
   # Verify backend is running
   curl http://localhost:3001/api/health
   
   # Check network connectivity
   docker-compose exec frontend ping backend
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x deploy.sh
   ```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Check Docker and Docker Compose versions

## ⚠️ Security Disclaimer

This application is designed for **security testing and training purposes only**. It contains intentional vulnerabilities and should **NOT** be used in production environments or exposed to the public internet without proper security measures. 