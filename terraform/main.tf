# Main Terraform Configuration
# This is the heart of your infrastructure - it creates everything!

# Data source: Get the latest Ubuntu 22.04 AMI for ARM64 (Graviton)
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu official)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-arm64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  
  filter {
    name   = "architecture"
    values = ["arm64"]
  }
}

# VPC - Virtual Private Cloud (your private network in AWS)
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Internet Gateway - Allows EC2 to access internet
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Subnet - A segment of your VPC
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# Get available zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Route Table - Defines how traffic flows
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Route Table Association - Links subnet to route table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group - Firewall rules for EC2
resource "aws_security_group" "app_server" {
  name        = "${var.project_name}-sg"
  description = "Security group for Travel Bucket List application"
  vpc_id      = aws_vpc.main.id

  # SSH access (for Ansible to connect)
  ingress {
    description = "SSH from allowed IPs"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_ips
  }

  # HTTP access (for users)
  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API port
  ingress {
    description = "Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend port
  ingress {
    description = "Frontend Vite"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # MySQL port (only from within VPC for security)
  ingress {
    description = "MySQL from VPC"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Outbound traffic - allow all
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-sg"
  }
}

# EC2 Instance - The actual server!
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app_server.id]
  associate_public_ip_address = true

  # Storage
  root_block_device {
    volume_size = 20 # GB
    volume_type = "gp3"
    encrypted   = true
  }

  # User data script - runs on first boot
  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Log all output
              exec > >(tee /var/log/user-data.log)
              exec 2>&1
              
              echo "=== Starting EC2 Initialization ==="
              
              # 1. Create 2GB swap space (critical for t4g.small with 2GB RAM)
              echo "Creating swap space..."
              dd if=/dev/zero of=/swapfile bs=128M count=16
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' >> /etc/fstab
              
              # 2. Optimize swap usage (don't swap until 90% RAM used)
              echo "vm.swappiness=10" >> /etc/sysctl.conf
              echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
              sysctl -p
              
              # 3. CPU governor optimization for ARM (Graviton)
              echo "performance" | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
              
              # 4. Disable unnecessary services to save memory
              systemctl disable snapd.service snapd.socket || true
              systemctl stop snapd.service snapd.socket || true
              
              # 5. Update system (non-interactive)
              export DEBIAN_FRONTEND=noninteractive
              apt-get update -y
              apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
              
              # 6. Install essential tools only
              apt-get install -y curl wget git vim htop
              
              # 7. Create app directory
              mkdir -p /opt/app
              chmod 755 /opt/app
              
              # 8. Log completion
              echo "=== EC2 Initialization Completed ===" 
              free -h > /opt/app/memory-status.txt
              echo "Swap configured and system optimized" > /opt/app/init.log
              date >> /opt/app/init.log
              EOF

  tags = {
    Name        = "${var.project_name}-server"
    Environment = var.environment
  }

  # Prevent accidental termination
  disable_api_termination = false

  # Wait for instance to be ready
  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP - Static public IP that doesn't change
resource "aws_eip" "app_server" {
  instance = aws_instance.app_server.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }

  # EIP depends on internet gateway
  depends_on = [aws_internet_gateway.main]
}

# ====================
# JENKINS SERVER
# ====================

# Security Group for Jenkins
resource "aws_security_group" "jenkins" {
  name        = "${var.project_name}-jenkins-sg"
  description = "Security group for Jenkins CI/CD server"
  vpc_id      = aws_vpc.main.id

  # SSH access
  ingress {
    description = "SSH from allowed IPs"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_ips
  }

  # Jenkins Web UI and GitHub Webhook
  ingress {
    description = "Jenkins Web UI and GitHub Webhook"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Jenkins to communicate with app server (SSH for deployment)
  egress {
    description = "SSH to app server"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${aws_eip.app_server.public_ip}/32"]
  }

  # Outbound traffic - allow all (for Docker Hub, apt, etc.)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-jenkins-sg"
  }
}

# Jenkins EC2 Instance
resource "aws_instance" "jenkins" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.jenkins_instance_type
  key_name      = var.key_name

  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.jenkins.id]
  associate_public_ip_address = true

  # Storage - Jenkins needs more space for builds
  root_block_device {
    volume_size = 30 # GB (more space for Docker images)
    volume_type = "gp3"
    encrypted   = true
  }

  # User data script - Install Docker and prepare for Jenkins
  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Log all output
              exec > >(tee /var/log/user-data.log)
              exec 2>&1
              
              echo "=== Starting Jenkins Server Initialization ==="
              
              # 1. Create 2GB swap space
              echo "Creating swap space..."
              dd if=/dev/zero of=/swapfile bs=128M count=16
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' >> /etc/fstab
              
              # 2. Optimize swap usage
              echo "vm.swappiness=10" >> /etc/sysctl.conf
              echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
              sysctl -p
              
              # 3. Update system
              export DEBIAN_FRONTEND=noninteractive
              apt-get update -y
              apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
              
              # 4. Install Docker (for building images)
              apt-get install -y ca-certificates curl gnupg lsb-release
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo "deb [arch=arm64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
              
              # 5. Configure Docker for Jenkins
              usermod -aG docker ubuntu
              systemctl enable docker
              systemctl start docker
              
              # 6. Install essential tools
              apt-get install -y git curl wget vim htop
              
              # 7. Create Jenkins directory
              mkdir -p /var/jenkins_home
              chown -R ubuntu:ubuntu /var/jenkins_home
              
              # 8. Log completion
              echo "=== Jenkins Server Initialization Completed ===" 
              echo "Ready for Jenkins installation" > /home/ubuntu/jenkins-ready.txt
              docker --version >> /home/ubuntu/jenkins-ready.txt
              date >> /home/ubuntu/jenkins-ready.txt
              EOF

  tags = {
    Name        = "${var.project_name}-jenkins"
    Environment = var.environment
    Role        = "CI/CD"
  }

  disable_api_termination = false

  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP for Jenkins
resource "aws_eip" "jenkins" {
  instance = aws_instance.jenkins.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-jenkins-eip"
  }

  depends_on = [aws_internet_gateway.main]
}
