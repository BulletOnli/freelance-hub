#!/bin/bash

cd /home/ubuntu/freelance-hub || exit

echo "***********************************"
echo "Pulling latest images"
echo "***********************************"
docker compose --env-file .env.prod -f docker-compose.prod.yaml pull

echo "***********************************"
echo "Stop the applications"
echo "***********************************"
docker compose --env-file .env.prod -f docker-compose.prod.yaml down

echo "***********************************"
echo "Start the applications"
echo "***********************************"
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d

echo "***********************************"
echo "Application status:"
echo "***********************************"
docker compose --env-file .env.prod -f docker-compose.prod.yaml ps

echo "***********************************"
echo "Application deployed successfully!"
echo "***********************************"