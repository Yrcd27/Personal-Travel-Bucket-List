<div align="center">

# Personal Travel Bucket List 🌍

A full-stack web application for managing your travel bucket list with complete DevOps automation pipeline.

## 🛠 Technology Stack

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18+-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-24.0+-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com)
[![Jenkins](https://img.shields.io/badge/Jenkins-2.400+-D24939?style=flat&logo=jenkins&logoColor=white)](https://www.jenkins.io)
[![Terraform](https://img.shields.io/badge/Terraform-1.0+-623CE4?style=flat&logo=terraform&logoColor=white)](https://www.terraform.io)
[![Ansible](https://img.shields.io/badge/Ansible-2.9+-EE0000?style=flat&logo=ansible&logoColor=white)](https://www.ansible.com)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS-232F3E?style=flat&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [DevOps Pipeline](#devops-pipeline)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

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

## 🏗 Architecture

### Complete DevOps Infrastructure

This project demonstrates a **production-grade DevOps pipeline** with full automation from code commit to deployment:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  Jenkins CI/CD  │───▶│   Docker Hub    │
│   (Source Code) │    │ (Hosted on EC2) │    │ (Image Registry)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │ Ansible Deploy       │ Pull Images
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ App Server EC2  │◀───│  Ansible Deploy │
                       │ (Production)    │    │ (from Jenkins)  │
                       └─────────────────┘    └─────────────────┘
                                │
                                │ Database Connection
                                ▼
                       ┌─────────────────┐
                       │   RDS MySQL     │
                       │   (Database)    │
                       └─────────────────┘

┌─────────────────┐
│  Terraform IaC  │ ──── Provisions All 3 Resources:
│ (Infrastructure)│      • Jenkins Server EC2
└─────────────────┘      • Application Server EC2
                         • RDS MySQL Database
```

## How the Complete Pipeline Works

### 🏗 **Infrastructure Setup (Terraform)**

**Terraform provisions 3 AWS resources:**

1. **Jenkins Server (EC2)** - t4g.small ARM64 instance
   - Hosts Jenkins CI/CD server
   - Pre-installed with Docker and Ansible
   - Receives GitHub webhooks on port 8080
   - Builds ARM64 Docker images

2. **Application Server (EC2)** - t4g.small ARM64 instance
   - Hosts production application
   - Runs Docker Compose with frontend/backend
   - Serves React app on port 5173
   - Serves Node.js API on port 5000

3. **RDS MySQL Database** - db.t3.micro managed database
   - Persistent data storage
   - Automated backups and maintenance
   - Secure network isolation

**Infrastructure Command:**
```bash
terraform apply  # Creates all 3 resources with networking
```

### 🔄 **CI/CD Pipeline Flow**

**Step-by-Step Automation:**

1. **Developer Push** → Code pushed to GitHub repository

2. **Webhook Trigger** → GitHub sends webhook to Jenkins server

3. **Jenkins Pipeline Starts** (6 automated stages):
   - **Checkout**: Pull latest code from GitHub
   - **Build**: Create ARM64 Docker images (frontend + backend)
   - **Test**: Run automated test suites
   - **Push**: Upload images to Docker Hub registry
   - **Deploy**: Execute Ansible playbook
   - **Health Check**: Verify deployment success

4. **Ansible Deployment** → Jenkins runs Ansible to:
   - SSH into Application Server
   - Pull latest Docker images from Docker Hub
   - Update docker-compose configuration
   - Restart containers with zero downtime
   - Validate application health

5. **Application Live** → Users access the updated application

### 🛠 **Ansible Configuration Management**

**Ansible runs from Jenkins server and:**
- Manages Application Server configuration
- Deploys Docker containers
- Updates environment variables
- Performs rolling restarts
- Validates deployment health
- Provides rollback capabilities

**Key Ansible Features:**
- **Idempotent**: Safe to run multiple times
- **Zero Downtime**: Rolling deployments
- **Environment Specific**: Dynamic configurations
- **Health Monitoring**: Post-deployment verification

### 🚀 **Complete Automation Result**

**From Code to Production in 3-5 minutes:**
```bash
git push origin main
# → GitHub webhook triggers Jenkins
# → Jenkins builds ARM64 images
# → Images pushed to Docker Hub
# → Ansible deploys to production
# → Health checks verify success
# → Application live with new changes
```

**Production Architecture:**
- **Jenkins Server**: Handles all CI/CD operations
- **Application Server**: Hosts containerized React + Node.js app
- **RDS Database**: Provides persistent MySQL storage
- **Docker Hub**: Stores versioned container images
- **Ansible**: Manages deployment automation

### Multi-Server Architecture

#### Jenkins Server (EC2 Instance #1)
- **Purpose**: CI/CD automation and build orchestration
- **Instance Type**: t4g.small (ARM64 Graviton2, 2GB RAM)
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

## 📋 Prerequisitesre consistency
- **Zero-downtime deployments** with health checks
- **Environment-specific configurations** via templates
- **Rollback capabilities** for failed deployments

## 📋 Prerequisites

- **Node.js** 18+
- **Docker** & Docker Compose
- **AWS Account** with CLI configured
- **Terraform** 1.0+
- **Ansible** 2.9+
- **Git**

## 🚀 Quick Start

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

## 🔄 DevOps Pipeline

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
- **Jenkins Server**: t4g.small ARM64 EC2 with Docker & Jenkins
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

## 🚀 Deployment

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

## 📚 API Documentation

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

## 🔧 Configuration

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

## 🏗 Project Structure

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

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Input Validation** on all endpoints
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data
- **SQL Injection Protection** with parameterized queries

## 📊 Monitoring & Operations

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

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Yrcd27**
- GitHub: [@yrcd27](https://github.com/yrcd27)
- Docker Hub: [yrcd27](https://hub.docker.com/u/yrcd27)

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- Docker for containerization
- Jenkins for CI/CD automation
- React and Node.js communities

---

**⭐ Star this repository if you found it helpful!**