#!/bin/bash
set -e

APP_DIR="/home/project/bananavisionv3"
VENV="$APP_DIR/venv"

echo "Running BananaVision deploy..."

# 1. Update code
cd $APP_DIR
git pull origin main

# 2. Install Node.js dependencies (backend)
cd $APP_DIR/backend
npm ci --production

# 3. Build React frontend
cd $APP_DIR/frontend
npm ci
npm run build

# 4. Update Python dependencies
source $VENV/bin/activate
pip install -q -r $APP_DIR/python/requirements.txt
deactivate

# 5. Ensure required directories exist
mkdir -p /home/project/bananavisionv3/models
mkdir -p /home/project/bananavisionv3/logs

# 6. Reload nginx to pick up any config changes
nginx -t && systemctl reload nginx || echo "Nginx reload failed, check config manually"

# 7. Restart services with PM2
if pm2 list | grep -q "bananavision-backend"; then
    pm2 reload bananavision-backend
else
    pm2 start $APP_DIR/ecosystem.config.js --env production --only bananavision-backend
fi

if pm2 list | grep -q "bananavision-python"; then
    pm2 restart bananavision-python
else
    pm2 start $APP_DIR/ecosystem.config.js --env production --only bananavision-python
fi

pm2 save

echo "Deploy complete."
