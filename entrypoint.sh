#!/bin/bash

# Copy container-built node_modules.
# From: https://stackoverflow.com/a/52092711

cp -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/
# exec npm run build
exec npm run start-docker
