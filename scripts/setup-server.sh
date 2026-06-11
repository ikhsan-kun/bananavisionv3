#!/bin/bash
# =============================================================================
# BananaVision — Server Setup Script
# Jalankan SEKALI saat pertama kali setup server baru
#
# Tested on: Ubuntu 22.04 LTS / 24.04 LTS
# Jalankan sebagai root atau dengan sudo
#
# Usage:
#   chmod +x scripts/setup-server.sh
#   sudo ./scripts/setup-server.sh
# =============================================================================

set -e  # Exit on any error

# ─── Config ──────────────────────────────────────────────────────────────────
APP_DIR="/opt/bananavision"
MODEL_DIR="/opt/bananavision/models"
LOG_DIR="/var/log/bananavision"
PYTHON_VERSION="3.10"
NODE_VERSION="20"
APP_USER="bananavision"

echo "======================================================"
echo "  BananaVision Server Setup"
echo "======================================================"

# ─── 1. Update & Install Dependencies ────────────────────────────────────────
echo ""
echo "📦 [1/8] Updating system packages..."
apt-get update -qq
apt-get install -y \
    git curl wget unzip \
    nginx \
    python${PYTHON_VERSION} python${PYTHON_VERSION}-venv python${PYTHON_VERSION}-dev python3-pip \
    build-essential libssl-dev \
    ufw

# ─── 2. Install Node.js ───────────────────────────────────────────────────────
echo ""
echo "📦 [2/8] Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# ─── 3. Install PM2 ──────────────────────────────────────────────────────────
echo ""
echo "📦 [3/8] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER} 2>/dev/null || \
pm2 startup systemd 2>/dev/null || true

# ─── 4. Create App User & Directories ────────────────────────────────────────
echo ""
echo "📁 [4/8] Creating app user and directories..."

# Buat user untuk app (lebih aman dari root)
if ! id "${APP_USER}" &>/dev/null; then
    useradd -r -m -d /home/${APP_USER} -s /bin/bash ${APP_USER}
    echo "✅ User '${APP_USER}' created"
fi

mkdir -p ${APP_DIR}/{backend,python,frontend}
mkdir -p ${MODEL_DIR}
mkdir -p ${LOG_DIR}

chown -R ${APP_USER}:${APP_USER} ${APP_DIR}
chown -R ${APP_USER}:${APP_USER} ${LOG_DIR}
chmod 755 ${MODEL_DIR}

echo "✅ Directories created:"
echo "   App:    ${APP_DIR}"
echo "   Models: ${MODEL_DIR}"
echo "   Logs:   ${LOG_DIR}"

# ─── 5. Setup Python Virtual Environment ─────────────────────────────────────
echo ""
echo "🐍 [5/8] Setting up Python virtual environment..."
python${PYTHON_VERSION} -m venv ${APP_DIR}/venv
source ${APP_DIR}/venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip wheel setuptools

# Install TensorFlow (CPU-only untuk server tanpa GPU)
# Untuk GPU: pip install tensorflow[and-cuda]==2.15.0
pip install \
    tensorflow-cpu==2.15.0 \
    fastapi==0.111.0 \
    uvicorn[standard]==0.30.0 \
    python-multipart==0.0.9 \
    pillow==10.3.0 \
    numpy==1.26.4 \
    python-dotenv==1.0.1 \
    httpx==0.27.0

deactivate
chown -R ${APP_USER}:${APP_USER} ${APP_DIR}/venv
echo "✅ Python virtual environment ready"

# ─── 6. Setup Nginx ──────────────────────────────────────────────────────────
echo ""
echo "🌐 [6/8] Configuring Nginx..."

# Copy nginx config (akan diisi dari repo)
if [ -f "${APP_DIR}/backend/../nginx/bananavision.conf" ]; then
    cp ${APP_DIR}/../nginx/bananavision.conf /etc/nginx/sites-available/bananavision
    ln -sf /etc/nginx/sites-available/bananavision /etc/nginx/sites-enabled/bananavision
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && echo "✅ Nginx config valid" || echo "⚠️ Nginx config error — check manually"
else
    echo "⚠️ Nginx config not found. Copy manually from repo nginx/bananavision.conf"
fi

# ─── 7. Setup Firewall (UFW) ──────────────────────────────────────────────────
echo ""
echo "🔒 [7/8] Configuring firewall..."
ufw allow ssh
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
# Port 5000 dan 8000 TIDAK dibuka — hanya accessible via Nginx reverse proxy
ufw --force enable
echo "✅ Firewall configured (SSH, HTTP, HTTPS only)"

# ─── 8. Create .env templates ────────────────────────────────────────────────
echo ""
echo "📝 [8/8] Creating .env templates..."

cat > ${APP_DIR}/backend/.env.server-template << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://USER:PASS@cluster.mongodb.net/bananavision
JWT_SECRET=GENERATE_STRONG_SECRET_HERE
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@project.iam.gserviceaccount.com
CORS_ORIGINS=http://localhost:5173,https://bananavision.vercel.app,https://YOUR_DOMAIN
ML_SERVER_URL=http://localhost:8000
MODEL_STORAGE_PATH=/opt/bananavision/models
TRUST_PROXY=1
EOF

cat > ${APP_DIR}/python/.env.server-template << 'EOF'
MODEL_TYPE=mobilenetv2
MODEL_DIR=/opt/bananavision/models
NODE_BACKEND_URL=http://localhost:5000/api
EOF

echo ""
echo "======================================================"
echo "  ✅ Server setup complete!"
echo "======================================================"
echo ""
echo "Next steps:"
echo "  1. Copy your project files to ${APP_DIR}/"
echo "  2. Copy .env.server-template to .env and fill in values"
echo "  3. Run: sudo -u ${APP_USER} bash scripts/deploy.sh"
echo "  4. Setup SSL: certbot --nginx -d YOUR_DOMAIN"
echo "  5. Start services: pm2 start ecosystem.config.js --env production"
echo "  6. Save PM2: pm2 save"
echo ""
