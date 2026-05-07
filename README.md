# BananaVision

Aplikasi deteksi penyakit daun pisang berbasis AI. Dibangun dengan React (PWA), Node.js/Express, MongoDB, dan model MobileNetV2.

## Struktur Proyek

```
bananavision/
├── frontend/     # React + Vite (PWA)
├── backend/      # Express + Prisma + MongoDB
├── python/       # FastAPI ML Server (deployed di Railway)
└── docs/         # Dokumentasi
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Firebase Auth |
| Backend | Node.js, Express 5, Prisma ORM, MongoDB Atlas |
| ML Server | FastAPI, TensorFlow, MobileNetV2 |
| Auth | Firebase Google Sign-In → JWT |

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # isi variabel yang dibutuhkan
npx prisma generate
npx prisma db seed     # isi data penyakit
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # isi variabel Firebase & API URL
npm run dev
```

### 3. ML Server
ML server sudah di-deploy. Set `ML_SERVER_URL` di `backend/.env`.

## Dokumentasi

| File | Isi |
|---|---|
| [docs/api.md](docs/api.md) | API endpoint reference |
| [docs/setup.md](docs/setup.md) | Environment variables & setup |
| [docs/architecture.md](docs/architecture.md) | Arsitektur sistem |
| [docs/database.md](docs/database.md) | Database schema |
| [docs/diagrams.md](docs/diagrams.md) | Use Case, Activity, Sequence, Class diagram |

## Alur Aplikasi

1. User login via **Google Sign-In** (Firebase)
2. Frontend kirim `idToken` ke `POST /api/auth/google`
3. Backend verifikasi token & kembalikan **JWT** (7 hari)
4. User upload gambar → frontend encode ke base64
5. `POST /api/analyses/analyze` → backend forward ke ML server
6. ML server return prediksi → backend simpan ke MongoDB
7. Frontend tampilkan hasil + riwayat analisis
