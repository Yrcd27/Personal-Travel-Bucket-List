# Main Terraform Configuration
# This is the heart of your infrastructure - it creates everything!

# Data source: Get the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu official)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
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
              # Update system
              apt-get update -y
              apt-get upgrade -y
              
              # Install basic tools
              apt-get install -y curl wget git vim
              
              # Create app directory
              mkdir -p /opt/app
              chmod 755 /opt/app
              
              echo "EC2 instance initialized successfully" > /opt/app/init.log
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
