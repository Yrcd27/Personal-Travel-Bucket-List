# Terraform Provider Configuration
# This file tells Terraform to use AWS and which version

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# AWS Provider - connects to your AWS account
provider "aws" {
  region = var.aws_region

  # Credentials will be read from:
  # 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  # 2. AWS credentials file (~/.aws/credentials)
  # 3. IAM role (if running on AWS)

  default_tags {
    tags = {
      Project     = "Travel-Bucket-List"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}
