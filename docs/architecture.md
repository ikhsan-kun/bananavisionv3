# Arsitektur — BananaVision (diperbarui)

## Ikhtisar Sistem

Diagram ringkas sistem:

```
BROWSER (React PWA - Vite + Tailwind + Firebase Auth SDK)
  ↕ HTTPS + JWT
BACKEND (Express)
  - Routes → Controllers → Services → Models (Prisma)
  - Middleware: Helmet, CORS, RateLimit, authenticate (JWT/Firebase)
  - Exposed routes: /api/auth, /api/analyses, /api/diseases, /api/feedbacks, /api/statistics
  ↕ HTTP (JSON)
ML SERVER (FastAPI) — menerima POST /api/predict (image base64)
DATABASE (Prisma) — dikelola via `prisma/schema.prisma` (lihat `/backend/prisma`)
EXTERNAL AUTH: Firebase (Google Sign-In / ID Token verification)
```

Keterangan singkat:

- Frontend: Progressive Web App dibangun dengan Vite + React + Tailwind. Otentikasi via Firebase SDK untuk Google Sign-In; backend mengeluarkan JWT yang digunakan frontend (disimpan di localStorage) untuk request API.
- Backend: Express (folder `backend/`) mengikuti pola MVC: `routes/` → `controllers/` → `services/` → `models/` (Prisma). Business logic (mis. komunikasi ke ML server) ada di `services/`.
- ML Server: Layanan terpisah (FastAPI) yang menjalankan model TensorFlow (MobileNetV2/ResNet50). Backend memanggil endpoint ML dengan `ML_SERVER_URL` (env) untuk mendapatkan prediksi.
- Database: Prisma digunakan untuk skema dan query; seed data penyakit ada di `backend/prisma/seed.js`.

## Alur Autentikasi (ringkas)

1.  Pengguna memilih Sign-In dengan Google pada frontend (Firebase SDK).
2.  Frontend mengirim `idToken` ke backend: `POST /api/auth/google`.
3.  Backend memverifikasi token via Firebase Admin SDK, membuat/ memperbarui user di DB.
4.  Backend mengeluarkan JWT (masa berlaku default 7 hari).
5.  Frontend menyimpan JWT (localStorage) dan mengirim header `Authorization: Bearer <jwt>` pada permintaan API selanjutnya.

## Alur Analisis Gambar

1.  Frontend membaca file gambar (`FileReader.readAsDataURL()`), mengekstrak base64 tanpa prefix.
2.  Frontend `POST /api/analyses/analyze` dengan body `{ imageBase64, notes? }` dan header Authorization.
3.  Backend (`AnalysisService`) mem-forward ke ML Server `POST ${ML_SERVER_URL}/api/predict`.
4.  ML Server mengembalikan: `{ detectedDisease, confidence, predictions[] }`.
5.  Backend menyimpan hasil ke database (`analysis` record) dengan `imageUrl = null` (gambar tidak disimpan).
6.  Backend mengembalikan hasil ke frontend untuk ditampilkan.

Catatan: aplikasi menyimpan hanya metadata hasil deteksi, bukan file gambar, untuk mencegah bloat.

## Endpoint Utama

- `POST /api/auth/google` — login/verify Firebase idToken → mengembalikan JWT
- `GET /api/auth/verify` — verifikasi JWT (profil)
- `GET/POST/DELETE /api/analyses` — manajemen analisis pengguna (`/api/analyses/analyze` untuk proses ML)
- `GET /api/analyses/dashboard/stats` — ringkasan statistik analisis per pengguna
- `GET /api/analyses/dashboard/trends` — data tren analisis (periode)
- `GET /api/diseases` — daftar penyakit (public)
- `POST /api/feedbacks` — kirim umpan balik pengguna
- `GET /api/statistics/user` — statistik teragregasi (detectedDisease counts)

## Struktur Proyek (ringkas)

- `backend/`
  - `app.js`, `server.js` — entry dan konfigurasi Express
  - `src/routes/` — definisi route API
  - `src/controllers/` — penanganan HTTP request/response
  - `src/services/` — logika bisnis (komunikasi ML, pengolahan data)
  - `src/models/` — query Prisma / DB
  - `prisma/` — `schema.prisma`, `seed.js`

- `frontend/`
  - `src/App.jsx` — root app dan routing
  - `src/pages/` — `DashboardPage.jsx`, `AnalyzePage.jsx`, `HistoryPage.jsx`, dll.
  - `src/hooks/data.js` — helper panggil API (semua endpoint utama)
  - `src/utils/` — `token.js`, `config.js`, `firebaseClient.js`

## Environment Variables (penting)

- Frontend: `VITE_API_BASE_URL` — base API (contoh: `http://localhost:5000/api`)
- Backend: `ML_SERVER_URL` — alamat ML server (contoh: `http://localhost:5001`)
- Backend: `CLIENT_URL` — origin frontend untuk CORS
- Firebase & JWT-related env vars di `backend/config/` untuk verifikasi

## Keamanan & Praktik

- Semua route yang membutuhkan user di-protect dengan middleware `authenticate` yang memvalidasi JWT.
- Helmet, rate limiter, dan pembatasan CORS diaktifkan pada `app.js`.
- Rate limit default: 100 permintaan / 15 menit per IP.

## Deployment notes

- ML Server dapat dijalankan terpisah (Railway/Heroku/VPS). Pastikan `ML_SERVER_URL` mengarah ke instance yang benar.
- Backend membutuhkan akses ke credential Firebase Admin (service account) untuk memverifikasi `idToken`.
- Jalankan seed penyakit sekali saat setup: `node backend/prisma/seed.js` (atau sesuai README).

## Referensi file penting

- [backend/app.js](backend/app.js)
- [backend/src/routes/analysis.routes.js](backend/src/routes/analysis.routes.js)
- [backend/src/controllers/analysis.controller.js](backend/src/controllers/analysis.controller.js)
- [frontend/src/hooks/data.js](frontend/src/hooks/data.js)
- [frontend/src/pages/DashboardPage.jsx](frontend/src/pages/DashboardPage.jsx)

---

Dokumen ini telah disesuaikan untuk mencerminkan struktur dan alur pada repository saat ini. Jika Anda ingin menambahkan diagram visual (PNG/SVG) atau menambahkan instruksi deploy spesifik (Docker / Railway), beri tahu saya dan saya akan menambahkannya.
