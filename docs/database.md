# Database Schema — BananaVision

Provider: **MongoDB Atlas** via **Prisma ORM** (v4.16)

---

## Model: User

Collection: `users`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `email` | String (unique) | Email Google |
| `name` | String | Nama dari Google profile |
| `avatar` | String? | URL foto profil |
| `provider` | String | Default: `"google"` |
| `providerId` | String? (unique) | Firebase UID |
| `notifications` | Boolean | Default: `true` |
| `language` | String | Default: `"id"` |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |
| `lastLoginAt` | DateTime? | Diupdate tiap login |
| `isDeleted` | Boolean | Soft delete, default `false` |
| `deletedAt` | DateTime? | Waktu soft delete |

**Relasi:** `analyses[]`, `feedbacks[]`

---

## Model: Analysis

Collection: `analyses`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `userId` | ObjectId | Foreign key → User |
| `imageUrl` | String? | `null` (gambar tidak disimpan di DB) |
| `imageSize` | Int? | Ukuran file asli (bytes) |
| `detectedDisease` | String | Nama penyakit hasil deteksi |
| `diseaseId` | ObjectId? | Foreign key → Disease (nullable) |
| `confidence` | Float | 0.0 – 1.0 (atau 0–100) |
| `status` | String | `completed` \| `failed` |
| `predictions` | Json | Array `[{disease, confidence}]` |
| `notes` | String? | Catatan user |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |
| `isDeleted` | Boolean | Soft delete |

**Index:** `userId`, `diseaseId`, `createdAt`, `status`

> `imageUrl` selalu `null` — gambar tidak disimpan untuk menghindari bloat database. Untuk production dengan kebutuhan riwayat gambar, gunakan Firebase Storage / Cloudinary dan simpan URL-nya.

---

## Model: Disease

Collection: `diseases`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `name` | String | Nama penyakit |
| `description` | String | Deskripsi |
| `category` | String | `Jamur` \| `Bakteri` \| `Virus` \| `Hama` \| `Sehat` |
| `severity` | String | `Ringan` \| `Sedang` \| `Berat` |
| `symptoms` | String[] | Daftar gejala |
| `prevention` | String[] | Langkah pencegahan |
| `treatment` | String[] | Langkah penanganan |
| `imageUrl` | String? | URL gambar penyakit |
| `isActive` | Boolean | Default `true` |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Index:** `name`, `category`

> Data diisi via `npx prisma db seed`. Tidak ada endpoint create/update/delete. Read-only via API.

**7 Data Penyakit (sesuai model ML):**

| Index ML | Nama | Kategori | Severity |
|---|---|---|---|
| 0 | Black Sigatoka | Jamur | Berat |
| 1 | Bract Mosaic Virus | Virus | Sedang |
| 2 | Healthy Leaf | Sehat | Ringan |
| 3 | Insect Pest | Hama | Sedang |
| 4 | Moko Disease | Bakteri | Berat |
| 5 | Panama Disease | Jamur | Berat |
| 6 | Yellow Sigatoka | Jamur | Sedang |

---

## Model: Feedback

Collection: `feedback`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `userId` | ObjectId | Foreign key → User |
| `message` | String | Isi feedback (3–500 karakter) |
| `rating` | Int? | 1–5 (opsional) |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Index:** `userId`

---

## Model: Statistic

Collection: `statistics`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `diseaseName` | String | Nama penyakit |
| `diseaseId` | ObjectId? | Referensi ke Disease |
| `year` | Int | Tahun |
| `month` | Int | Bulan (1–12) |
| `detectionCount` | Int | Jumlah deteksi |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Unique constraint:** `(diseaseName, year, month)`

> Model ini untuk agregat statistik global (bukan per-user). Saat ini belum diisi otomatis, bisa diisi via cron job atau trigger.

---

## Relasi

```
User ──────────────── Analysis (1:N)
User ──────────────── Feedback (1:N)
Disease ──────────── Analysis (1:N, opsional)
```
