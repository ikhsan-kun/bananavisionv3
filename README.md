# BananaVision

BananaVision adalah aplikasi web untuk mendeteksi penyakit pisang menggunakan machine learning. Proyek ini terdiri dari:

- `frontend/`: React + Vite untuk UI
- `backend/`: Express API dengan MongoDB / Prisma
- `python/`: server ML Python dengan TensorFlow model
- `docs/`: dokumentasi proyek

## Arsitektur

1. User login menggunakan Google via Firebase Auth
2. Frontend mengirim gambar ke backend
3. Backend memanggil Python ML server di `ML_SERVER_URL`
4. Python memproses model `.h5` dan mengembalikan prediksi
5. Backend menyimpan hasil analisis ke MongoDB
6. Frontend menampilkan hasil dan statistik

## Dokumentasi

- `docs/README.md` - ringkasan dokumentasi proyek
- `docs/api.md` - dokumentasi endpoint API

## Instalasi

### Backend

1. Masuk ke folder backend
   ```bash
   cd backend
   npm install
   ```
2. Salin `.env.example` ke `.env`
3. Isi variabel environment yang dibutuhkan
4. Jalankan server
   ```bash
   npm run dev
   ```

### Frontend

1. Masuk ke folder frontend
   ```bash
   cd frontend
   npm install
   ```
2. Salin `.env.example` ke `.env`
3. Isi `VITE_API_BASE_URL` dan `VITE_FIREBASE_*`
4. Jalankan development server
   ```bash
   npm run dev
   ```

### Python ML Server

1. Masuk ke folder python
   ```bash
   cd python
   pip install -r requirements.txt
   ```
2. Jalankan server
   ```bash
   python server.py
   ```

## Environment Variables

### Backend

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `ML_SERVER_URL`
- `CORS_ORIGINS`
- `FIREBASE_SERVICE_ACCOUNT_KEY` atau `FIREBASE_SERVICE_ACCOUNT_PATH`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PROJECT_ID`

### Frontend

- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

## Catatan

- Autentikasi hanya menggunakan Google Auth
- Login tradisional email/password sudah tidak digunakan
- Pastikan Python ML server berjalan sebelum melakukan analisis
- API protected harus dikirim dengan header `Authorization: Bearer <token>`
