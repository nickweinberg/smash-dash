#!/bin/bash

docker run --name smash-db -d -e MYSQL_ROOT_PASSWORD=123 -p 3306:3306 mysql:latest  

