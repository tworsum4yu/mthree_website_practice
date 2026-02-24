# purpose:
# - print useful info after apply (public IP, URL)
output "public_ip" {
  value       = aws_instance.docker_server.public_ip
  description = "Public IP of the EC2 instance"
}

output "app_url" {
  value       = "http://${aws_instance.docker_server.public_ip}:${var.host_port}"
  description = "URL to reach the containerised website over the internet"
}
