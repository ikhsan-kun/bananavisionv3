// ecosystem.config.js — PM2 Process Manager Configuration
// Jalankan dengan: pm2 start ecosystem.config.js --env production
// Reload:         pm2 reload ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      // ─── Node.js Backend ───────────────────────────────────────────
      name: "bananavision-backend",
      cwd: "/opt/bananavision/backend",
      script: "server.js",
      interpreter: "node",
      instances: 1, // Ubah ke "max" untuk cluster mode jika server berspesifikasi tinggi
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        TRUST_PROXY: "1",
        // Semua secret dibaca dari file .env di cwd
      },
      // Auto-restart settings
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 3000,
      max_restarts: 10,
      // Logs
      out_file: "/var/log/bananavision/backend-out.log",
      error_file: "/var/log/bananavision/backend-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      // ─── Python FastAPI Backend ────────────────────────────────────
      name: "bananavision-python",
      cwd: "/opt/bananavision/python",
      script: "server.py",
      interpreter: "/opt/bananavision/venv/bin/python",
      args: "", // uvicorn dipanggil dari dalam server.py via __main__
      // ALTERNATIF: jalankan langsung via uvicorn (lebih robust untuk prod):
      // script: "/opt/bananavision/venv/bin/uvicorn",
      // args: "server:app --host 0.0.0.0 --port 8000 --workers 1 --timeout-keep-alive 120",
      instances: 1, // TensorFlow tidak thread-safe, gunakan 1 instance
      exec_mode: "fork",
      env: {
        MODEL_TYPE: "mobilenetv2",
        MODEL_DIR: "/opt/bananavision/models",
        NODE_BACKEND_URL: "http://localhost:5000/api",
      },
      env_production: {
        MODEL_TYPE: "mobilenetv2",
        MODEL_DIR: "/opt/bananavision/models",
        NODE_BACKEND_URL: "http://localhost:5000/api",
      },
      // Auto-restart settings
      watch: false,
      max_memory_restart: "3G", // Model AI besar — beri RAM lebih
      restart_delay: 5000,
      max_restarts: 5,
      // Logs
      out_file: "/var/log/bananavision/python-out.log",
      error_file: "/var/log/bananavision/python-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
