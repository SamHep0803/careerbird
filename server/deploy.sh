#!/bin/sh

echo What should the version be?
read -r VERSION

echo "version: $VERSION"

docker buildx build --platform linux/amd64 --push -t sharifworth/rabri:"$VERSION" .

ssh root@167.71.225.90 "docker pull sharifworth/rabri:$VERSION && docker tag sharifworth/rabri:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
