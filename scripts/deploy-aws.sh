#!/bin/bash

# AWS Deployment Script for Insurance API Testing Project
# Usage: ./scripts/deploy-aws.sh yourdomain.com

set -e

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1
REGION=${2:-"us-east-1"}

echo "🚀 Deploying Insurance API Testing Project to AWS"
echo "Domain: $DOMAIN"
echo "Region: $REGION"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI is not installed"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Build and push Docker images
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

# Update task definition with domain
echo "🔧 Updating task definition..."
sed -i.bak "s/yourdomain.com/$DOMAIN/g" aws/task-definition.json
sed -i.bak "s/yourusername/yourusername/g" aws/task-definition.json

# Create ECS cluster
echo "🏗️  Creating ECS cluster..."
aws ecs create-cluster --cluster-name insurance-api-testing --region $REGION || true

# Create log group
echo "📝 Creating CloudWatch log group..."
aws logs create-log-group --log-group-name /ecs/insurance-api-testing --region $REGION || true

# Register task definition
echo "📋 Registering task definition..."
aws ecs register-task-definition --cli-input-json file://aws/task-definition.json --region $REGION

# Create service
echo "🚀 Creating ECS service..."
aws ecs create-service \
  --cluster insurance-api-testing \
  --service-name insurance-app \
  --task-definition insurance-api-testing:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
  --region $REGION || true

echo "✅ AWS deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update your DNS to point $DOMAIN to the ECS service"
echo "2. Set up SSL certificate using AWS Certificate Manager"
echo "3. Configure Application Load Balancer if needed"
echo "4. Monitor logs: aws logs tail /ecs/insurance-api-testing --follow" 