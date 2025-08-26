# Student Management System - AWS Deployment Guide

## Overview
This guide explains how to deploy the Student Management System to AWS using various services.

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended for simplicity)
**Best for**: Quick deployment with minimal configuration

#### Prerequisites
- AWS CLI installed and configured
- Node.js 20 installed locally
- PostgreSQL database (RDS or external)

#### Steps
1. **Prepare the application**
   ```bash
   # Install dependencies
   npm install
   
   # Build the client
   npm run build:client
   ```

2. **Create deployment package**
   ```bash
   # Create .ebextensions directory for configuration
   mkdir .ebextensions
   ```

3. **Configure environment variables in AWS Console**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string
   - `NODE_ENV`: production

4. **Deploy**
   ```bash
   # Initialize EB application
   eb init student-management --platform node.js
   
   # Create environment
   eb create production
   
   # Deploy
   eb deploy
   ```

### Option 2: AWS EC2 with Docker
**Best for**: More control over the environment

#### Files included
- `Dockerfile`: Container configuration
- `docker-compose.yml`: Local development with database
- `deploy.sh`: Deployment script

#### Steps
1. **Launch EC2 instance** (Ubuntu 22.04 LTS recommended)
2. **Install Docker and Docker Compose**
3. **Clone your repository**
4. **Set environment variables**
5. **Run deployment script**

### Option 3: AWS Lambda + API Gateway (Serverless)
**Best for**: Cost-effective, auto-scaling

#### Files included
- `serverless.yml`: Serverless framework configuration
- `lambda.js`: Lambda handler wrapper

#### Steps
1. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **Configure AWS credentials**
3. **Deploy**
   ```bash
   serverless deploy
   ```

## Database Setup

### AWS RDS PostgreSQL
1. **Create RDS instance**
   - Engine: PostgreSQL 15+
   - Instance class: db.t3.micro (for testing)
   - Storage: 20GB minimum

2. **Configure security groups**
   - Allow inbound connections on port 5432
   - From your application's security group

3. **Get connection string**
   ```
   postgresql://username:password@your-rds-endpoint:5432/database_name
   ```

## Environment Variables Required
```env
DATABASE_URL=postgresql://username:password@host:5432/database
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=production
PORT=5000
```

## Production Considerations

### Security
- Use HTTPS in production (AWS Certificate Manager)
- Set secure session cookies
- Validate all inputs
- Use environment variables for secrets

### Performance
- Enable compression
- Set up CloudFront CDN for static assets
- Configure auto-scaling

### Monitoring
- AWS CloudWatch for logs and metrics
- Health checks configured
- Error tracking (optional: Sentry)

## Cost Estimation

### Elastic Beanstalk (Monthly)
- Application Load Balancer: ~$16
- EC2 t3.micro: ~$8.50
- RDS db.t3.micro: ~$12.50
- **Total: ~$37/month**

### EC2 + RDS (Monthly)
- EC2 t3.micro: ~$8.50
- RDS db.t3.micro: ~$12.50
- **Total: ~$21/month**

### Serverless (Pay per use)
- Lambda: $0.20 per 1M requests
- API Gateway: $3.50 per 1M requests
- RDS: ~$12.50/month
- **Very low cost for low traffic**

## Next Steps
1. Choose your deployment option
2. Set up AWS account and billing
3. Create RDS database
4. Deploy application using chosen method
5. Configure domain and SSL certificate