#!/bin/bash

# AWS EC2 Setup Script for Insurance API Testing Project
# This script sets up an EC2 instance with Docker and deploys the application

set -e

# Configuration
DOMAIN=${1:-"yourdomain.com"}
REGION=${2:-"us-east-1"}
INSTANCE_TYPE=${3:-"t3.micro"}
KEY_NAME=${4:-"your-key-pair"}

echo "🚀 Setting up EC2 instance for Insurance API Testing Project"
echo "Domain: $DOMAIN"
echo "Region: $REGION"
echo "Instance Type: $INSTANCE_TYPE"

# Create security group
echo "📦 Creating security group..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
  --group-name insurance-api-testing-sg \
  --description "Security group for Insurance API Testing Project" \
  --region $REGION \
  --query 'GroupId' --output text)

# Add security group rules
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0 \
  --region $REGION

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $REGION

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $REGION

# Launch EC2 instance
echo "🖥️  Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --count 1 \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SECURITY_GROUP_ID \
  --user-data file://aws/user-data.sh \
  --region $REGION \
  --query 'Instances[0].InstanceId' --output text)

echo "⏳ Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --region $REGION \
  --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

echo "✅ EC2 instance setup complete!"
echo "Instance ID: $INSTANCE_ID"
echo "Public IP: $PUBLIC_IP"
echo "Domain: $DOMAIN"
echo ""
echo "🔧 Next steps:"
echo "1. Update your DNS to point $DOMAIN to $PUBLIC_IP"
echo "2. SSH to the instance: ssh ubuntu@$PUBLIC_IP"
echo "3. Check application status: docker-compose ps"
echo "4. View logs: docker-compose logs -f" 