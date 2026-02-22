#!/bin/bash
yum update -y

# Install Docker
amazon-linux-extras install docker -y
yum install docker -y

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install AWS CLI v2 (if not present)
yum install -y aws-cli

# Login to ECR
aws ecr get-login-password --region ${aws_region} \
| docker login --username AWS --password-stdin ${ecr_repo_url}

# Pull image
docker pull ${ecr_repo_url}

# Run container
docker run -d -p ${app_port}:${app_port} ${ecr_repo_url}