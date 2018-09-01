#!/bin/sh


docker run -it --rm --name trello-poc -v "$PWD":/usr/src/app -w /usr/src/app -p 8443:8443 trello-poc
