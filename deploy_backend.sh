#!/bin/bash
set -e

# Install Docker if not present
if ! command -v docker >/dev/null 2>&1; then
    echo "Installing Docker..."
    sudo dnf update -y
    sudo dnf install docker -y
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user
else
    echo "Docker already installed."
fi

# Install Docker Compose plugin if not present
if ! sudo docker compose version >/dev/null 2>&1; then
    echo "Installing Docker Compose plugin..."
    sudo mkdir -p /usr/local/lib/docker/cli-plugins
    sudo curl -SL "https://github.com/docker/compose/releases/download/v2.31.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/lib/docker/cli-plugins/docker-compose
    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
else
    echo "Docker Compose already installed."
fi

# Login to GHCR and pull the latest image
echo "Logging in to GHCR..."
echo "$GHCR_TOKEN" | sudo docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
sudo docker pull "$IMAGE"
echo "Pulling image: $IMAGE completed!"

# Run the backend container
sudo IMAGE="$IMAGE" docker compose -f docker-compose.prod.yml --env-file .env.production up -d

echo "Backend deployment completed!"