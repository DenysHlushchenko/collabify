#!/usr/bin/env bash

# Load .env file
if [[ -f .env ]]; then
    set -a
    source .env
    set +a
else 
    echo "Error: .env file not found in $(pwd)"
    exit 1
fi

# Check required variables for database connection
if [ -z "$DATABASE" ]; then
    echo "Error: DATABASE is not set in .env"
    exit 1
fi

if [ -z "$DATABASE_HOST" ]; then
    echo "Error: DATABASE_HOST is not set in .env"
    exit 1
fi

if [ -z "$DATABASE_PORT" ]; then
    echo "Error: DATABASE_PORT is not set in .env"
    exit 1
fi

if [ -z "$DATABASE_USERNAME" ]; then
    echo "Error: DATABASE_USERNAME is not set in .env"
    exit 1
fi

if [ -z "$DATABASE_PASSWORD" ]; then
    echo "Error: DATABASE_PASSWORD is not set in .env"
    exit 1
fi

docker compose exec database psql -U "$DATABASE_USERNAME" -d "$DATABASE"
