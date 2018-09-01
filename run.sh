#!/bin/sh


docker run -d --rm --name panta-card-dev -v "$PWD":/usr/src/app -w /usr/src/app -p 8443:8443 panta-card-dev
