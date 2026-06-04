# Setup Guide — BananaVision v3.1

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Firebase project (Google Auth aktif)
- Python 3.9+ (untuk ML server lokal)
- ML server sudah di-deploy (Railway)

---

## 1. Backend

### Install dependencies
```bash
cd backend
npm install
```

### Environment variables
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

# Admin JWT — secret TERPISAH dari user JWT
ADMIN_JWT_SECRET=<random-64-char-string-berbeda>
ADMIN_JWT_EXPIRES_IN=24h

# Firebase Admin SDK
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS — URL frontend (dev atau production)
CLIENT_URL=http://localhost:5173

# ML Server URL (sudah di-deploy)
ML_SERVER_URL=https://<your-ml-server>.railway.app

# Supabase (untuk cloud storage model ML)
SUPABASE_URL=https://<id-proyek>.supabase.co
SUPABASE_KEY=<service-role-key>
SUPABASE_BUCKET=models
```

### Generate Prisma client & seed database
```bash
npx prisma generate
npx prisma db seed
```

> `db seed` mengisi 7 data penyakit pisang sesuai model ML. Jalankan sekali saat setup awal.

### Buat akun admin (pertama kali)
Admin tidak bisa registrasi sendiri. Buat via script atau langsung ke DB:

```bash
# Dari folder backend/, jalankan script seeder admin
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('password_anda', 12);
  await prisma.admin.create({ data: { email: 'admin@example.com', password: hash, name: 'Admin' } });
  console.log('Admin created!');
}
main().finally(() => prisma.\$disconnect());
"
```

### Jalankan
```bash
npm run dev       # development (nodemon)
npm start         # production
```

---

## 2. Frontend

### Install dependencies
```bash
cd frontend
npm install
```

### Environment variables
Buat file `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase (dari Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=<api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_APP_ID=<app-id>
```

### Jalankan
```bash
npm run dev       # development
npm run build     # production build → dist/
```

### Deploy ke Vercel
File `frontend/vercel.json` sudah dikonfigurasi untuk SPA routing. Deploy langsung:
```bash
npx vercel --prod
```

---

## 3. ML Server (Python / FastAPI)

ML server sudah di-deploy di Railway. Tidak perlu menjalankan secara lokal untuk development biasa.

### Jalankan lokal (opsional)
```bash
cd python
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 5001 --reload
```

Set di `backend/.env`:
```env
ML_SERVER_URL=http://localhost:5001
```

### Environment variables ML server (Railway)
```env
NODE_BACKEND_URL=https://<backend-railway-url>/api
MODEL_TYPE=mobilenetv2    # opsional, default mobilenetv2
```

> Jika `NODE_BACKEND_URL` di-set, ML server akan otomatis query backend saat startup untuk mendapatkan dan download model aktif (auto-recovery setelah Railway restart).

### Mode Standby
Jika tidak ada model aktif di folder `python/`, server tetap berjalan dalam mode **STANDBY**.
- Endpoint `/health` tetap merespons
- Endpoint `/api/predict` mengembalikan HTTP 503
- Upload dan aktifkan model via Admin Panel untuk keluar dari mode standby

---

## 4. Admin Panel

Akses via: `http://localhost:5173/admin/login`

> **Penting:** Admin login menggunakan email + password (bukan Google). Akun admin dibuat via script seeder (lihat langkah di atas).

Fitur Admin Panel:
- **Dashboard** — statistik global (total user, analisis, penyakit, feedback)
- **Diseases** — CRUD data penyakit, toggle aktif/nonaktif
- **Models** — upload model `.keras`, aktifkan, lihat status ML server

---

## 5. Penyakit yang Dideteksi

Model MobileNetV2 mendeteksi 7 kelas (sesuai seed):

| Index | Nama | Kategori | Severity |
|---|---|---|---|
| 0 | Black Sigatoka | Jamur | Berat |
| 1 | Bract Mosaic Virus | Virus | Sedang |
| 2 | Healthy Leaf | Sehat | Ringan |
| 3 | Insect Pest | Hama | Sedang |
| 4 | Moko Disease | Bakteri | Berat |
| 5 | Panama Disease | Jamur | Berat |
| 6 | Yellow Sigatoka | Jamur | Sedang |

---

## 6. Troubleshooting

| Masalah | Solusi |
|---|---|
| Backend 500 saat analisis | Cek `ML_SERVER_URL` di .env, pastikan tidak ada trailing slash |
| ML server 503 (standby) | Upload dan aktifkan model `.keras` via Admin Panel `/admin/models` |
| Prisma error setelah ubah schema | Jalankan `npx prisma generate` lalu restart backend |
| CORS error | Pastikan `CLIENT_URL` di backend .env sesuai URL frontend |
| Firebase auth error | Pastikan `FIREBASE_PRIVATE_KEY` menyertakan `\n` yang benar |
| Data penyakit kosong | Jalankan `npx prisma db seed` |
| Admin login gagal | Pastikan `ADMIN_JWT_SECRET` di .env terisi, cek email/password admin |
| Model tidak ter-load setelah aktivasi | Cek log Railway ML server, pastikan URL Supabase valid |
| File model terlalu besar (> 250MB) | Kompresi model atau gunakan model yang lebih kecil |
