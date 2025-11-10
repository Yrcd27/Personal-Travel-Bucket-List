# Jenkins CI/CD Pipeline Setup

## Overview
This project uses Jenkins for automated Docker image building with manual approval for Docker Hub deployment.

## Pipeline Flow
1. **Automatic Trigger**: When code is pushed to Git
2. **Build Images**: Creates Docker images for frontend and backend
3. **Manual Approval**: Waits for user decision to push to Docker Hub
4. **Conditional Push**: Only pushes if approved

## Setup Instructions

### Prerequisites
- Jenkins installed and running
- Docker installed on Jenkins server
- Docker Hub account

### Configuration Steps
1. Replace `YOUR_DOCKERHUB_USERNAME` in Jenkinsfile with your actual Docker Hub username
2. Add Docker Hub credentials to Jenkins (ID: `dockerhub-credentials`)
3. Create pipeline job pointing to this repository
4. Enable SCM polling for automatic builds

### Manual Approval Process
When pipeline reaches approval stage:
- Jenkins will pause and wait for user input
- User can choose "Yes" to push to Docker Hub or "No" to skip
- This prevents unnecessary image uploads while maintaining automation

## Docker Hub Images
- Frontend: `yrcd27/travel-bucket-list-frontend`
- Backend: `yrcd27/travel-bucket-list-backend`

Each build creates both versioned (build number) and latest tags.