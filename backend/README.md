# Backend BananaVision

Backend aplikasi BananaVision menyediakan REST API untuk autentikasi Google, manajemen data penyakit, dan penyimpanan hasil analisis.

## Teknologi

- Node.js + Express
- MongoDB dengan Prisma Client
- Firebase Admin untuk verifikasi Google token
- Express session, rate limiter, helmet, dan cors

## Endpoint utama

- `POST /api/auth/google` - Login dengan Google
- `GET /api/auth/profile` - Ambil profil user
- `PUT /api/auth/profile` - Update profil user
- `GET /api/auth/verify` - Verifikasi token
- `GET /api/diseases` - Daftar penyakit publik
- `GET /api/diseases/:id` - Detail penyakit
- `POST /api/diseases` - Buat penyakit (auth)
- `PUT /api/diseases/:id` - Update penyakit (auth)
- `DELETE /api/diseases/:id` - Hapus penyakit (auth)
- `POST /api/analyses/analyze` - Analisis gambar penyakit pisang (auth)
- `GET /api/analyses` - Analisis user
- `GET /api/analyses/dashboard/stats` - Statistik dashboard
- `GET /api/analyses/dashboard/trends` - Tren analisis

## Instalasi

```bash
cd backend
npm install
```

## Konfigurasi

Salin `backend/.env.example` ke `backend/.env` dan isi nilai:

- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `ML_SERVER_URL`
- `CORS_ORIGINS`
- `FIREBASE_SERVICE_ACCOUNT_KEY` atau `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`

## Menjalankan server

```bash
npm run dev
```

## Catatan

- Autentikasi API menggunakan Google token saja.
- Semua endpoint yang memerlukan auth harus mengirim header `Authorization: Bearer <jwt>`.
