#!/bin/bash

# DigitalOcean Deployment Script for Insurance API Testing Project
# Usage: ./scripts/deploy-digitalocean.sh yourdomain.com

set -e

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1
DROPLET_NAME="insurance-api-testing"
REGION=${2:-"nyc1"}
SIZE=${3:-"s-1vcpu-1gb"}

echo "🚀 Deploying Insurance API Testing Project to DigitalOcean"
echo "Domain: $DOMAIN"
echo "Droplet Name: $DROPLET_NAME"
echo "Region: $REGION"
echo "Size: $SIZE"

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ Error: DigitalOcean CLI (doctl) is not installed"
    echo "Please install doctl: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Authenticate with DigitalOcean
echo "🔐 Authenticating with DigitalOcean..."
doctl auth init

# Build and push Docker images to Docker Hub
echo "📦 Building and pushing Docker images..."

# Build images
docker-compose -f docker-compose.prod.yml build

# Tag images for Docker Hub
docker tag api-testing-project-frontend:latest yourusername/insurance-frontend:latest
docker tag api-testing-project-backend:latest yourusername/insurance-backend:latest
docker tag api-testing-project-nginx:latest yourusername/insurance-nginx:latest

# Push images
docker push yourusername/insurance-frontend:latest
docker push yourusername/insurance-backend:latest
docker push yourusername/insurance-nginx:latest

# Create droplet
echo "🖥️  Creating DigitalOcean droplet..."
DROPLET_ID=$(doctl compute droplet create $DROPLET_NAME \
  --size $SIZE \
  --image docker-20-04 \
  --region $REGION \
  --ssh-keys $(doctl compute ssh-key list --format ID --no-header | head -1) \
  --format ID --no-header)

echo "⏳ Waiting for droplet to be ready..."
sleep 30

# Get droplet IP
DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)

echo "🔧 Setting up droplet..."
# Wait for SSH to be available
until ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@$DROPLET_IP exit 2>/dev/null; do
    echo "⏳ Waiting for SSH to be available..."
    sleep 10
done

# Copy deployment files
echo "📁 Copying deployment files..."
scp -o StrictHostKeyChecking=no docker-compose.prod.yml root@$DROPLET_IP:/root/
scp -o StrictHostKeyChecking=no nginx/nginx.conf root@$DROPLET_IP:/root/

# Deploy application
echo "🚀 Deploying application..."
ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << 'EOF'
# Update system
apt-get update
apt-get upgrade -y

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create application directory
mkdir -p /opt/insurance-api-testing
cd /opt/insurance-api-testing

# Copy docker-compose file
cp /root/docker-compose.prod.yml .

# Update docker-compose with domain
sed -i "s/yourdomain.com/'"$DOMAIN"'/g" docker-compose.prod.yml

# Start application
docker-compose -f docker-compose.prod.yml up -d

# Install certbot for SSL
apt-get install -y certbot

# Create SSL renewal script
cat > /opt/renew-ssl.sh << 'SCRIPT_EOF'
#!/bin/bash
certbot renew --quiet
docker-compose -f /opt/insurance-api-testing/docker-compose.prod.yml restart nginx
SCRIPT_EOF

chmod +x /opt/renew-ssl.sh

# Add SSL renewal to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /opt/renew-ssl.sh") | crontab -

echo "✅ Application deployed successfully!"
EOF

echo "✅ DigitalOcean deployment complete!"
echo ""
echo "🌐 Droplet IP: $DROPLET_IP"
echo "🔧 Next steps:"
echo "1. Update your DNS to point $DOMAIN to $DROPLET_IP"
echo "2. SSH to the droplet: ssh root@$DROPLET_IP"
echo "3. Set up SSL certificate: certbot certonly --standalone -d $DOMAIN"
echo "4. Check application status: docker-compose ps"
echo "5. View logs: docker-compose logs -f" 