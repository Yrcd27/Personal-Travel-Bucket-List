#!/bin/bash
# Stop and remove all containers
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
echo "All containers stopped and removed"