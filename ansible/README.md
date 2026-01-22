# 🚀 Ansible Deployment - Quick Reference

## Quick Start

```bash
# 1. Install Ansible
sudo apt install ansible -y
pip3 install docker docker-compose

# 2. Test connection
cd ansible/
ansible all -m ping

# 3. Deploy application
ansible-playbook deploy.yml
```

## 📁 Directory Structure

```
ansible/
├── inventory.ini              # EC2 server details (50.16.238.185)
├── ansible.cfg                # Ansible configuration
├── deploy.yml                 # Main playbook
└── roles/
    ├── docker/                # Installs Docker on EC2
    ├── app-deploy/            # Deploys application
    └── health-check/          # Verifies deployment
```

## 🎯 What This Does

1. **Installs Docker** on EC2 (if not already installed)
2. **Copies application files** (backend, frontend, database)
3. **Generates configuration** (.env, docker-compose.yml)
4. **Starts containers** (MySQL, backend, frontend)
5. **Runs health checks** (verifies everything works)

## 🔑 Common Commands

```bash
# Full deployment (6-9 minutes first time)
ansible-playbook deploy.yml

# Quick re-deploy after code changes (3-4 minutes)
ansible-playbook deploy.yml --tags deploy

# Only health checks
ansible-playbook deploy.yml --tags health

# Dry run (preview changes)
ansible-playbook deploy.yml --check

# Verbose output (debugging)
ansible-playbook deploy.yml -vv
```

## 🌐 Access Your Application

After deployment:
- **Frontend:** http://50.16.238.185:5173
- **Backend API:** http://50.16.238.185:5000
- **Database:** Port 3306 (internal)

## 🔧 Managing Deployed Application

```bash
# SSH to server
ssh ubuntu@50.16.238.185

# View running containers
ssh ubuntu@50.16.238.185 "docker ps"

# View logs (live)
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose logs -f"

# Restart application
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose restart"

# Stop application
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose down"

# Start application
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose up -d"

# Check resource usage
ssh ubuntu@50.16.238.185 "docker stats --no-stream"
```

## 📝 Configuration

### Inventory ([inventory.ini](inventory.ini))
- EC2 IP: `50.16.238.185`
- User: `ubuntu`
- SSH key: `~/.ssh/travel-bucket-key.pem`

### Variables ([deploy.yml](deploy.yml))
```yaml
frontend_port: 5173
backend_port: 5000
mysql_port: 3306
mysql_root_password: "root_password_123"  # Change in production!
jwt_secret: "your-super-secret-jwt-key"    # Change in production!
```

## 🐛 Troubleshooting

### Connection Issues
```bash
# Test SSH connection
ansible all -m ping

# If fails, check SSH manually
ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@50.16.238.185

# Fix SSH key permissions
chmod 400 ~/.ssh/travel-bucket-key.pem
```

### Deployment Failures
```bash
# Run with verbose output
ansible-playbook deploy.yml -vv

# Check EC2 resources
ssh ubuntu@50.16.238.185 "free -h && df -h"

# View container logs
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose logs"
```

### Container Issues
```bash
# Restart specific container
ssh ubuntu@50.16.238.185 "docker restart travel-frontend"
ssh ubuntu@50.16.238.185 "docker restart travel-backend"
ssh ubuntu@50.16.238.185 "docker restart travel-mysql"

# Remove and redeploy
ansible-playbook deploy.yml --tags deploy
```

## 🔒 Security Notes

**Change default passwords in [deploy.yml](deploy.yml):**
- `mysql_root_password`
- `mysql_password`
- `jwt_secret`

**Use Ansible Vault for production:**
```bash
ansible-vault create secrets.yml
ansible-playbook deploy.yml --ask-vault-pass
```

## 📊 Understanding Output

### Successful Deployment
```
PLAY RECAP ***********************************************************
travel-bucket-server : ok=52   changed=35   unreachable=0    failed=0
```

- `ok`: Tasks completed
- `changed`: Tasks that made changes
- `unreachable=0`: ✅ Server is accessible
- `failed=0`: ✅ No errors

### Health Check Output
```
✅ MySQL:    Running and healthy
✅ Backend:  Running and responding (HTTP 200)
✅ Frontend: Running and responding (HTTP 200)
```

## ⏱️ Expected Times

- **First deployment:** 6-9 minutes
  - Installing Docker: 2-3 minutes
  - Deploying application: 3-5 minutes
  - Health checks: 30 seconds

- **Subsequent deployments:** 3-4 minutes
  - Docker already installed
  - Just updates application

## 📖 Roles Explained

### 1. docker
**Purpose:** Installs Docker on EC2
- Updates apt packages
- Adds Docker repository
- Installs Docker Engine & Docker Compose
- Adds ubuntu user to docker group

### 2. app-deploy
**Purpose:** Deploys application
- Creates application directory
- Copies backend, frontend, database files
- Generates .env and docker-compose.yml
- Starts all containers

### 3. health-check
**Purpose:** Verifies deployment
- Checks containers are running
- Tests HTTP endpoints
- Displays logs and statistics

## 🎓 Learn More

See [ANSIBLE_SETUP_GUIDE.md](../ANSIBLE_SETUP_GUIDE.md) for:
- Detailed explanations
- Step-by-step instructions
- Advanced usage
- Troubleshooting guide
- Security best practices

## ✅ Pre-flight Checklist

Before running Ansible:
- ✅ Ansible installed: `ansible --version`
- ✅ Docker module: `pip3 list | grep docker`
- ✅ SSH key permissions: `chmod 400 ~/.ssh/travel-bucket-key.pem`
- ✅ EC2 running: Check AWS Console
- ✅ Security group allows ports: 22, 80, 443, 5000, 5173, 3306

## 🚨 Emergency Commands

```bash
# Stop everything
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose down"

# Clean restart
ssh ubuntu@50.16.238.185 "cd travel-bucket-list && docker-compose down -v && docker-compose up -d"

# Fresh deployment
ansible-playbook deploy.yml --tags deploy
```

---

**Need help?** Check [ANSIBLE_SETUP_GUIDE.md](../ANSIBLE_SETUP_GUIDE.md) for comprehensive instructions!
