#!/bin/bash

# User Data Script for EC2 Instance
# This script runs when the EC2 instance starts up

# Update system
apt-get update
apt-get upgrade -y

# Install Docker
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/insurance-api-testing
cd /opt/insurance-api-testing

# Download application files (you'll need to upload these to S3 or use git)
# For now, we'll create a basic docker-compose file
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  nginx:
    image: yourusername/insurance-nginx:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DOMAIN=yourdomain.com
    restart: unless-stopped

  backend:
    image: yourusername/insurance-backend:latest
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-super-secure-production-secret
      - PORT=3001
      - CORS_ORIGINS=https://yourdomain.com
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Start the application
docker-compose -f docker-compose.prod.yml up -d

# Install certbot for SSL certificates
apt-get install -y certbot

# Create SSL renewal script
cat > /opt/renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
docker-compose -f /opt/insurance-api-testing/docker-compose.prod.yml restart nginx
EOF

chmod +x /opt/renew-ssl.sh

# Add SSL renewal to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /opt/renew-ssl.sh") | crontab -

echo "✅ EC2 instance setup complete!" 