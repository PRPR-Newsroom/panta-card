#!/bin/sh


docker run -d --rm --name panta-card-dev -v "$PWD":/usr/src/app -w /usr/src/app -p 8181:8080 panta-card-dev
