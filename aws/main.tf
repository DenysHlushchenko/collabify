terraform {
	required_version = ">= 1.5.0"

	required_providers {
		aws = {
			source  = "hashicorp/aws" // Official AWS provider from HashiCorp.
			version = "~> 5.0"
		}
	}
}

provider "aws" {
	region = var.aws_region
}

// Import variables from variables.tf
locals {
	project_name = "collabify"
	common_tags = {
		Project   = local.project_name
		ManagedBy = "terraform"
	}
}

// Data sources to fetch dynamic information about AWS resources
data "aws_availability_zones" "available" {
	state = "available"
}

// Fetch latest Amazon Linux 2023 AMI
data "aws_ami" "amazon_linux_2023" {
	most_recent = true
	owners      = ["amazon"]

	filter {
		name   = "name"
		values = ["al2023-ami-*-x86_64"] // Amazon Linux 2023 AMI pattern
	}

	filter {
		name   = "virtualization-type"
		values = ["hvm"] // HVM virtualization for EC2
	}
}

resource "aws_vpc" "main" {
	cidr_block           = var.vpc_cidr
	enable_dns_hostnames = true
	enable_dns_support   = true

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-vpc"
	})
}

// Create public subnet for EC2 instance and NAT Gateway
resource "aws_subnet" "public" {
	vpc_id                  = aws_vpc.main.id
	cidr_block              = var.public_subnet_cidr
	availability_zone       = data.aws_availability_zones.available.names[0]
	map_public_ip_on_launch = true

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-public-subnet"
	})
}

// Create two private subnets in different AZs for high availability of RDS
resource "aws_subnet" "private_1" {
	vpc_id            = aws_vpc.main.id
	cidr_block        = var.private_subnet_1_cidr
	availability_zone = data.aws_availability_zones.available.names[1]

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-private-subnet-1"
	})
}

resource "aws_subnet" "private_2" {
	vpc_id            = aws_vpc.main.id
	cidr_block        = var.private_subnet_2_cidr
	availability_zone = data.aws_availability_zones.available.names[0]

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-private-subnet-2"
	})
}

// Create Internet Gateway for public subnet
resource "aws_internet_gateway" "igw" {
	vpc_id = aws_vpc.main.id

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-igw"
	})
}

// Create NAT Gateway in public subnet for private subnet internet access
resource "aws_route_table" "public" {
	vpc_id = aws_vpc.main.id

	route {
		cidr_block = "0.0.0.0/0" // Route all internet-bound traffic
		gateway_id = aws_internet_gateway.igw.id
	}

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-public-rt"
	})
}

// Associate public subnet with public route table
resource "aws_route_table_association" "public" {
	subnet_id      = aws_subnet.public.id
	route_table_id = aws_route_table.public.id
}

// Create Elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
	domain = "vpc"

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-nat-eip"
	})
}

// Create NAT Gateway in public subnet
resource "aws_nat_gateway" "nat" {
	allocation_id = aws_eip.nat_eip.id
	subnet_id     = aws_subnet.public.id
	depends_on    = [aws_internet_gateway.igw]

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-nat-gw"
	})
}

// Create private route table that routes internet-bound traffic through NAT Gateway
resource "aws_route_table" "private" {
	vpc_id = aws_vpc.main.id

	route {
		cidr_block     = "0.0.0.0/0" // Route all internet-bound traffic
		nat_gateway_id = aws_nat_gateway.nat.id
	}

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-private-rt"
	})
}

// Associate private subnets with private route table
resource "aws_route_table_association" "private_1" {
	subnet_id      = aws_subnet.private_1.id
	route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_2" {
	subnet_id      = aws_subnet.private_2.id
	route_table_id = aws_route_table.private.id
}

// Create security groups for backend EC2 and RDS PostgreSQL
resource "aws_security_group" "backend_sg" {
	name        = "${local.project_name}-backend-sg"
	description = "Security group for Collabify backend EC2"
	vpc_id      = aws_vpc.main.id

	ingress {
		from_port   = var.backend_port
		to_port     = var.backend_port
		protocol    = "tcp"
		cidr_blocks = var.backend_ingress_cidrs
	}

	ingress {
        // Allow SSH access to EC2 from specified CIDR
		from_port   = 22
		to_port     = 22
		protocol    = "tcp"
		cidr_blocks = [var.ssh_ingress_cidr]
	}

	egress {
        // Allow all outbound traffic from EC2
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-backend-sg"
	})
}

// Security group for RDS that only allows inbound traffic from backend EC2 security group
resource "aws_security_group" "db_sg" {
	name        = "${local.project_name}-db-sg"
	description = "Security group for Collabify PostgreSQL RDS"
	vpc_id      = aws_vpc.main.id

	ingress {
        // Allow PostgreSQL access from backend EC2 security group
		from_port       = 5432
		to_port         = 5432
		protocol        = "tcp"
		security_groups = [aws_security_group.backend_sg.id]
	}

	egress {
        // Allow all outbound traffic from RDS
		from_port   = 0
		to_port     = 0
		protocol    = "-1"
		cidr_blocks = ["0.0.0.0/0"]
	}

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-db-sg"
	})
}

// Create RDS subnet group for the private subnets
resource "aws_db_subnet_group" "main" {
	name       = "${local.project_name}-db-subnet-group"
	subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-db-subnet-group"
	})
}

// Create RDS PostgreSQL instance in private subnets
resource "aws_db_instance" "postgres" {
	identifier             = "${local.project_name}-db"
	engine                 = "postgres"
	engine_version         = "16"
	instance_class         = var.db_instance_class
	allocated_storage      = var.db_allocated_storage
	db_name                = var.db_name
	username               = var.db_username
	password               = var.db_password
	db_subnet_group_name   = aws_db_subnet_group.main.name
	vpc_security_group_ids = [aws_security_group.db_sg.id]
	skip_final_snapshot    = true
	publicly_accessible    = false
	multi_az               = false

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-postgres"
	})
}

// Create EC2 instance for backend application in public subnet
resource "aws_instance" "backend" {
	ami                         = data.aws_ami.amazon_linux_2023.id
	instance_type               = var.ec2_instance_type
	subnet_id                   = aws_subnet.public.id
	associate_public_ip_address = true
	vpc_security_group_ids      = [aws_security_group.backend_sg.id]
	key_name                    = var.ec2_key_name

	tags = merge(local.common_tags, {
		Name = "${local.project_name}-backend"
	})
}

output "backend_public_ip" {
	value = aws_instance.backend.public_ip
}

output "backend_url" {
	value = "http://${aws_instance.backend.public_ip}:${var.backend_port}"
}

output "rds_endpoint" {
	value = aws_db_instance.postgres.endpoint
}

output "rds_database_name" {
	value = aws_db_instance.postgres.db_name
}
