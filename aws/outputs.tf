output "environment" {
	description = "Environment name"
	value       = local.environment
}

output "backend_public_ip" {
	description = "Public IP of the backend EC2 instance"
	value       = aws_instance.backend.public_ip
}

output "backend_url" {
	description = "Backend API URL"
	value       = "http://${aws_instance.backend.public_ip}:${var.backend_port}"
}

output "backend_socket_url" {
	description = "Backend Socket.io URL"
	value       = "http://${aws_instance.backend.public_ip}:5001"
}

output "rds_endpoint" {
	description = "RDS endpoint address"
	value       = aws_db_instance.postgres.endpoint
	sensitive   = true
}

output "rds_database_name" {
	description = "RDS database name"
	value       = aws_db_instance.postgres.db_name
}

output "rds_port" {
	description = "RDS database port"
	value       = aws_db_instance.postgres.port
}

output "vpc_id" {
	description = "VPC ID"
	value       = aws_vpc.main.id
}

output "backend_sg_id" {
	description = "Backend security group ID"
	value       = aws_security_group.backend_sg.id
}

output "db_sg_id" {
	description = "Database security group ID"
	value       = aws_security_group.db_sg.id
}
