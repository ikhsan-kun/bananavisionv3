# Database Schema — BananaVision v3.1

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
| `userId` | ObjectId | Foreign key → User (Cascade Delete) |
| `imageUrl` | String? | `null` (gambar tidak disimpan di DB) |
| `imageSize` | Int? | Ukuran file asli (bytes) |
| `detectedDisease` | String | Nama penyakit hasil deteksi |
| `diseaseId` | ObjectId? | Foreign key → Disease (nullable) |
| `confidence` | Float | 0.0 – 100.0 |
| `status` | String | `completed` \| `failed` |
| `predictions` | Json | Array `[{disease, confidence}]` |
| `notes` | String? | Catatan user |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |
| `isDeleted` | Boolean | Soft delete |
| `deletedAt` | DateTime? | Waktu soft delete |

**Index:** `userId`, `diseaseId`, `createdAt`, `status`

> `imageUrl` selalu `null` — gambar tidak disimpan untuk menghindari bloat database. Untuk production dengan kebutuhan riwayat gambar, gunakan Firebase Storage / Supabase Storage dan simpan URL-nya.

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
| `isActive` | Boolean | Default `true`. Admin bisa toggle nonaktif |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Index:** `name`, `category`

> Data dikelola via **Admin Panel** (`/admin/diseases`). Admin dapat membuat, mengubah, menghapus, dan meng-toggle status aktif penyakit.

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
| `userId` | ObjectId | Foreign key → User (Cascade Delete) |
| `message` | String | Isi feedback (3–500 karakter) |
| `rating` | Int? | 1–5 (opsional) |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Index:** `userId`

---

## Model: Admin ← Model Baru

Collection: `admins`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `email` | String (unique) | Email admin |
| `password` | String | bcrypt hashed password |
| `name` | String | Nama admin |
| `role` | String | Default: `"admin"` |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

> Admin dibuat via seeder atau langsung ke database. Tidak ada endpoint registrasi admin publik.

---

## Model: MlModel ← Model Baru

Collection: `ml_models`

| Field | Type | Keterangan |
|---|---|---|
| `id` | ObjectId | Primary key |
| `name` | String | Display name (e.g. "MobileNetV2 Final") |
| `filename` | String | Nama file di disk (e.g. "model_mobilenetv2_final.keras") |
| `modelType` | String | `"mobilenetv2"` \| `"resnet50"` \| `"custom"` |
| `isActive` | Boolean | Default: `false`. Hanya satu model aktif di waktu yang sama |
| `fileSize` | Int? | Ukuran file dalam bytes |
| `uploadedAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

> Admin mengupload file `.keras` via panel admin. Backend menyimpan file ke folder `python/` dan metadata ke collection ini. Aktivasi model akan memicu hot-reload di ML server.

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

> Model ini untuk agregat statistik global (bukan per-user). Saat ini bisa diisi via cron job atau trigger saat analisis selesai.

---

## Relasi

```
User ──────────────── Analysis (1:N, Cascade Delete)
User ──────────────── Feedback (1:N, Cascade Delete)
Disease ──────────── Analysis (1:N, opsional / nullable FK)
```

### Entity-Relationship Diagram (Sederhana)

```
┌──────────┐       ┌──────────────┐       ┌──────────────┐
│  User    │──1:N──│  Analysis    │──N:1──│   Disease    │
│          │       │              │       │              │
│ id       │       │ id           │       │ id           │
│ email    │       │ userId       │       │ name         │
│ name     │       │ detectedDis  │       │ category     │
│ avatar   │       │ diseaseId?   │       │ severity     │
│ ...      │       │ confidence   │       │ isActive     │
└──────────┘       │ status       │       └──────────────┘
    │              │ predictions  │
    │              │ isDeleted    │
    │              └──────────────┘
    │
    │  ┌──────────────┐
    └──│  Feedback    │
  1:N  │              │
       │ id           │
       │ userId       │
       │ message      │
       │ rating?      │
       └──────────────┘

┌──────────┐       ┌──────────────┐
│  Admin   │       │   MlModel    │
│          │       │              │
│ id       │       │ id           │
│ email    │       │ name         │
│ password │       │ filename     │
│ name     │       │ modelType    │
│ role     │       │ isActive     │
└──────────┘       │ fileSize     │
                   └──────────────┘
```
