# API Reference — BananaVision

Base URL: `http://localhost:5000/api`

Semua endpoint yang membutuhkan autentikasi harus menyertakan header:
```http
Authorization: Bearer <jwt-token>
```

Response format:
```json
{ "success": true, "data": {}, "message": "..." }
{ "success": false, "message": "..." }
```

---

## Auth

### POST /api/auth/google
Login dengan Google Firebase ID Token.

**Body:**
```json
{ "idToken": "<firebase-id-token>" }
```

**Response:**
```json
{
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "avatar": "..." },
    "token": "<jwt>"
  }
}
```

---

### GET /api/auth/profile 🔒
Ambil profil user yang sedang login.

**Response:** `{ "data": { "id", "email", "name", "avatar", "createdAt", "lastLoginAt" } }`

---

### PUT /api/auth/profile 🔒
Update profil user.

**Body:** `{ "name": "...", "notifications": true, "language": "id" }`

---

### GET /api/auth/verify 🔒
Cek apakah JWT masih valid.

**Response:** `{ "success": true, "message": "Token is valid" }`

---

## Analyses

### POST /api/analyses/analyze 🔒
Analisis gambar daun pisang.

**Body:**
```json
{
  "imageBase64": "<base64-string-tanpa-prefix-data:image>",
  "notes": "catatan opsional"
}
```

**Response:**
```json
{
  "data": {
    "id": "...",
    "detectedDisease": "Black Sigatoka",
    "confidence": 0.95,
    "status": "completed",
    "predictions": [
      { "disease": "Black Sigatoka", "confidence": 0.95 },
      { "disease": "Healthy Leaf", "confidence": 0.03 }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

> Catatan: `status` bisa `completed` atau `failed` (jika ML server tidak dapat diakses). Gambar tidak disimpan di database.

---

### GET /api/analyses 🔒
Ambil semua riwayat analisis milik user.

**Response:** `{ "data": [ ...analyses ] }`

---

### GET /api/analyses/:id 🔒
Ambil detail analisis spesifik.

---

### DELETE /api/analyses/:id 🔒
Hapus analisis.

---

### GET /api/analyses/dashboard/stats 🔒
Statistik dashboard user.

**Response:**
```json
{
  "data": {
    "totalAnalyses": 25,
    "healthyCount": 10,
    "diseasePrevalence": 60.0,
    "avgConfidence": 91.3
  }
}
```

---

### GET /api/analyses/dashboard/trends 🔒
Data tren analisis per periode.

**Query:** `?period=7d` | `30d` | `1y`

**Response:**
```json
{
  "data": [
    { "day": "Sen", "date": "2024-01-01", "count": 3 },
    { "day": "Sel", "date": "2024-01-02", "count": 5 }
  ]
}
```

---

## Diseases

> Data penyakit dikelola via **seed script** saja. Tidak ada endpoint create/update/delete.

### GET /api/diseases
Ambil semua data penyakit. Publik, tidak perlu auth.

**Query:** `?category=Jamur` (opsional)

**Response:**
```json
{
  "data": [
    {
      "id": "...",
      "name": "Black Sigatoka",
      "description": "...",
      "category": "Jamur",
      "severity": "Berat",
      "symptoms": ["..."],
      "prevention": ["..."],
      "treatment": ["..."]
    }
  ]
}
```

### GET /api/diseases/:id
Detail penyakit berdasarkan ID. Publik.

---

## Feedback

### POST /api/feedbacks 🔒
Kirim feedback.

**Body:** `{ "message": "...", "rating": 5 }`

---

### GET /api/feedbacks
Ambil semua feedback (publik).

---

## Error Codes

| Status | Arti |
|---|---|
| 400 | Request tidak valid / field kosong |
| 401 | Token tidak ada atau kadaluarsa |
| 403 | Akses ditolak |
| 404 | Data tidak ditemukan |
| 409 | Data duplikat (Prisma P2002) |
| 500 | Server error |
