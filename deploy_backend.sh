#!/bin/bash
set -e

# Install Docker if not present
if ! command -v docker >/dev/null 2>&1; then
    echo "Installing Docker..."
    sudo apt-get update -y
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
else
    echo "Docker already installed."
fi

# Install Docker Compose if not present
if ! command -v docker-compose >/dev/null 2>&1; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.31.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed."
fi

# Login to GHCR and pull the latest image
echo "Logging in to GHCR..."
echo "$GHCR_TOKEN" | sudo docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
sudo docker pull "$IMAGE"
echo "Pulling backend image completed!"

# Stop and remove existing backend container if running
sudo docker stop collabify-backend 2>/dev/null || true
sudo docker rm collabify-backend 2>/dev/null || true

# Run the backend container
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --force-recreate

echo "Backend deployment completed!"