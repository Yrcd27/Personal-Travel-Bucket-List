# Personal Travel Bucket List

A full-stack web application for managing your travel bucket list with complete DevOps automation pipeline.

## Live Demo

- **Frontend**: http://YOUR_SERVER_IP:5173
- **Backend API**: http://YOUR_SERVER_IP:5000
- **Jenkins CI/CD**: http://YOUR_JENKINS_IP:8080

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [DevOps Pipeline](#devops-pipeline)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Features

- **User Authentication**: Secure JWT-based login/signup
- **Destination Management**: Add, edit, delete travel destinations
- **Progress Tracking**: Mark destinations as visited
- **Responsive Design**: Mobile-first UI with TailwindCSS
- **Image Carousel**: Beautiful hero section with travel images
- **Secure Backend**: Input validation and error handling

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### DevOps & Infrastructure
- **Docker** - Containerization
- **Jenkins** - CI/CD pipeline
- **Ansible** - Configuration management
- **Terraform** - Infrastructure as Code
- **AWS** - Cloud platform (EC2, RDS)
- **Docker Hub** - Container registry

## Architecture

### Complete DevOps Infrastructure

This project demonstrates a **production-grade DevOps pipeline** with full automation from code commit to deployment:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  Jenkins CI/CD  │───▶│   Docker Hub    │
│   (Source Code) │    │  (Build Server) │    │ (Image Registry)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ Webhook Trigger       │ SSH Deploy            │ Pull Images
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Terraform IaC  │───▶│ App Server EC2  │◀───│  Ansible Deploy │
│ (Infrastructure)│    │ (Production)    │    │ (Configuration) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │ Database Connection
                                ▼
                       ┌─────────────────┐
                       │   RDS MySQL     │
                       │   (Database)    │
                       └─────────────────┘
```

### Multi-Server Architecture

#### Jenkins Server (EC2 Instance #1)
- **Purpose**: CI/CD automation and build orchestration
- **Instance Type**: t3.medium (2 vCPU, 4GB RAM)
- **Services**: Jenkins, Docker, Ansible
- **Responsibilities**:
  - GitHub webhook integration
  - ARM64 Docker image builds
  - Automated testing execution
  - Docker Hub image publishing
  - Ansible deployment orchestration
  - Pipeline health monitoring

#### Application Server (EC2 Instance #2)
- **Purpose**: Production application hosting
- **Instance Type**: t4g.small (ARM64 Graviton2)
- **Services**: Docker Compose, Frontend, Backend
- **Responsibilities**:
  - React frontend serving (Port 5173)
  - Node.js backend API (Port 5000)
  - Container orchestration
  - Application health monitoring

#### RDS MySQL Database
- **Purpose**: Persistent data storage
- **Engine**: MySQL 8.0
- **Instance Class**: db.t3.micro
- **Features**:
  - Automated backups
  - Multi-AZ deployment ready
  - Security group isolation
  - SSL/TLS encryption

### DevOps Pipeline Excellence

#### Automated Workflow
1. **Code Push** → GitHub repository
2. **Webhook Trigger** → Jenkins server receives notification
3. **Build Phase** → Jenkins creates ARM64 Docker images
4. **Test Phase** → Automated testing suite execution
5. **Registry Push** → Images uploaded to Docker Hub
6. **Deployment Phase** → Ansible deploys to production server
7. **Health Check** → Automated verification of deployment
8. **Notification** → Pipeline status reporting

#### Infrastructure as Code (Terraform)
- **Complete AWS infrastructure** provisioned via code
- **Version controlled** infrastructure changes
- **Reproducible environments** across dev/staging/prod
- **Cost optimized** with appropriate instance sizing

#### Configuration Management (Ansible)
- **Idempotent deployments** ensure consistency
- **Zero-downtime deployments** with health checks
- **Environment-specific configurations** via templates
- **Rollback capabilities** for failed deployments

## Prerequisites

- **Node.js** 18+
- **Docker** & Docker Compose
- **AWS Account** with CLI configured
- **Terraform** 1.0+
- **Ansible** 2.9+
- **Git**

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/Personal-Travel-Bucket-List.git
cd Personal-Travel-Bucket-List
```

### 2. Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 3. Docker Development
```bash
docker-compose up -d
```

## DevOps Pipeline

### Infrastructure Provisioning (Terraform)

Complete AWS infrastructure is provisioned using Infrastructure as Code:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Configure: AWS region, instance types, security groups, key pairs
terraform init
terraform plan    # Review infrastructure changes
terraform apply   # Deploy: 2x EC2 instances + RDS + Security Groups
```

**Terraform Creates:**
- **Jenkins Server**: t3.medium EC2 with Docker & Jenkins
- **App Server**: t4g.small ARM64 EC2 for production
- **RDS MySQL**: Managed database with automated backups
- **Security Groups**: Proper network isolation and access control
- **Key Pairs**: SSH access management

### CI/CD Pipeline (Jenkins)

**6-Stage Automated Pipeline:**

1. **Checkout** - Pull latest code from GitHub
2. **Build** - Create ARM64 Docker images (frontend + backend)
3. **Test** - Run automated test suites
4. **Push** - Upload images to Docker Hub registry
5. **Deploy** - Ansible orchestrates production deployment
6. **Health Check** - Verify application availability and performance

**Pipeline Features:**
- **ARM64 Architecture**: Optimized for AWS Graviton processors
- **Parallel Execution**: Frontend and backend build simultaneously
- **Automated Testing**: Quality gates prevent bad deployments
- **Zero Downtime**: Rolling deployments with health checks
- **Rollback Ready**: Automatic reversion on deployment failures

### Configuration Management (Ansible)

**Deployment Automation:**
- **Idempotent Operations**: Safe to run multiple times
- **Environment Templates**: Dynamic configuration generation
- **Service Orchestration**: Docker Compose management
- **Health Monitoring**: Post-deployment verification

```bash
# Ansible automatically:
# 1. Pulls latest Docker images from registry
# 2. Updates environment configurations
# 3. Performs rolling restart of services
# 4. Validates application health
# 5. Reports deployment status
```

### Pipeline Trigger & Automation

**Complete Automation Flow:**
```bash
git add .
git commit -m "feat: your changes"
git push origin main
# Magic happens automatically:
# → GitHub webhook triggers Jenkins
# → Jenkins builds ARM64 images
# → Images pushed to Docker Hub
# → Ansible deploys to production
# → Health checks verify success
# → Application live in ~3-5 minutes
```

**DevOps Excellence Demonstrated:**
- **Speed**: Code to production in under 5 minutes
- **Security**: No manual server access required
- **Reliability**: Automated testing and health checks
- **Consistency**: Identical deployments every time
- **Traceability**: Complete audit trail of all changes
- **Recovery**: Automated rollback on failures

## Deployment

### Production-Grade Deployment

**Fully Automated Production Pipeline:**

1. **Code Commit** → Developer pushes to GitHub
2. **Webhook Trigger** → Jenkins receives instant notification
3. **Multi-Arch Build** → ARM64 Docker images created
4. **Registry Push** → Images uploaded to Docker Hub
5. **Ansible Deploy** → Zero-downtime deployment to production
6. **Health Verification** → Automated application testing
7. **Notification** → Deployment status confirmation

**Key DevOps Achievements:**
- **Lightning Fast**: 3-5 minute deployment cycles
- **Zero Downtime**: Rolling deployments with health checks
- **Secure**: No manual server access required
- **Reliable**: Automated testing prevents bad deployments
- **Monitored**: Real-time health and performance tracking

### Manual Deployment Options

**For emergency or maintenance scenarios:**
```bash
# Using Ansible
cd ansible
ansible-playbook -i inventory.ini deploy.yml

# Using Docker Compose
ssh ubuntu@YOUR_SERVER_IP
cd /home/ubuntu/travel-bucket-list
docker-compose pull
docker-compose up -d
```

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login    - User login
```

### Destinations Endpoints
```
GET    /api/destinations     - Get user destinations
POST   /api/destinations     - Add new destination
PUT    /api/destinations/:id - Update destination
DELETE /api/destinations/:id - Delete destination
```

### Request Examples
```bash
# Register
curl -X POST http://YOUR_SERVER_IP:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://YOUR_SERVER_IP:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Add Destination
curl -X POST http://YOUR_SERVER_IP:5000/api/destinations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Paris","country":"France","description":"City of Light"}'
```

## Configuration

### Environment Variables
```env
# Backend
DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=travelbucket
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=http://your-backend-url:5000
```

### Docker Hub Images
- **Frontend**: `yrcd27/travel-bucket-list-frontend:latest`
- **Backend**: `yrcd27/travel-bucket-list-backend:latest`

## Project Structure

```
Personal-Travel-Bucket-List/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   └── Dockerfile
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── Dockerfile
├── terraform/              # Infrastructure as Code
├── ansible/                # Configuration management
├── db/                     # Database scripts
├── Jenkinsfile            # CI/CD pipeline
└── docker-compose-production.yml
```

## Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Input Validation** on all endpoints
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **SQL Injection Protection** with parameterized queries

## Monitoring & Operations

### Real-Time Health Monitoring

**Application Health Endpoints:**
- **Frontend**: http://YOUR_SERVER_IP:5173 - React application status
- **Backend API**: http://YOUR_SERVER_IP:5000 - Node.js service health
- **Database**: Connection monitoring via application logs

**DevOps Monitoring Features:**
- **Automated Health Checks**: Built into deployment pipeline
- **Service Discovery**: Docker container status monitoring
- **Performance Metrics**: Response time and availability tracking
- **Error Alerting**: Automated failure detection and reporting

### Comprehensive Logging

**Multi-Layer Logging Strategy:**
```bash
# Application Logs (Production Server)
ssh ubuntu@YOUR_SERVER_IP
docker logs travel-backend -f    # Backend API logs
docker logs travel-frontend -f   # Frontend server logs

# Pipeline Logs (Jenkins Server)
# Available in Jenkins UI with full console output
# Build logs, test results, deployment status

# Infrastructure Logs
# CloudWatch integration for EC2 and RDS monitoring
```

**Log Analysis Capabilities:**
- **Request Tracing**: Full API request/response logging
- **Error Tracking**: Detailed error stack traces
- **Performance Monitoring**: Response time analysis
- **Security Auditing**: Authentication and authorization logs

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Yrcd27**
- GitHub: [@yrcd27](https://github.com/yrcd27)
- Docker Hub: [yrcd27](https://hub.docker.com/u/yrcd27)

## Acknowledgments

- AWS for cloud infrastructure
- Docker for containerization
- Jenkins for CI/CD automation
- React and Node.js communities

---

**Star this repository if you found it helpful!**