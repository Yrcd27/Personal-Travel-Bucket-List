# Terraform Variables
# These are like function parameters - you can change them without editing the main code

variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "travel-bucket"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro" # Free tier eligible
}

variable "key_name" {
  description = "Name of the SSH key pair for EC2 access"
  type        = string
  # You MUST set this! Example: "my-aws-key"
}

variable "my_ip" {
  description = "Your IP address for SSH access (format: x.x.x.x/32)"
  type        = string
  default     = "0.0.0.0/0" # WARNING: Open to world - change this for production!
}

variable "allowed_ssh_ips" {
  description = "List of IP addresses allowed to SSH (CIDR notation)"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Open to world - change for security
}
