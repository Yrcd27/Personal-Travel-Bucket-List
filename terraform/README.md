# 🚀 Quick Start - Terraform Setup

## ⚡ Fast Track (If You're Comfortable)

### 1. Install Tools
```bash
# Windows (PowerShell as Admin)
choco install terraform awscli

# Linux/WSL
sudo apt install terraform awscli
```

### 2. Configure AWS
```bash
aws configure
# Enter: Access Key ID, Secret Key, Region (us-east-1), Format (json)
```

### 3. Create SSH Key in AWS
- AWS Console → EC2 → Key Pairs → Create key pair
- Name: `travel-bucket-key`
- Format: `.pem`
- Save to: `~/.ssh/travel-bucket-key.pem`
- Run: `chmod 400 ~/.ssh/travel-bucket-key.pem`

### 4. Configure Terraform
```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars - set key_name to your key pair name
```

### 5. Run Terraform
```bash
terraform init
terraform plan
terraform apply
# Type: yes
```

### 6. Get Outputs
```bash
terraform output instance_public_ip
# Save this IP for Ansible!
```

---

## 📝 Step-by-Step (For Beginners)

**Read the full guide:** [TERRAFORM_SETUP_GUIDE.md](TERRAFORM_SETUP_GUIDE.md)

It includes:
- ✅ Detailed AWS account setup
- ✅ IAM user creation with screenshots
- ✅ Every command explained
- ✅ Troubleshooting section
- ✅ Cost estimates
- ✅ Security best practices

---

## 🔍 Verify Success

After `terraform apply`, you should see:
```
Apply complete! Resources: 10 added, 0 changed, 0 destroyed.

Outputs:
instance_public_ip = "54.123.45.67"
ssh_command = "ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@54.123.45.67"
```

Test SSH connection:
```bash
ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@YOUR_IP
```

---

## 📊 What Was Created?

```
AWS Resources (10 total):
├── VPC - Your private network
├── Internet Gateway - Internet access
├── Subnet - Network segment
├── Route Table - Traffic routing
├── Security Group - Firewall
│   ├── Port 22 (SSH)
│   ├── Port 80 (HTTP)
│   ├── Port 5000 (Backend)
│   ├── Port 5173 (Frontend)
│   └── Port 3306 (MySQL)
├── EC2 Instance - Ubuntu 22.04 server
└── Elastic IP - Static public IP
```

---

## 🎯 Important Values to Save

After Terraform completes, save these:

| Value | Where to Find | Needed For |
|-------|---------------|------------|
| Public IP | terraform output | Ansible, browser access |
| Key file path | ~/.ssh/travel-bucket-key.pem | Ansible SSH |
| Key name | travel-bucket-key | Ansible config |

---

## 🛠️ Useful Commands

```bash
# Show all outputs
terraform output

# Get specific output
terraform output instance_public_ip

# Show current state
terraform show

# List all resources
terraform state list

# SSH to instance
ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@$(terraform output -raw instance_public_ip)

# Destroy everything (when done)
terraform destroy
```

---

## 🐛 Common Issues

### "Error: No valid credential sources found"
```bash
aws configure
# Re-enter credentials
```

### "Error: InvalidKeyPair.NotFound"
- Key name in terraform.tfvars doesn't match AWS
- Check AWS Console → EC2 → Key Pairs

### "Permission denied (publickey)"
```bash
chmod 400 ~/.ssh/travel-bucket-key.pem
```

### Can't connect to instance
- Wait 2-3 minutes after creation
- Check security group allows your IP

---

## 💰 Cost

**Free Tier (12 months):**
- 750 hours/month t2.micro = FREE
- 1 instance running 24/7 = FREE

**After Free Tier:**
- t2.micro = ~$8.50/month
- Can destroy when not using

---

## ⏭️ Next Steps

1. ✅ Terraform complete (EC2 running)
2. ⏭️ Next: Set up Ansible (deploy app)
3. ⏭️ Then: Update Jenkinsfile (automate everything)

---

## 📞 Need Help?

See full guide: [TERRAFORM_SETUP_GUIDE.md](TERRAFORM_SETUP_GUIDE.md)

Includes:
- Screenshots
- Detailed troubleshooting
- Security best practices
- Cost breakdown
- AWS Console navigation

