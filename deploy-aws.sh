#!/bin/bash

# AWS Deployment Script for Student Management System
# This script automates the deployment to AWS EC2

set -e

echo "🚀 Starting AWS deployment..."

# Configuration
APP_NAME="student-management"
DOCKER_IMAGE="$APP_NAME:latest"
CONTAINER_NAME="$APP_NAME-container"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true

# Build the application
print_status "Building the application..."
npm run build

# Build Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE .

# Start services with Docker Compose
print_status "Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Deployment successful!"
    print_status "Application is running at: http://localhost:5000"
    print_status "Login credentials: admin / pass123"
else
    print_error "❌ Deployment failed. Check the logs:"
    docker-compose logs
    exit 1
fi

# Show running containers
print_status "Running containers:"
docker-compose ps

print_status "🎉 Deployment completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Change default credentials in production"
print_warning "2. Set up proper environment variables"
print_warning "3. Configure SSL certificates"
print_warning "4. Set up monitoring and logging"