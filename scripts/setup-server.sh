#!/bin/bash
set -e

# Config
APP_DIR="/home/project/bananavisionv3"
MODEL_DIR="/home/project/bananavisionv3/models"
LOG_DIR="/home/project/bananavisionv3/logs"
PYTHON_VERSION="3.10"
NODE_VERSION="20"
APP_USER="www-data"

echo "Starting BananaVision server setup..."

# 1. Install system dependencies
echo "Installing system packages..."
apt-get update -qq
apt-get install -y \
    git curl wget unzip \
    nginx \
    python${PYTHON_VERSION} python${PYTHON_VERSION}-venv python${PYTHON_VERSION}-dev python3-pip \
    build-essential libssl-dev

# 2. Install Node.js
echo "Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"

# 3. Install PM2
echo "Installing PM2..."
npm install -g pm2
pm2 startup systemd -u ${APP_USER} --hp /home/${APP_USER} 2>/dev/null || \
pm2 startup systemd 2>/dev/null || true

# 4. Create directories
echo "Creating project directories..."
mkdir -p ${APP_DIR}/{backend,python,frontend}
mkdir -p ${MODEL_DIR}
mkdir -p ${LOG_DIR}
mkdir -p ${APP_DIR}/frontend/dist

chown -R ${APP_USER}:${APP_USER} ${APP_DIR}
chown -R ${APP_USER}:${APP_USER} ${LOG_DIR}
chmod 755 ${MODEL_DIR}

# 5. Setup Python Virtual Environment
echo "Setting up Python virtual environment..."
python${PYTHON_VERSION} -m venv ${APP_DIR}/venv
source ${APP_DIR}/venv/bin/activate

echo "Installing pip and dependencies..."
pip install --upgrade pip wheel setuptools
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

# 6. Configure Nginx
echo "Configuring Nginx..."
if [ -f "${APP_DIR}/nginx/bananavision.conf" ]; then
    cp ${APP_DIR}/nginx/bananavision.conf /etc/nginx/sites-available/bananavision
    ln -sf /etc/nginx/sites-available/bananavision /etc/nginx/sites-enabled/bananavision
    nginx -t && systemctl reload nginx || echo "Nginx configuration reload failed, check manually"
else
    echo "Nginx configuration file not found in repo"
fi

# 7. Create .env templates
echo "Creating .env templates..."

cat > ${APP_DIR}/backend/.env.server-template << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://USER:PASS@cluster.mongodb.net/bananavision
JWT_SECRET=GENERATE_STRONG_SECRET_HERE
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@project.iam.gserviceaccount.com
CORS_ORIGINS=http://localhost:5173,https://bananavision.ruangprojek.cloud
ML_SERVER_URL=http://localhost:8000
MODEL_STORAGE_PATH=/home/project/bananavisionv3/models
TRUST_PROXY=1
EOF

cat > ${APP_DIR}/python/.env.server-template << 'EOF'
MODEL_TYPE=mobilenetv2
MODEL_DIR=/home/project/bananavisionv3/models
NODE_BACKEND_URL=http://localhost:5000/api
EOF

cat > ${APP_DIR}/frontend/.env.server-template << 'EOF'
VITE_API_BASE_URL=https://bananavision.ruangprojek.cloud/api
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
EOF

echo "Server setup complete."
