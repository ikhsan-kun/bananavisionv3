#!/bin/bash
# =============================================================================
# BananaVision — Deploy Script
# Dijalankan setiap kali ada update kode
#
# Usage (dari mesin lokal ke server):
#   ssh user@server "cd /opt/bananavision && git pull && bash scripts/deploy.sh"
#
# Atau jalankan langsung di server:
#   cd /opt/bananavision && bash scripts/deploy.sh
# =============================================================================

set -e

APP_DIR="/opt/bananavision"
VENV="$APP_DIR/venv"

echo "======================================================"
echo "  BananaVision Deploy - $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# ─── 1. Pull latest code ──────────────────────────────────────────────────────
echo ""
echo "🔄 [1/5] Pulling latest code..."
cd $APP_DIR
git pull origin main
echo "✅ Code updated"

# ─── 2. Install/Update Node.js dependencies ──────────────────────────────────
echo ""
echo "📦 [2/5] Installing Node.js dependencies..."
cd $APP_DIR/backend
npm ci --production
echo "✅ Node.js dependencies updated"

# ─── 3. Install/Update Python dependencies ───────────────────────────────────
echo ""
echo "🐍 [3/5] Updating Python dependencies..."
source $VENV/bin/activate
pip install -q -r $APP_DIR/python/requirements.txt
deactivate
echo "✅ Python dependencies updated"

# ─── 4. Create model storage dir if missing ──────────────────────────────────
echo ""
echo "📁 [4/5] Ensuring model storage directory..."
mkdir -p /opt/bananavision/models
echo "✅ Model storage: /opt/bananavision/models"

# ─── 5. Restart services ─────────────────────────────────────────────────────
echo ""
echo "🔄 [5/5] Restarting services..."

if pm2 list | grep -q "bananavision-backend"; then
    pm2 reload bananavision-backend
    echo "✅ Node.js backend reloaded"
else
    pm2 start $APP_DIR/ecosystem.config.js --env production --only bananavision-backend
    echo "✅ Node.js backend started"
fi

if pm2 list | grep -q "bananavision-python"; then
    pm2 restart bananavision-python
    echo "✅ Python backend restarted"
else
    pm2 start $APP_DIR/ecosystem.config.js --env production --only bananavision-python
    echo "✅ Python backend started"
fi

pm2 save

echo ""
echo "======================================================"
echo "  ✅ Deploy complete!"
echo "======================================================"
echo ""
echo "📊 Status:"
pm2 list
echo ""
echo "🔍 Logs (Ctrl+C untuk keluar):"
echo "   pm2 logs bananavision-backend --lines 20"
echo "   pm2 logs bananavision-python --lines 20"
