# purpose:
# - central place for inputs
# - keeps main.tf clean

variable "name_prefix" {
  description = "Prefix for naming AWS resources (tags/roles/sg)"
  type        = string
  default     = "animal-quiz"
}

variable "aws_region" {
  description = "AWS region to deploy into (must match your ECR region)"
  type        = string
}

variable "aws_account_id" {
  description = "AWS account ID that owns the ECR registry (e.g., 108174090253)"
  type        = string
}

variable "ecr_repository" {
  description = "ECR repository name (not the full URL). Example: mthree-peregrine"
  type        = string
}

variable "image_tag" {
  description = "Image tag to deploy (e.g., latest or a git sha)"
  type        = string
  default     = "latest"
}

variable "instance_type" {
  description = "EC2 instance size. t2.micro/t3.micro is typical for free tier demos"
  type        = string
  default     = "t3.micro"
}

variable "host_port" {
  description = "Port exposed on the EC2 instance (internet-facing)"
  type        = number
  default     = 8080
}

variable "container_port" {
  description = "Port inside the container that the app listens on"
  type        = number
  default     = 8080
}

variable "ssh_ingress_cidr" {
  description = "CIDR allowed to SSH (recommended: your public IP /32)"
  type        = string
  # safer default: block SSH unless explicitly set
  default     = "127.0.0.1/32"
}

variable "key_name" {
  description = "Optional: existing EC2 key pair name for SSH access (leave empty to disable)"
  type        = string
  default     = ""
}
