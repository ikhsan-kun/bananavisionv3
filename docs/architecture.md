# BananaVision - Arsitektur Sistem v3

## Gambaran Umum

BananaVision adalah aplikasi Progressive Web App (PWA) untuk deteksi penyakit pada daun pisang menggunakan machine learning. Sistem terdiri dari tiga komponen utama:

1. **Frontend** - React/Vite (PWA)
2. **Backend** - Node.js/Express API
3. **ML Server** - Python FastAPI untuk prediksi gambar

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BananaVision System                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Frontend (React/Vite PWA)         Backend (Node.js/Express)          │
│  ┌────────────────────────┐        ┌──────────────────────┐          │
│  │ User Pages:            │        │ • Auth Controller     │          │
│  │  • HomePage            │◀──────▶│ • Analysis Controller │          │
│  │  • AnalyzePage         │        │ • Disease Controller  │          │
│  │  • DashboardPage       │        │ • Feedback Controller │          │
│  │  • HistoryPage         │        │ • Admin Controller    │          │
│  │  • DiseasesPage        │        │ • MlModel Controller  │          │
│  │  • ProfilePage         │        └──────────┬───────────┘          │
│  │                        │                   │                       │
│  │ Admin Pages:           │        ┌──────────▼───────────┐          │
│  │  • AdminLoginPage      │        │   MongoDB (Prisma)    │          │
│  │  • AdminDashboardPage  │        │ • users               │          │
│  │  • AdminDiseasesPage   │        │ • analyses            │          │
│  │  • AdminModelsPage     │        │ • diseases            │          │
│  └────────────────────────┘        │ • feedback            │          │
│                                    │ • admins              │          │
│  ┌───────────────────────┐         │ • ml_models           │          │
│  │   ML Server (FastAPI) │         │ • statistics          │          │
│  │ • /api/predict        │◀────────└──────────────────────┘          │
│  │ • /api/predict-file   │                                            │
│  │ • /api/reload         │  Firebase Auth                             │
│  │ • /api/models         │                                            │
│  │ • ImageNet Gatekeeper │  Supabase Storage (ML Models)              │
│  └───────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Arsitektur Backend

### Struktur Folder

```
backend/
├── src/
│   ├── controllers/        # Endpoint handlers
│   │   ├── admin.controller.js
│   │   ├── adminDisease.controller.js
│   │   ├── analysis.controller.js
│   │   ├── auth.controller.js
│   │   ├── disease.controller.js
│   │   ├── feedback.controller.js
│   │   └── mlModel.controller.js
│   ├── models/            # Database models (Prisma)
│   ├── services/          # Business logic
│   ├── routes/            # API routes
│   │   ├── admin.routes.js
│   │   ├── analysis.routes.js
│   │   ├── auth.routes.js
│   │   ├── disease.routes.js
│   │   └── feedback.routes.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js        # JWT user auth
│   │   └── adminAuth.js   # JWT admin auth
│   ├── validators/        # Input validation
│   └── utils/             # Helper functions
├── config/                # Configuration files
├── prisma/                # Prisma schema & migrations
│   └── schema.prisma
├── app.js                 # Express app setup
└── server.js              # Server entry point
```

### Alur Request

```
HTTP Request
    │
    ▼
Rate Limiter (express-rate-limit)
    │
    ▼
CORS & Security (Helmet)
    │
    ▼
Routes (/api/*)
    │
    ▼
Middleware (Auth / AdminAuth)
    │
    ▼
Controller
    │
    ▼
Service (Business Logic)
    │
    ▼
Model (Database/ML Server)
    │
    ▼
Response
```

### API Endpoints

#### Authentication (`/api/auth`)

- `POST /auth/google` - Login dengan Google Firebase ID Token
- `GET /auth/profile` 🔒 - Ambil profil user
- `PUT /auth/profile` 🔒 - Update profile pengguna
- `GET /auth/verify` 🔒 - Verify JWT token

#### Analysis (`/api/analyses`)

- `POST /analyses/analyze` 🔒 - Analyze gambar (call ML Server)
- `GET /analyses` 🔒 - Get analysis history (paginated)
- `GET /analyses/:id` 🔒 - Get analysis detail
- `DELETE /analyses/:id` 🔒 - Delete analysis
- `GET /analyses/dashboard/stats` 🔒 - Get stats untuk dashboard
- `GET /analyses/dashboard/trends` 🔒 - Get trends untuk chart

#### Disease (`/api/diseases`) - Publik

- `GET /diseases` - Get semua penyakit (publik, optional filter `?category=Jamur`)
- `GET /diseases/:id` - Get detail penyakit

#### Feedback (`/api/feedbacks`)

- `POST /feedbacks` 🔒 - Kirim feedback
- `GET /feedbacks` - Get semua feedback (publik)
- `GET /feedbacks/user` 🔒 - Get feedback user

#### Admin (`/api/admin`) 🛡️

- `POST /admin/login` - Login admin (credentials-based, bukan Firebase)
- `GET /admin/profile` 🔒Admin - Profil admin
- `GET /admin/stats` 🔒Admin - Statistik dashboard admin (users, analyses, dll)
- `GET /admin/diseases` 🔒Admin - Daftar penyakit (full CRUD)
- `POST /admin/diseases` 🔒Admin - Tambah penyakit baru
- `PUT /admin/diseases/:id` 🔒Admin - Update penyakit
- `DELETE /admin/diseases/:id` 🔒Admin - Hapus penyakit
- `PUT /admin/diseases/:id/toggle` 🔒Admin - Toggle aktif/nonaktif penyakit
- `GET /admin/models` 🔒Admin - Daftar model ML
- `GET /admin/models/health` 🔒Admin - Status kesehatan ML server
- `POST /admin/models/upload` 🔒Admin - Upload model `.keras` baru (max 250MB via multer)
- `PUT /admin/models/:id/activate` 🔒Admin - Aktifkan model ML
- `DELETE /admin/models/:id` 🔒Admin - Hapus model ML
- `GET /admin/models/active-info` *(publik)* - Info model aktif (dipakai Python server saat startup)

---

## Arsitektur Frontend

### Struktur Folder

```
frontend/src/
├── pages/              # Halaman utama
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── AnalyzePage.jsx
│   ├── DashboardPage.jsx
│   ├── HistoryPage.jsx
│   ├── DiseasesPage.jsx
│   ├── ProfilePage.jsx
│   ├── RegisterPage.jsx
│   └── admin/
│       ├── AdminLoginPage.jsx
│       ├── AdminDashboardPage.jsx
│       ├── AdminDiseasesPage.jsx
│       └── AdminModelsPage.jsx
├── components/         # Reusable components
│   ├── Navigation.jsx
│   ├── DiseaseCard.jsx
│   ├── LoadingSpinner.jsx
│   ├── Toast.jsx
│   ├── StatCard.jsx
│   ├── OfflineIndicator.jsx
│   ├── SplashScreen.jsx
│   ├── InstallPrompt.jsx
│   ├── ConfirmDialog.jsx
│   ├── Footer.jsx
│   └── admin/
│       └── AdminLayout.jsx
├── hooks/             # Custom hooks
│   ├── data.js        # Semua API calls (user & admin)
│   └── useToast.jsx   # Toast notifications
├── utils/             # Utilities
│   ├── config.js      # Base URL config
│   ├── firebaseClient.js  # Firebase auth
│   └── token.js       # JWT token management
└── App.jsx            # Main component (routing, auth state)
```

### Routing & Auth Guard

App.jsx menangani dua sistem auth yang terpisah:

| Route | Auth | Redirect jika gagal |
|---|---|---|
| `/` | Publik | — |
| `/diseases` | Publik | — |
| `/login` | Publik (redirect jika sudah login) | `/dashboard` |
| `/dashboard` | Firebase JWT | `/login` |
| `/analyze` | Firebase JWT | `/login` |
| `/history` | Firebase JWT | `/login` |
| `/profile` | Firebase JWT | `/login` |
| `/admin/login` | Publik (redirect jika sudah admin) | `/admin` |
| `/admin` | Admin JWT | `/admin/login` |
| `/admin/diseases` | Admin JWT | `/admin/login` |
| `/admin/models` | Admin JWT | `/admin/login` |

### Fitur PWA

- **Service Worker** - Offline support & background sync
- **Manifest** - Install as native app
- **Offline Page** - Fallback saat offline
- **Cache Strategy** - Cache-first untuk static assets
- **SplashScreen** - Animasi saat app pertama kali dibuka
- **InstallPrompt** - Prompt untuk install PWA di perangkat

---

## ML Server (Python FastAPI)

### Endpoint

```
POST /api/predict
  Body: { "image": "base64_string" }

POST /api/predict-file
  Body: multipart/form-data dengan field "file"

POST /api/reload
  Body: { "filename": "model.keras", "model_type": "mobilenetv2", "url": "..." }

GET /api/models
  — List semua file .keras yang tersedia di folder python/

GET /health
  — Status server, model loaded/standby

GET /
  — Root info
```

### Two-Pass Prediction Pipeline

```
Gambar Masuk (base64 / file)
    │
    ▼
Pass 1: ImageNet Gatekeeper
  (MobileNetV2 / ResNet50 pretrained ImageNet)
  → Cek top-10 prediksi, cocokkan dengan PLANT_KEYWORDS
  → Hitung plant_score (%)
    │
    ├── plant_score >= threshold (1%) → LOLOS
    │
    └── plant_score < threshold
           │
           ▼
        Pass 2: Disease Classifier (SELALU dijalankan)
        (Model custom dilatih pada dataset daun pisang)
           │
           ├── confidence >= 35% → OVERRIDE (percayai disease model)
           │   (daun sakit yang warnanya berubah drastis)
           │
           └── confidence < 35% → TOLAK (bukan daun pisang)
    │
    ▼
Output: { is_banana, detectedDisease, category, severity, confidence, predictions }
```

### Models

- **Primary**: MobileNetV2 (default, lightweight, real-time)
- **Secondary**: ResNet50 (alternatif, lebih besar)
- **Custom Models**: Dapat diupload via Admin Panel (.keras, max 250MB)
- **Auto-Recovery**: Saat server restart, Python server otomatis query `/api/admin/models/active-info` untuk mendapatkan dan download model aktif

### Disease Classes (7 Kelas)

| Index | Nama | Kategori | Severity |
|---|---|---|---|
| 0 | Black Sigatoka | Jamur | Berat |
| 1 | Bract Mosaic Virus | Virus | Sedang |
| 2 | Healthy Leaf | Sehat | Ringan |
| 3 | Insect Pest | Hama | Sedang |
| 4 | Moko Disease | Bakteri | Berat |
| 5 | Panama Disease | Jamur | Berat |
| 6 | Yellow Sigatoka | Jamur | Sedang |

---

## Database Schema (MongoDB via Prisma)

### User (`users`)
```
- id: ObjectId
- email: String (unique)
- name: String
- avatar: String?
- provider: String (default: "google")
- providerId: String? (unique, Firebase UID)
- notifications: Boolean (default: true)
- language: String (default: "id")
- createdAt: DateTime
- updatedAt: DateTime
- lastLoginAt: DateTime?
- isDeleted: Boolean (soft delete)
- deletedAt: DateTime?
```

### Analysis (`analyses`)
```
- id: ObjectId
- userId: ObjectId (FK → User, Cascade Delete)
- imageUrl: String? (null — gambar tidak disimpan)
- imageSize: Int? (bytes)
- detectedDisease: String
- diseaseId: ObjectId? (FK → Disease, nullable)
- confidence: Float
- status: String (completed | failed)
- predictions: Json
- notes: String?
- createdAt: DateTime
- updatedAt: DateTime
- isDeleted: Boolean (soft delete)
- deletedAt: DateTime?
```

### Disease (`diseases`)
```
- id: ObjectId
- name: String
- description: String
- category: String (Jamur | Bakteri | Virus | Hama | Sehat)
- severity: String (Ringan | Sedang | Berat)
- symptoms: String[]
- prevention: String[]
- treatment: String[]
- imageUrl: String?
- isActive: Boolean (default: true) ← Admin bisa toggle
- createdAt: DateTime
- updatedAt: DateTime
```

### Feedback (`feedback`)
```
- id: ObjectId
- userId: ObjectId (FK → User, Cascade Delete)
- message: String
- rating: Int? (1-5)
- createdAt: DateTime
- updatedAt: DateTime
```

### Admin (`admins`)
```
- id: ObjectId
- email: String (unique)
- password: String (bcrypt hashed)
- name: String
- role: String (default: "admin")
- createdAt: DateTime
- updatedAt: DateTime
```

### MlModel (`ml_models`) ← Model Baru
```
- id: ObjectId
- name: String (display name, e.g. "MobileNetV2 Final")
- filename: String (file on disk, e.g. "model_mobilenetv2_final.keras")
- modelType: String ("mobilenetv2" | "resnet50" | "custom")
- isActive: Boolean (default: false)
- fileSize: Int? (bytes)
- uploadedAt: DateTime
- updatedAt: DateTime
```

### Statistic (`statistics`)
```
- id: ObjectId
- diseaseName: String
- diseaseId: ObjectId?
- year: Int
- month: Int (1-12)
- detectionCount: Int
- createdAt: DateTime
- updatedAt: DateTime
```

---

## Security

### User Authentication
- **Firebase Auth** - Google OAuth 2.0 login
- **JWT Tokens** - Backend session (7 hari validity)
- **Token Storage** - localStorage di frontend
- **Redirect Auth** - Support mobile Google sign-in via redirect (bukan popup)

### Admin Authentication
- **Credentials-based** - Email + password (bcrypt hashed, TIDAK menggunakan Firebase)
- **Admin JWT** - Token terpisah dari user JWT
- **Admin Token Storage** - `localStorage.adminToken`
- **Route Isolation** - Admin routes tidak menggunakan user auth middleware

### Protection

- **Rate Limiting** - 100 req/15min (general), 20 req/1min (auth)
- **Helmet** - XSS, clickjacking protection
- **CORS** - Whitelist origins
- **CSP** - Content Security Policy
- **Multer Validation** - Upload model hanya `.keras`, max 250MB, sanitasi nama file

---

## Alur Utama

### Authentication Flow (User)

```
1. User klik Google Sign-In (Frontend)
   ↓
2. Firebase SDK → popup (desktop) / redirect (mobile)
   ↓
3. User authenticates → idToken diterima
   ↓
4. Frontend POST /api/auth/google { idToken }
   ↓
5. Backend verifies via Firebase Admin SDK
   ↓
6. Backend creates/updates User di MongoDB
   ↓
7. Backend generates JWT token
   ↓
8. Frontend simpan JWT di localStorage
   ↓
9. Frontend gunakan JWT untuk semua request
```

### Authentication Flow (Admin)

```
1. Admin buka /admin/login
   ↓
2. Input email + password
   ↓
3. Frontend POST /api/admin/login { email, password }
   ↓
4. Backend verifikasi credentials dari collection "admins"
   ↓
5. bcrypt.compare(password, hashedPassword)
   ↓
6. Generate Admin JWT (terpisah dari user JWT)
   ↓
7. Frontend simpan di localStorage.adminToken
   ↓
8. Frontend redirect ke /admin
```

### Image Analysis Flow

```
1. User pilih gambar (Frontend Analyze page)
   ↓
2. Convert ke base64 via FileReader
   ↓
3. POST /api/analyses/analyze { imageBase64, notes }
   ↓
4. Backend validasi & ekstrak base64
   ↓
5. Backend call ML Server POST /api/predict { image }
   ↓
6. ML Server: Pass 1 — ImageNet Gatekeeper
   ↓
7. ML Server: Pass 2 — Disease Classifier
   ↓
8. ML Server return hasil: { is_banana, detectedDisease, confidence, predictions }
   ↓
9. Jika is_banana === false → Backend return "bukan daun pisang"
   ↓
10. Backend simpan Analysis ke MongoDB (imageUrl = null)
    ↓
11. Backend return analysis result
    ↓
12. Frontend tampilkan hasil & update history
```

### ML Model Management Flow (Admin)

```
1. Admin buka /admin/models
   ↓
2. Upload file .keras (max 250MB)
   ↓
3. Backend (multer) simpan file ke folder python/
   ↓
4. Backend simpan metadata ke collection "ml_models"
   ↓
5. Admin klik "Aktifkan Model"
   ↓
6. Backend POST ke ML Server /api/reload { filename, model_type, url }
   ↓
7. ML Server load model baru ke memory
   ↓
8. ML Server simpan active_model.json
   ↓
9. Backend update MlModel.isActive di DB
   ↓
10. Model aktif digunakan untuk prediksi berikutnya
```

### Dashboard Stats Flow

```
1. Frontend loads dashboard
   ↓
2. Request GET /api/analyses/dashboard/stats
   ↓
3. Backend fetch ALL analyses (no pagination)
   ↓
4. Hitung stats:
   - totalAnalyses: count all
   - diseasePrevalence: (disease / total) * 100
   - healthyCount: count healthy
   - avgConfidence: average confidence
   ↓
5. Return aggregated stats
   ↓
6. Frontend render stat cards + charts
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 | UI Library |
| | Vite | Build tool |
| | Tailwind CSS | Styling |
| | Recharts | Charts & visualisasi |
| | Lucide React | Icons |
| | React Router v6 | Client-side routing |
| | Firebase SDK | Google Auth |
| **Backend** | Node.js | Runtime |
| | Express | Framework |
| | Prisma | ORM |
| | MongoDB Atlas | Database |
| | Firebase Admin | Auth verification |
| | JWT (jsonwebtoken) | Session tokens |
| | Helmet | Security headers |
| | Multer | File upload (model ML) |
| | bcrypt | Password hashing |
| **ML** | Python 3 | Language |
| | FastAPI | Framework (bukan Flask lagi) |
| | TensorFlow/Keras | ML Models |
| | MobileNetV2 | Primary model |
| | ResNet50 | Fallback model |
| | Uvicorn | ASGI Server |
| **Storage** | Supabase Storage | ML model files (cloud) |
| **Auth** | Firebase Auth | Google OAuth |
| **Deploy** | Vercel | Frontend |
| | Railway | Backend & ML Server |

---

## 📝 Catatan Penting (v3 Changes)

### ✅ Fitur Baru

- **Admin Panel** — Dashboard admin dengan login terpisah (credentials-based)
- **Admin Disease CRUD** — Admin bisa tambah, edit, hapus, toggle aktif/nonaktif data penyakit
- **ML Model Management** — Admin bisa upload, aktifkan, dan hapus model `.keras` via UI
- **Two-Pass ML Pipeline** — ImageNet Gatekeeper + Disease Classifier dengan override logic
- **Auto-Recovery ML Server** — Python server auto-download model aktif saat restart (Railway)
- **Standby Mode** — ML server tetap berjalan meski tanpa model (bukan crash)
- **Predict-File Endpoint** — Support upload file langsung (multipart/form-data)
- **Mobile Google Auth** — Support redirect-based auth untuk mobile browsers
- **Admin JWT Auth** — Sistem auth terpisah untuk admin dan user
- **isActive toggle** — Disease bisa dinonaktifkan tanpa dihapus
- **MlModel collection** — Tracking semua model yang diupload di database

### ❌ Removed

- Flask → diganti **FastAPI** (lebih modern, async, auto-docs)
- `/api/statistics/user` endpoint (redundan)
- StatisticModel, StatisticService, StatisticController

### ✅ Current

- Dashboard stats menggunakan `/api/analyses/dashboard/stats` (lebih comprehensive)
- Includes: totalAnalyses, diseasePrevalence, healthyCount, avgConfidence
- Stats always calculated from ALL analyses (no pagination)

### 🔧 Best Practices

1. **Image Storage** - Images TIDAK disimpan di database (mencegah bloat)
2. **Soft Delete** - Analysis bisa di-soft delete (isDeleted flag)
3. **ML Fallback** - Jika ML server down, analysis dibuat dengan status "failed"
4. **Pagination** - History menggunakan pagination (limit, skip)
5. **Trends** - Trends dihitung dari 7d/30d/1y terakhir
6. **Admin Isolation** - Admin dan user auth sepenuhnya terpisah (middleware berbeda)
7. **Model Safety** - File upload divalidasi (ekstensi .keras saja, max 250MB, path traversal dicegah)

---

Dokumentasi terakhir update: **June 4, 2026 (v3.1)**
