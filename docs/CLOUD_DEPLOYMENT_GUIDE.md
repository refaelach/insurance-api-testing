# Cloud Deployment Guide

## 🎯 Overview

This guide provides comprehensive instructions for deploying the Insurance API Testing Project to various cloud providers with custom domain support.

## 📋 Prerequisites

### Required Tools
- **Docker & Docker Compose**: For containerization
- **Git**: For version control
- **Domain Name**: Registered domain (Namecheap, GoDaddy, Route53, etc.)
- **Cloud Account**: AWS, Azure, Google Cloud, or DigitalOcean account

### Optional Tools
- **Cloud CLI Tools**: AWS CLI, Azure CLI, Google Cloud CLI, DigitalOcean CLI
- **SSL Certificate**: Let's Encrypt (free) or cloud provider certificates

## 🚀 Quick Start

### 1. Choose Your Cloud Provider

| Provider | Difficulty | Cost | Features |
|----------|------------|------|----------|
| **DigitalOcean** | Easy | $5-20/month | Simple, developer-friendly |
| **AWS** | Medium | $10-50/month | Enterprise features, complex |
| **Azure** | Medium | $10-50/month | Microsoft ecosystem |
| **Google Cloud** | Medium | $10-50/month | Kubernetes native |

### 2. Deploy with One Command

```bash
# DigitalOcean (Recommended for beginners)
./scripts/deploy-digitalocean.sh yourdomain.com

# AWS
./scripts/deploy-aws.sh yourdomain.com

# Azure  
./scripts/deploy-azure.sh yourdomain.com
```

## 🌐 Cloud Provider Details

### DigitalOcean Deployment

**Pros:**
- Simple pricing ($5-20/month)
- Developer-friendly interface
- Fast deployment
- Good documentation

**Steps:**
1. Create DigitalOcean account
2. Install `doctl` CLI tool
3. Run deployment script
4. Configure DNS
5. Set up SSL certificate

**Cost:** ~$5-20/month

### AWS Deployment

**Pros:**
- Enterprise features
- Global infrastructure
- Advanced monitoring
- Auto-scaling

**Options:**
- **ECS Fargate**: Serverless containers
- **EC2**: Traditional VMs
- **App Runner**: Fully managed

**Steps:**
1. Create AWS account
2. Install AWS CLI
3. Configure credentials
4. Run deployment script
5. Set up Application Load Balancer

**Cost:** ~$10-50/month

### Azure Deployment

**Pros:**
- Microsoft ecosystem integration
- Enterprise features
- Good developer tools
- Hybrid cloud support

**Options:**
- **App Service**: Managed web apps
- **Container Instances**: Serverless containers
- **AKS**: Kubernetes service

**Steps:**
1. Create Azure account
2. Install Azure CLI
3. Login to Azure
4. Run deployment script
5. Configure custom domain

**Cost:** ~$10-50/month

### Google Cloud Deployment

**Pros:**
- Kubernetes native
- Advanced networking
- Global load balancing
- Machine learning integration

**Options:**
- **Cloud Run**: Serverless containers
- **Compute Engine**: VMs
- **GKE**: Kubernetes

**Steps:**
1. Create Google Cloud account
2. Install Google Cloud CLI
3. Set up project
4. Run deployment script
5. Configure domain

**Cost:** ~$10-50/month

## 🔧 Custom Domain Setup

### 1. DNS Configuration

**Point your domain to your cloud provider:**

```bash
# DigitalOcean
A Record: yourdomain.com → Your Droplet IP
CNAME: www.yourdomain.com → yourdomain.com

# AWS
A Record: yourdomain.com → Your Load Balancer IP
CNAME: www.yourdomain.com → yourdomain.com

# Azure
A Record: yourdomain.com → Your App Service IP
CNAME: www.yourdomain.com → yourdomain.com
```

### 2. SSL Certificate Setup

**Option A: Let's Encrypt (Free)**
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

**Option B: Cloud Provider Certificates**
- **AWS**: Application Load Balancer with ACM
- **Azure**: App Service with built-in SSL
- **Google Cloud**: Cloud Load Balancer with managed certificates

## 🔒 Security Configuration

### Environment Variables
```bash
# Production environment variables
export JWT_SECRET=your-super-secure-production-secret
export NODE_ENV=production
export CORS_ORIGINS=https://yourdomain.com
```

### Firewall Rules
```bash
# Allow only necessary ports
# HTTP: 80, HTTPS: 443, SSH: 22 (if applicable)
```

### Security Headers
The NGINX configuration includes:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Content-Security-Policy

## 📊 Monitoring & Logging

### Health Checks
```bash
# Application health
curl https://yourdomain.com/api/health

# Container health
docker ps
docker logs container-name
```

### Cloud Provider Monitoring
- **AWS**: CloudWatch
- **Azure**: Application Insights
- **Google Cloud**: Cloud Monitoring
- **DigitalOcean**: Built-in monitoring

## 📈 Scaling Options

### Horizontal Scaling
- **Load Balancers**: Distribute traffic
- **Auto-scaling**: Scale based on metrics
- **Container Orchestration**: Kubernetes, Docker Swarm

### Vertical Scaling
- **Resource Limits**: Increase CPU/memory
- **Database Scaling**: Managed databases

## 🛠️ Troubleshooting

### Common Issues

**1. DNS Not Propagated**
```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com
```

**2. SSL Certificate Issues**
```bash
# Check certificate status
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

**3. Container Not Starting**
```bash
# Check container logs
docker-compose logs -f
docker logs container-name
```

**4. Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :443
```

### Debug Commands

```bash
# Check application status
curl -I https://yourdomain.com

# Test API endpoints
curl https://yourdomain.com/api/health

# Check SSL certificate
curl -vI https://yourdomain.com

# Monitor logs
docker-compose logs -f nginx
docker-compose logs -f backend
```

## 💰 Cost Optimization

### Resource Sizing
- **Development**: Small instances (1 vCPU, 1GB RAM)
- **Production**: Medium instances (2 vCPU, 4GB RAM)
- **High Traffic**: Large instances (4+ vCPU, 8GB+ RAM)

### Cost-Saving Tips
1. Use spot instances for non-critical workloads
2. Enable auto-scaling to scale down during low traffic
3. Use reserved instances for predictable workloads
4. Monitor and optimize resource usage

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Cloud
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to DigitalOcean
        run: |
          ./scripts/deploy-digitalocean.sh ${{ secrets.DOMAIN }}
```

## 📚 Additional Resources

### Documentation
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)

### Security Best Practices
- [OWASP Security Guidelines](https://owasp.org/)
- [Cloud Security Alliance](https://cloudsecurityalliance.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Cost Calculators
- [AWS Pricing Calculator](https://calculator.aws/)
- [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- [DigitalOcean Pricing](https://www.digitalocean.com/pricing)

## 🎉 Success Checklist

- [ ] Application deployed successfully
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] DNS propagated
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Logs accessible
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Backup strategy in place

## 🆘 Support

For issues with cloud deployment:
1. Check the troubleshooting section
2. Review cloud provider documentation
3. Check application logs
4. Verify network connectivity
5. Contact cloud provider support

---

**Note:** This project is designed for educational and security testing purposes. For production use, ensure proper security measures are implemented. 