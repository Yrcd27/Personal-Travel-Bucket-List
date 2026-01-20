# 🏗️ Terraform Setup Guide - Complete Beginner's Guide

## 🎯 What We're Building

Terraform will automatically create in AWS:
```
Your AWS Account
└── Region (us-east-1)
    └── VPC (Virtual Private Cloud) - Your private network
        ├── Internet Gateway - Connects to internet
        ├── Subnet - Network segment
        ├── Route Table - Traffic routing
        ├── Security Group - Firewall rules
        │   ├── Port 22 (SSH) - For Ansible
        │   ├── Port 80 (HTTP) - For users
        │   ├── Port 5000 (Backend API)
        │   ├── Port 5173 (Frontend)
        │   └── Port 3306 (MySQL)
        ├── EC2 Instance (Ubuntu 22.04)
        │   └── 20GB Storage
        └── Elastic IP - Static public IP
```

**After Terraform runs, you'll have:**
- ✅ A running Ubuntu server in AWS
- ✅ Public IP address (like 54.123.45.67)
- ✅ Firewall configured to allow your app
- ✅ Ready for Ansible to deploy your application

---

## 📋 PREREQUISITES

### 1. AWS Account
If you don't have one:
1. Go to: https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow the signup process
4. **Important:** Free tier includes:
   - 750 hours/month of t2.micro EC2 (enough for 1 instance running 24/7)
   - 30GB of storage
   - Limited data transfer

### 2. Install Terraform

**On Windows (PowerShell as Administrator):**
```powershell
# Using Chocolatey (recommended)
choco install terraform

# Or download manually:
# 1. Go to: https://www.terraform.io/downloads
# 2. Download Windows AMD64 version
# 3. Extract terraform.exe
# 4. Move to C:\Windows\System32 or add to PATH
```

**On Linux/WSL:**
```bash
# Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

**Verify Installation:**
```bash
terraform --version
# Should show: Terraform v1.7.x
```

### 3. Install AWS CLI

**On Windows:**
```powershell
# Download and run installer from:
https://awscli.amazonaws.com/AWSCLIV2.msi
```

**On Linux/WSL:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify:**
```bash
aws --version
# Should show: aws-cli/2.x.x
```

---

## 🔑 STEP 1: Get AWS Credentials

### Create IAM User with Access Keys

1. **Log in to AWS Console:**
   - Go to: https://console.aws.amazon.com
   - Sign in with your account

2. **Create IAM User:**
   - Search for "IAM" in the search bar
   - Click "Users" in left sidebar
   - Click "Create user" button
   - **User name:** `terraform-user`
   - Click "Next"

3. **Set Permissions:**
   - Select "Attach policies directly"
   - Search and select these policies:
     - ✅ `AmazonEC2FullAccess`
     - ✅ `AmazonVPCFullAccess`
   - Click "Next"
   - Click "Create user"

4. **Create Access Keys:**
   - Click on the user you just created (`terraform-user`)
   - Go to "Security credentials" tab
   - Scroll to "Access keys" section
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Check the confirmation box
   - Click "Next"
   - Add description: "Terraform access"
   - Click "Create access key"

5. **IMPORTANT - Save These:**
   ```
   Access key ID:     AKIAXXXXXXXXXXXXXXXX
   Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```
   **⚠️ Save these NOW! Secret key shown only once!**

---

## 🔐 STEP 2: Configure AWS Credentials

### Method 1: Using AWS CLI (Recommended)

```bash
aws configure

# You'll be prompted:
AWS Access Key ID [None]: AKIAXXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

This creates `~/.aws/credentials` file with your credentials.

### Method 2: Manual File Creation

Create file: `~/.aws/credentials`
```ini
[default]
aws_access_key_id = AKIAXXXXXXXXXXXXXXXX
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Create file: `~/.aws/config`
```ini
[default]
region = us-east-1
output = json
```

**Verify Configuration:**
```bash
aws sts get-caller-identity

# Should show your AWS account info:
# {
#     "UserId": "AIDAXXXXXXXXXXXXXXXXX",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/terraform-user"
# }
```

---

## 🔑 STEP 3: Create SSH Key Pair

This key allows Ansible to connect to your EC2 instance.

### In AWS Console:

1. **Go to EC2:**
   - Search for "EC2" in AWS Console
   - Click "EC2" service

2. **Create Key Pair:**
   - In left sidebar, scroll to "Network & Security"
   - Click "Key Pairs"
   - Click "Create key pair" (orange button)
   - **Name:** `travel-bucket-key` (remember this name!)
   - **Key pair type:** RSA
   - **Private key file format:** 
     - `.pem` for Linux/Mac/WSL
     - `.ppk` for Windows PuTTY
   - Click "Create key pair"

3. **File Downloads Automatically:**
   - Save to: `~/.ssh/travel-bucket-key.pem`
   - Or on Windows: `C:\Users\YourName\.ssh\travel-bucket-key.pem`

4. **Set Correct Permissions (Linux/WSL only):**
   ```bash
   chmod 400 ~/.ssh/travel-bucket-key.pem
   ```

**Remember the key name:** `travel-bucket-key` (you'll use this in terraform.tfvars)

---

## ⚙️ STEP 4: Configure Terraform Variables

### Create your terraform.tfvars file:

```bash
# Navigate to terraform directory
cd f:/5_Sem_Projects/DevOps_Project/Personal-Travel-Bucket-List/terraform

# Copy example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
# On Windows: notepad terraform.tfvars
# On Linux: nano terraform.tfvars
```

### Fill in terraform.tfvars:

```hcl
# AWS Configuration
aws_region = "us-east-1"  # Or your preferred region

# Project Configuration
environment  = "dev"
project_name = "travel-bucket"

# EC2 Configuration
instance_type = "t2.micro"  # Free tier
key_name      = "travel-bucket-key"  # Your key pair name (NO .pem extension!)

# Security - SSH Access
# Get your IP: curl ifconfig.me
allowed_ssh_ips = ["0.0.0.0/0"]  # Open to all (change to your IP for security)
```

**Important:**
- `key_name` should be JUST the name, not the full path
- Example: `travel-bucket-key` NOT `travel-bucket-key.pem`
- Must match the key pair name in AWS

---

## 🚀 STEP 5: Run Terraform (First Time)

Now the exciting part - let's build your infrastructure!

### Navigate to terraform directory:
```bash
cd f:/5_Sem_Projects/DevOps_Project/Personal-Travel-Bucket-List/terraform
```

### Step 5A: Initialize Terraform
```bash
terraform init
```

**What this does:**
- Downloads AWS provider plugin
- Sets up backend
- Prepares working directory

**Expected output:**
```
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 5.0"...
- Installing hashicorp/aws v5.x.x...
- Installed hashicorp/aws v5.x.x

Terraform has been successfully initialized!
```

### Step 5B: Format Code (Optional)
```bash
terraform fmt
```
Automatically formats your Terraform files.

### Step 5C: Validate Configuration
```bash
terraform validate
```

**Expected output:**
```
Success! The configuration is valid.
```

If you see errors, check:
- terraform.tfvars has correct values
- key_name matches your AWS key pair
- AWS credentials are configured

### Step 5D: Preview Changes (Dry Run)
```bash
terraform plan
```

**What this does:**
- Shows what Terraform will create
- NO actual changes yet
- Like a preview

**Expected output (simplified):**
```
Terraform will perform the following actions:

  # aws_eip.app_server will be created
  + resource "aws_eip" "app_server" {
      + public_ip = (known after apply)
    }

  # aws_instance.app_server will be created
  + resource "aws_instance" "app_server" {
      + ami           = "ami-0c55b159cbfafe1f0"
      + instance_type = "t2.micro"
    }

  # ... (more resources)

Plan: 10 to add, 0 to change, 0 to destroy.
```

**Read carefully!** This shows:
- 10 resources will be created
- Instance type (t2.micro)
- Region (us-east-1)

### Step 5E: Apply Changes (Build Infrastructure!)
```bash
terraform apply
```

**You'll be asked for confirmation:**
```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

Type: `yes` and press Enter

**What happens now:**
1. Terraform creates VPC (~10 seconds)
2. Creates subnet, route table (~15 seconds)
3. Creates security group (~10 seconds)
4. Launches EC2 instance (~60 seconds)
5. Assigns Elastic IP (~5 seconds)

**Total time:** ~2-3 minutes

**Expected output:**
```
aws_vpc.main: Creating...
aws_vpc.main: Creation complete after 3s
aws_internet_gateway.main: Creating...
aws_subnet.public: Creating...
aws_security_group.app_server: Creating...
... (more creation messages)

Apply complete! Resources: 10 added, 0 changed, 0 destroyed.

Outputs:

instance_id = "i-0123456789abcdef0"
instance_public_ip = "54.123.45.67"
instance_public_dns = "ec2-54-123-45-67.compute-1.amazonaws.com"
ssh_command = "ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@54.123.45.67"
application_url = "http://54.123.45.67:5173"
api_url = "http://54.123.45.67:5000"
```

**🎉 CONGRATULATIONS! Your EC2 server is running!**

---

## ✅ STEP 6: Verify It Works

### Test SSH Connection:

```bash
# Use the ssh_command from output
ssh -i ~/.ssh/travel-bucket-key.pem ubuntu@54.123.45.67

# Replace 54.123.45.67 with YOUR instance's IP
```

**If successful:**
```
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 6.2.0-1009-aws x86_64)

ubuntu@ip-10-0-1-123:~$
```

You're now inside your EC2 instance! Type `exit` to disconnect.

### Check in AWS Console:

1. Go to EC2 Dashboard
2. Click "Instances" in sidebar
3. You should see: `travel-bucket-server` (running)
4. Check its public IP matches Terraform output

---

## 📊 Understanding Terraform Outputs

After `terraform apply`, you'll see these important values:

| Output | Example | What It's For |
|--------|---------|---------------|
| `instance_id` | i-0123456789abcdef0 | AWS identifier for your EC2 |
| `instance_public_ip` | 54.123.45.67 | Your server's IP address |
| `ssh_command` | ssh -i ~/.ssh/... | Command to connect to server |
| `application_url` | http://54.123.45.67:5173 | Where users access your app |
| `api_url` | http://54.123.45.67:5000 | Your backend API endpoint |

**Save the public IP!** You'll need it for Ansible.

---

## 🎓 Understanding the Files

### **provider.tf**
- Configures AWS connection
- Sets Terraform version
- Adds default tags to all resources

### **variables.tf**
- Defines input parameters
- Like function arguments
- Has default values

### **terraform.tfvars**
- Your actual values
- NOT committed to Git (has .gitignore)
- Contains potentially sensitive data

### **main.tf**
- The main code
- Creates all AWS resources
- VPC, subnet, EC2, security groups, etc.

### **outputs.tf**
- Values displayed after creation
- Used by Jenkins/Ansible
- EC2 IP, DNS, URLs, etc.

---

## 🔄 Common Terraform Commands

```bash
# Initialize (first time only)
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply

# Apply without confirmation prompt
terraform apply -auto-approve

# Show current state
terraform show

# List resources
terraform state list

# Get specific output
terraform output instance_public_ip

# Destroy everything (careful!)
terraform destroy

# Destroy without confirmation
terraform destroy -auto-approve
```

---

## 💰 Cost Estimation

**Free Tier (First 12 months):**
- ✅ 750 hours/month of t2.micro (FREE)
- ✅ 30GB storage (FREE)
- ✅ 15GB data transfer out (FREE)

**After Free Tier / If using t2.small:**
- t2.micro: ~$8.50/month
- t2.small: ~$17/month
- t2.medium: ~$34/month
- Data transfer: $0.09/GB after 15GB

**Recommendation:** Use t2.micro for learning, upgrade later if needed.

---

## 🐛 Troubleshooting

### Error: "Error launching source instance: VpcLimitExceeded"
**Solution:** You've reached VPC limit. Delete unused VPCs:
```bash
# List VPCs
aws ec2 describe-vpcs
# Delete unused ones in AWS Console
```

### Error: "UnauthorizedOperation"
**Solution:** Your IAM user needs more permissions. Add:
- AmazonEC2FullAccess
- AmazonVPCFullAccess

### Error: "Invalid key pair"
**Solution:** 
- Check key_name in terraform.tfvars matches AWS key pair name EXACTLY
- Don't include .pem extension in terraform.tfvars

### Error: "Failed to connect"
**Solution:**
- Wait 2-3 minutes after instance creation
- Check security group allows SSH (port 22)
- Verify key permissions: `chmod 400 ~/.ssh/key.pem`

### Error: "No valid credential sources found"
**Solution:**
```bash
aws configure
# Re-enter your AWS credentials
```

---

## 🔒 Security Best Practices

### 1. Restrict SSH Access
Instead of `allowed_ssh_ips = ["0.0.0.0/0"]`, use your IP:
```bash
# Get your IP
curl ifconfig.me

# In terraform.tfvars:
allowed_ssh_ips = ["203.0.113.45/32"]  # YOUR IP
```

### 2. Never Commit Credentials
Already done! `.gitignore` prevents:
- terraform.tfvars
- *.tfstate files
- AWS credentials

### 3. Use Strong Key Pairs
- Keep .pem file secure
- Never share it
- Set correct permissions (400)

### 4. Enable CloudTrail (Optional)
Logs all AWS API calls for auditing.

---

## 🧹 Cleanup (When Done Testing)

To delete everything and avoid charges:

```bash
cd terraform/
terraform destroy

# Confirm with: yes
```

**This will delete:**
- ✅ EC2 instance
- ✅ Elastic IP
- ✅ Security group
- ✅ Subnet
- ✅ Route tables
- ✅ Internet Gateway
- ✅ VPC

**Takes 2-3 minutes**

**Cost if you forget:** ~$0.28/day for t2.micro

---

## ✅ Verification Checklist

Before proceeding to Ansible, verify:

- ✅ Terraform installed: `terraform --version`
- ✅ AWS CLI installed: `aws --version`
- ✅ AWS credentials configured: `aws sts get-caller-identity`
- ✅ SSH key pair created in AWS
- ✅ terraform.tfvars file created with correct values
- ✅ `terraform init` ran successfully
- ✅ `terraform plan` shows 10 resources to create
- ✅ `terraform apply` completed successfully
- ✅ EC2 instance is running (check AWS Console)
- ✅ Can SSH to instance
- ✅ Public IP noted for Ansible

---

## 📖 What's Next?

Now that you have infrastructure:

**Current State:**
- ✅ EC2 server running in AWS
- ✅ Public IP assigned
- ✅ Firewall configured
- ❌ Application NOT deployed yet

**Next Step: Ansible**
- Install Docker on EC2
- Deploy your application containers
- Configure everything automatically

**After Ansible:**
- Update Jenkinsfile to trigger Terraform + Ansible
- Complete CI/CD pipeline!

---

## 🎯 Summary

**What you accomplished:**
1. ✅ Set up AWS account and credentials
2. ✅ Created IAM user for Terraform
3. ✅ Generated SSH key pair
4. ✅ Wrote Terraform configuration (I created this for you)
5. ✅ Ran Terraform to provision infrastructure
6. ✅ Created a live EC2 server in AWS

**Infrastructure created:**
- Virtual Private Cloud (VPC)
- Subnet and networking
- Security Group (firewall)
- EC2 Instance (Ubuntu server)
- Elastic IP (static IP address)

**Next:** We'll use Ansible to deploy your application to this server!

