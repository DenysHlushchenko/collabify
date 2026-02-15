#!/usr/bin/env bash

echo "Starting the application with Docker Compose..."

docker compose up --build -d

echo "Application is ready to use!"
echo "Run connect-db.sh to connect to PostgreSQL database"
