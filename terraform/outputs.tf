# Terraform Outputs
# These values are displayed after Terraform creates resources
# Jenkins and Ansible will use these to know where to deploy

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.app_server.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.app_server.private_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.app_server.id
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID of the subnet"
  value       = aws_subnet.public.id
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.app_server.public_ip}"
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_eip.app_server.public_ip}:5173"
}

output "api_url" {
  description = "URL to access the API"
  value       = "http://${aws_eip.app_server.public_ip}:5000"
}

# Output in JSON format for Ansible
output "ansible_inventory" {
  description = "Ansible inventory in JSON format"
  value = jsonencode({
    app_servers = {
      hosts = {
        (aws_instance.app_server.tags.Name) = {
          ansible_host                 = aws_eip.app_server.public_ip
          ansible_user                 = "ubuntu"
          ansible_ssh_private_key_file = "~/.ssh/${var.key_name}.pem"
        }
      }
    }
  })
}

# RDS Database Outputs
output "rds_endpoint" {
  description = "RDS MySQL endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_address" {
  description = "RDS MySQL address (hostname only)"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS MySQL port"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

# Jenkins Server Outputs
output "jenkins_instance_id" {
  description = "ID of the Jenkins EC2 instance"
  value       = aws_instance.jenkins.id
}

output "jenkins_public_ip" {
  description = "Public IP address of Jenkins server"
  value       = aws_eip.jenkins.public_ip
}

output "jenkins_private_ip" {
  description = "Private IP address of Jenkins server"
  value       = aws_instance.jenkins.private_ip
}

output "jenkins_url" {
  description = "URL to access Jenkins"
  value       = "http://${aws_eip.jenkins.public_ip}:8080"
}

output "jenkins_ssh_command" {
  description = "SSH command to connect to Jenkins server"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.jenkins.public_ip}"
}

output "github_webhook_url" {
  description = "GitHub webhook URL for Jenkins"
  value       = "http://${aws_eip.jenkins.public_ip}:8080/github-webhook/"
}
