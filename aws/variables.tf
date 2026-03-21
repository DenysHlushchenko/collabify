variable "environment" {
  description = "Environment name (acceptance/production)"
  type        = string
  validation {
    condition     = contains(["acceptance", "production"], var.environment)
    error_message = "Environment must be either 'acceptance' or 'production'."
  }
}

variable "aws_region" {
  description = "AWS region to deploy infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_1_cidr" {
  description = "CIDR block for private subnet 1"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_2_cidr" {
  description = "CIDR block for private subnet 2"
  type        = string
  default     = "10.0.3.0/24"
}

variable "backend_port" {
  description = "Port exposed by the backend application"
  type        = number
  default     = 5000
}

variable "backend_ingress_cidrs" {
  description = "CIDR blocks allowed to reach backend port"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "ssh_ingress_cidr" {
  description = "Single CIDR allowed to SSH into EC2"
  type        = string
  default     = "0.0.0.0/0"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for backend server"
  type        = string
  default     = "t3.micro"
}

variable "ec2_key_name" {
  description = "Existing AWS EC2 key pair name for SSH"
  type        = string
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage size (GB) for RDS"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL master password"
  type        = string
  sensitive = true
}

variable "db_name" {
  description = "Initial PostgreSQL database name (alphanumeric only, no hyphens)"
  type        = string
  default     = "collabifydb"
}
