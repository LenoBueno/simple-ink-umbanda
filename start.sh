#!/bin/sh

# Start Node.js API with resource limits
cd /usr/share/nginx/api
node --max-old-space-size=256 server.js &

# Start Nginx in foreground
nginx -g "daemon off;"