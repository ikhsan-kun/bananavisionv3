# Setup Guide — BananaVision

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Firebase project (Google Auth aktif)
- ML server sudah di-deploy (Railway/Render/dll)

---

## Backend

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Environment variables
Buat file `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bananavision?retryWrites=true&w=majority"

# JWT — WAJIB diganti dengan string acak 64 karakter
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<random-64-char-string>
JWT_EXPIRES_IN=7d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS — URL frontend (dev atau production)
CLIENT_URL=http://localhost:5173

# ML Server (sudah di-deploy)
ML_SERVER_URL=https://<your-ml-server>.railway.app
```

### 3. Generate Prisma client & seed database
```bash
npx prisma generate
npx prisma db seed
```

> `db seed` mengisi 7 data penyakit pisang sesuai model ML. Jalankan sekali saat setup awal.

### 4. Jalankan
```bash
npm run dev       # development (nodemon)
npm start         # production
```

---

## Frontend

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Environment variables
Buat file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase (dari Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=<api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_APP_ID=<app-id>
```

### 3. Jalankan
```bash
npm run dev       # development
npm run build     # production build → dist/
```

---

## ML Server (Python)

ML server sudah di-deploy di Railway. Tidak perlu menjalankan secara lokal.

Jika ingin menjalankan lokal:
```bash
cd python
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 5001
```

Kemudian set di `backend/.env`:
```env
ML_SERVER_URL=http://localhost:5001
```

### Environment variables ML server (Railway)
```env
CORS_ORIGINS=https://<frontend-domain>.vercel.app,http://localhost:5173
```

---

## Penyakit yang Dideteksi

Model MobileNetV2 mendeteksi 7 kelas (sesuai seed):

| Index | Nama |
|---|---|
| 0 | Black Sigatoka |
| 1 | Bract Mosaic Virus |
| 2 | Healthy Leaf |
| 3 | Insect Pest |
| 4 | Moko Disease |
| 5 | Panama Disease |
| 6 | Yellow Sigatoka |

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Backend 500 saat analisis | Cek `ML_SERVER_URL` di .env, pastikan tidak ada trailing slash |
| Prisma error setelah ubah schema | Jalankan `npx prisma generate` lalu restart backend |
| CORS error | Pastikan `CLIENT_URL` di backend .env sesuai URL frontend |
| Firebase auth error | Pastikan `FIREBASE_PRIVATE_KEY` menyertakan `\n` yang benar |
| Data penyakit kosong | Jalankan `npx prisma db seed` |
