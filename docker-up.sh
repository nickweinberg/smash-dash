#!/bin/sh

docker run --name smash-db -d \
  -e MYSQL_ROOT_PASSWORD=123 \
  -e MYSQL_DATABASE=smash -e MYSQL_USER=nick -e MYSQL_PASSWORD=123 \
  -p 3306:3306 \
  mysql:latest  

echo "Waiting for DB to start up..."  
docker exec smash-db mysqladmin --silent --wait=30 -unick -p123 ping


echo "Setting up initial data..."  
docker exec -i smash-db mysql -unick -p123 smash < setup.sql  

