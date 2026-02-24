#!/bin/bash
# purpose:
# - runs once at instance boot via cloud-init
# - installs Docker
# - logs into ECR using the INSTANCE ROLE (not hard-coded keys)
# - pulls the image and runs the container

# terraform fills in:
#   ${aws_region}, ${ecr_registry}, ${ecr_image}, ${host_port}, ${container_port}
set -euxo pipefail

yum update -y

# install Docker on Amazon Linux 2
amazon-linux-extras install docker -y

# install AWS CLI (often present already; ok to reinstall for demo)
yum install -y awscli

# start Docker
systemctl enable docker
systemctl start docker

# adding ec2-user to docker group is useful for interactive SSH later and it doesn't affect this script run (still running as root)
usermod -aG docker ec2-user || true

# login to ECR (registry host, not repo:tag)
aws ecr get-login-password --region "${aws_region}" \
  | docker login --username AWS --password-stdin "${ecr_registry}"

# pull exact image reference (repo + tag)
docker pull "${ecr_image}"

# replace any existing container and run with restart policy
docker rm -f animal-quiz || true

docker run -d \
  --name animal-quiz \
  --restart unless-stopped \
  -p "${host_port}:${container_port}" \
  "${ecr_image}"
