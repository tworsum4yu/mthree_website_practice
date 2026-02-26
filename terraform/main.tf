terraform {
  # pin Terraform version to avoid "works on my machine"
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# network: use the default VPC/subnet (in prod you'd create your own)
data "aws_vpc" "default" {
  default = true
}

# pick one default subnet (first one returned)
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_caller_identity" "current" {}

# security group: allow inbound SSH and app port
resource "aws_security_group" "app_sg" {
  name        = "${var.name_prefix}-sg"
  description = "Allow SSH and app traffic"
  vpc_id      = data.aws_vpc.default.id

  # SSH: lock down to your IP/CIDR
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ingress_cidr]
  }

  # app port: open to the world for the "bonus points" requirement (prod: restrict to a load balancer or known CIDRs)
  ingress {
    description = "App port"
    from_port   = var.host_port
    to_port     = var.host_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # egress: allow all outbound (needed to reach ECR endpoints)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name_prefix}-sg"
  }
}

# IAM: EC2 instance role that can pull from ECR
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2_role" {
  name               = "${var.name_prefix}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

# minimal permissions needed to pull images from ECR
data "aws_iam_policy_document" "ecr_pull" {
  statement {
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  statement {
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = [
      # scope to the specific repository if you can
      "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/${var.ecr_repository}"
    ]
  }
}

resource "aws_iam_policy" "ecr_pull" {
  name   = "${var.name_prefix}-ecr-pull"
  policy = data.aws_iam_policy_document.ecr_pull.json
}

resource "aws_iam_role_policy_attachment" "ecr_pull_attach" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.ecr_pull.arn
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.name_prefix}-instance-profile"
  role = aws_iam_role.ec2_role.name
}

# AMI: Amazon Linux 2 (matches yum/amazon-linux-extras usage)
data "aws_ami" "al2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp*"]
  }
}

# locals: build ECR registry and image reference
locals {
  ecr_registry = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  ecr_image    = "${local.ecr_registry}/${var.ecr_repository}:${var.image_tag}"
}

# EC2 instance
resource "aws_instance" "docker_server" {
  ami                    = data.aws_ami.al2.id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  associate_public_ip_address = true

  # instance can call ECR APIs
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  # optional: attach a key so you can SSH in to debug
  # without SSH, set key_name = "" and rely on logs
  key_name = var.key_name != "" ? var.key_name : null

  # templatefile renders user_data.sh and substitutes the variables which is how ${aws_region} etc becomes real values inside the script
  user_data = templatefile("${path.module}/user_data.sh", {
    aws_region     = var.aws_region
    ecr_registry   = local.ecr_registry
    ecr_image      = local.ecr_image
    host_port      = var.host_port
    container_port = var.container_port
  })

  tags = {
    Name = "${var.name_prefix}-ec2"
    depends_on = [
      aws_iam_role_policy_attachment.ecr_pull_attach
    ]
  }
}