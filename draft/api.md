# API Documentation - BananaVision

Dokumentasi ini memuat seluruh API BananaVision yang dijalankan oleh backend.

## Konsep Umum

- Base URL API: `/api`
- Semua endpoint yang membutuhkan autentikasi mengharuskan header:

```http
Authorization: Bearer <JWT>
```

- JWT diterbitkan oleh backend setelah login Google dan digunakan untuk semua endpoint yang dilindungi.
- Response umum berhasil:

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

- Response error:

```json
{
  "success": false,
  "message": "..."
}
```

---

## Autentikasi

### POST /api/auth/google

Login dengan Google Firebase ID token.

**Request Body**:

```json
{
  "idToken": "<google-id-token>"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "name": "...",
      "avatar": "...",
      "provider": "google",
      "notifications": true,
      "language": "id"
    },
    "token": "<jwt-token>"
  },
  "message": "Login successful"
}
```

### GET /api/auth/profile

Ambil profil user yang sedang login.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "name": "...",
    "avatar": "...",
    "provider": "google",
    "notifications": true,
    "language": "id",
    "createdAt": "...",
    "lastLoginAt": "..."
  },
  "message": "User profile retrieved successfully"
}
```

### PUT /api/auth/profile

Update profil user.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Request Body**:

```json
{
  "name": "Nama Baru",
  "avatar": "https://...",
  "notifications": true,
  "language": "id"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "name": "Nama Baru",
    "avatar": "https://...",
    "notifications": true,
    "language": "id"
  },
  "message": "Profile updated successfully"
}
```

### GET /api/auth/verify

Verifikasi apakah token JWT masih valid.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Response**:

```json
{
  "success": true,
  "message": "Token is valid"
}
```

---

## Disease Endpoints

### GET /api/diseases

Ambil daftar penyakit.

**Query Parameters (opsional)**:

- `category`: filter kategori penyakit.

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "description": "...",
      "category": "Jamur",
      "severity": "Berat",
      "symptoms": [...],
      "prevention": [...],
      "treatment": [...],
      "imageUrl": "..."
    }
  ],
  "message": "Diseases retrieved successfully"
}
```

### GET /api/diseases/:id

Ambil detail penyakit berdasarkan ID.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "description": "...",
    "category": "Jamur",
    "severity": "Berat",
    "symptoms": [...],
    "prevention": [...],
    "treatment": [...],
    "imageUrl": "..."
  },
  "message": "Disease retrieved successfully"
}
```

### POST /api/diseases

Buat data penyakit baru.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Request Body**:

```json
{
  "name": "Black Leaf Streak",
  "description": "Gejala awal berupa bercak hitam pada daun.",
  "category": "Jamur",
  "severity": "Berat",
  "symptoms": ["spot hitam", "layu", "keriput"],
  "prevention": ["pemangkasan teratur", "rotasi tanaman"],
  "treatment": ["penggunaan fungisida", "pembuangan daun terinfeksi"],
  "imageUrl": "https://..."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Black Leaf Streak",
    "description": "...",
    "category": "Jamur",
    "severity": "Berat",
    "symptoms": [...],
    "prevention": [...],
    "treatment": [...],
    "imageUrl": "..."
  },
  "message": "Disease created successfully"
}
```

### PUT /api/diseases/:id

Update data penyakit.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Request Body** (semua field opsional):

```json
{
  "description": "Deskripsi diperbarui",
  "severity": "Sedang",
  "symptoms": ["..."],
  "prevention": ["..."],
  "treatment": ["..."],
  "imageUrl": "https://..."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "description": "..."
  },
  "message": "Disease updated successfully"
}
```

### DELETE /api/diseases/:id

Hapus penyakit berdasarkan ID.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Response**:

```json
{
  "success": true,
  "data": null,
  "message": "Disease deleted successfully"
}
```

---

## Analyses Endpoints

### POST /api/analyses/analyze

Kirim gambar dalam format base64 agar backend menganalisisnya menggunakan model ML.

**Headers**:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Request Body**:

```json
{
  "imageBase64": "<base64-image-data>",
  "notes": "optional notes"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "...",
    "imageUrl": "...",
    "detectedDisease": "...",
    "confidence": 0.95,
    "predictions": [{ "disease": "...", "confidence": 0.95 }],
    "createdAt": "..."
  },
  "message": "Analysis completed successfully"
}
```

### GET /api/analyses

Ambil daftar analisis milik user yang sedang login.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Response**:

```json
{
  "success": true,
  "data": [ ... ],
  "message": "Analyses retrieved successfully"
}
```

### GET /api/analyses/dashboard/stats

Ambil statistik dashboard untuk analisis.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Response**:

```json
{
  "success": true,
  "data": {
    "totalAnalyses": 10,
    "topDiseases": [...],
    "monthlyCounts": [...]
  },
  "message": "Dashboard stats retrieved successfully"
}
```

### GET /api/analyses/dashboard/trends

Ambil data tren analisis.

**Headers**:

```http
Authorization: Bearer <jwt>
```

**Query Parameters**:

- `period`: `7d`, `30d`, `1y`

**Response**:

```json
{
  "success": true,
  "data": {
    "period": "7d",
    "trends": [...]
  },
  "message": "Dashboard trends retrieved successfully"
}
```

---

## Error Handling

- `401 Unauthorized`: token tidak ada atau kadaluwarsa.
- `404 Not Found`: resource tidak ditemukan.
- `400 Bad Request`: payload request tidak valid.
- `500 Internal Server Error`: kesalahan server.

Pastikan setiap request dilengkapi `Authorization` untuk endpoint yang dilindungi dan `Content-Type: application/json` saat mengirim body JSON.

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
