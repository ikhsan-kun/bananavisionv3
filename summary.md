# Rangkuman Database dan Backend BananaVision

## Deskripsi Proyek

BananaVision adalah website deteksi penyakit tanaman pisang menggunakan machine learning. Proyek ini terdiri dari backend (Node.js + Express + Prisma + MongoDB), frontend (React + Vite), dan model Python untuk deteksi.

## Rangkuman Tabel Database (Prisma Schema)

### 1. Model User

**Kegunaan**: Menyimpan data pengguna untuk autentikasi dan profil.

- Field utama: id, email, name, avatar, provider (default: "google"), providerId, notifications, language, createdAt, updatedAt, lastLoginAt, isDeleted, deletedAt.
- Relasi: analyses (1:N ke Analysis).

### 2. Model Analysis

**Kegunaan**: Menyimpan hasil analisis gambar pengguna.

- Field utama: id, userId, imageUrl, imageKey, imageSize, detectedDisease, diseaseId, confidence, status (default: "completed"), predictions (JSON), notes, createdAt, updatedAt, isDeleted.
- Relasi: user (N:1 ke User), disease (N:1 opsional ke Disease).

### 3. Model Disease

**Kegunaan**: Database referensi penyakit pisang.

- Field utama: id, name, description, category (Jamur/Bakteri/Virus), severity (Ringan/Sedang/Berat), symptoms (array), prevention (array), treatment (array), imageUrl, createdAt, updatedAt, isActive.
- Relasi: analyses (1:N ke Analysis).

### 4. Model Statistic

**Kegunaan**: Agregat statistik deteksi penyakit per bulan/tahun.

- Field utama: id, diseaseName, diseaseId, year, month, detectionCount, createdAt, updatedAt.
- Relasi: Tidak ada (opsional ke Disease via diseaseId).

## Relasi Antar Tabel

- User → Analysis (1:N): Riwayat analisis per pengguna.
- Disease → Analysis (1:N, opsional): Hubungkan hasil deteksi dengan info penyakit.
- Statistic: Berdiri sendiri, bisa di-join via diseaseId/diseaseName.

## Koreksi dan Saran

- **Kelebihan**: Relasi tepat, soft delete, index performa, JSON untuk predictions.
- **Masalah**: Statistic tidak punya relasi eksplisit ke Disease (saran: tambah relasi opsional).
- **Tambahan Field**: Model version di Analysis, role di User jika ada admin.
- Secara umum: Sudah baik untuk fitur utama.

## Status Backend

- **Script Start**: `npm run dev` (nodemon) atau `npm start` (node).
- **Port**: Periksa server.js (kemungkinan 3000 atau 5000).
- **Dependencies**: Prisma Client, Express, MongoDB, dll.
- **Testing**: Jalankan backend dan test endpoint via Postman atau curl.

## Cara Menambahkan Detail Penyakit Pisang Baru

1. **Via API (Direkomendasikan)**:
   - Endpoint: POST /diseases (authenticated).
   - Header: Authorization: Bearer <token>.
   - Body JSON:
     ```json
     {
       "name": "Penyakit Baru",
       "description": "Deskripsi penyakit",
       "category": "Jamur",
       "severity": "Sedang",
       "symptoms": ["Gejala 1", "Gejala 2"],
       "prevention": ["Pencegahan 1"],
       "treatment": ["Pengobatan 1"],
       "imageUrl": "https://example.com/image.jpg"
     }
     ```
   - Response: Penyakit baru dibuat.

2. **Via Seeding (Untuk Development)**:
   - Edit `prisma/seed.js` dan tambah data.
   - Jalankan `npx prisma db seed`.

3. **Langsung ke Database**:
   - Insert manual ke collection "diseases" di MongoDB.

Pastikan autentikasi untuk endpoint protected.</content>
<parameter name="filePath">/home/ikhsan-dev/dev/bananavision/summary.md
