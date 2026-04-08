# API Documentation - BananaVision

## Autentikasi

Semua endpoint yang dilindungi memerlukan header:

```
Authorization: Bearer <JWT>
```

Token JWT dihasilkan dari login Google melalui endpoint `/api/auth/google`.

---

## Auth

### POST /api/auth/google

Login dengan Google Firebase.

**Request**

```json
{
  "idToken": "<google-id-token>"
}
```

**Response**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "name": "...",
      "avatar": "..."
    },
    "token": "<jwt-token>"
  }
}
```

### GET /api/auth/profile

Ambil data profil user saat ini.

**Headers**

```http
Authorization: Bearer <jwt>
```

### PUT /api/auth/profile

Update profil user.

**Body**

```json
{
  "name": "Nama Baru",
  "avatar": "https://...",
  "notifications": true,
  "language": "id"
}
```

### GET /api/auth/verify

Verifikasi validitas token.

**Headers**

```http
Authorization: Bearer <jwt>
```

---

## Diseases

### GET /api/diseases

Ambil daftar penyakit.

### GET /api/diseases/:id

Ambil detail penyakit berdasarkan ID.

### POST /api/diseases

Buat data penyakit baru. Memerlukan autentikasi.

**Body**

```json
{
  "name": "Black Leaf Streak",
  "description": "...",
  "category": "Jamur",
  "severity": "Berat",
  "symptoms": ["spot hitam", "layu"],
  "prevention": ["pemangkasan"],
  "treatment": ["fungisida"],
  "imageUrl": "https://..."
}
```

### PUT /api/diseases/:id

Update penyakit.

### DELETE /api/diseases/:id

Hapus penyakit.

---

## Analyses

### POST /api/analyses/analyze

Kirim gambar base64 untuk dianalisis oleh model ML.

**Body**

```json
{
  "imageBase64": "<base64-image-data>",
  "notes": "optional notes"
}
```

### GET /api/analyses

Ambil daftar analisis user saat ini.

### GET /api/analyses/dashboard/stats

Ambil statistik dashboard untuk user.

### GET /api/analyses/dashboard/trends?period=7d|30d|1y

Ambil data tren untuk chart.

---

## Response umum

Endpoint API umumnya mengembalikan struktur:

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

Untuk error:

```json
{
  "success": false,
  "message": "..."
}
```
