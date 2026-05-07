# Arsitektur — BananaVision

## Diagram Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│   React PWA (Vite + Tailwind + Firebase Auth SDK)           │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS + JWT
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express 5)                        │
│  Routes → Controllers → Services → Models → Prisma (MongoDB) │
│                                                               │
│  Middleware: Helmet | CORS | RateLimit | Auth (JWT/Firebase) │
└────────────┬──────────────────────────┬────────────────────┘
             │ Verify idToken           │ HTTP POST base64
             ▼                          ▼
┌─────────────────┐          ┌─────────────────────────────┐
│  Firebase Auth  │          │   ML Server (FastAPI)        │
│  (Google OIDC)  │          │   MobileNetV2 + TensorFlow  │
└─────────────────┘          │   Deployed: Railway          │
                              └─────────────────────────────┘
```

## Alur Autentikasi

```
User → Google Sign-In (Firebase SDK)
     → Firebase ID Token
     → POST /api/auth/google { idToken }
     → Backend verifikasi token via Firebase Admin SDK
     → Buat/update user di MongoDB
     → Return JWT (7 hari)
     → Frontend simpan JWT di localStorage
     → Semua request berikutnya: Authorization: Bearer <jwt>
```

## Alur Analisis Gambar

```
User pilih gambar
  → FileReader.readAsDataURL()
  → Extract base64 string (tanpa prefix data:image/...)
  → POST /api/analyses/analyze { imageBase64 }
  → Backend → ML Server /api/predict { image: base64 }
  → ML Server: decode → preprocess (224x224) → MobileNetV2 → softmax
  → Return: { detectedDisease, confidence, predictions[] }
  → Backend simpan Analysis ke MongoDB (imageUrl = null)
  → Return hasil ke frontend
  → Frontend tampilkan hasil + simpan di AnalyzePage state
```

> Gambar **tidak disimpan** di database untuk mencegah bloat. Hanya hasil deteksi yang disimpan.

## Struktur Backend (MVC)

```
backend/
├── app.js                    # Express app, middleware, routes
├── server.js                 # HTTP server entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Data penyakit (7 kelas ML)
└── src/
    ├── controllers/          # Handle HTTP req/res
    │   ├── analysis.controller.js
    │   ├── auth.controller.js
    │   ├── disease.controller.js
    │   └── feedback.controller.js
    ├── services/             # Business logic
    │   ├── analysis.service.js  ← komunikasi ke ML server
    │   ├── auth.service.js
    │   ├── disease.service.js
    │   └── feedback.service.js
    ├── models/               # Database queries (Prisma)
    │   ├── analysisModel.js
    │   ├── authModel.js
    │   ├── diseaseModel.js
    │   └── feedbackModel.js
    ├── routes/               # Express Router
    ├── middleware/
    │   └── auth.js           # JWT verify middleware
    ├── validators/           # express-validator rules
    └── utils/
        ├── jwt.js
        └── response.js
```

## Struktur Frontend (React)

```
frontend/src/
├── App.jsx                   # Root state, routing, auth
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── AnalyzePage.jsx       # Upload + analisis + feedback
│   ├── HistoryPage.jsx
│   ├── DiseasesPage.jsx      # Disease catalog (public)
│   └── ProfilePage.jsx
├── components/
│   └── Navigation.jsx        # Desktop navbar + mobile sidebar + bottom nav
├── hooks/
│   └── data.js               # Semua fungsi fetch API
└── utils/
    ├── token.js              # JWT storage helpers
    ├── config.js             # Firebase config
    └── firebaseClient.js     # Firebase Auth init
```

## Keamanan

| Layer | Mekanisme |
|---|---|
| Auth | Firebase Google Sign-In + JWT (7 hari) |
| API Protection | `authenticate` middleware pada semua route |
| CORS | Whitelist origin via `CLIENT_URL` env |
| Rate Limit | 100 req / 15 menit per IP |
| Headers | Helmet (CSP disesuaikan untuk Firebase) |
| Disease Data | Read-only via API, hanya bisa diubah via seed |

## Data Flow — Disease Data

```
ML Model training → 7 kelas penyakit
                  → prisma/seed.js
                  → npx prisma db seed (sekali saat setup)
                  → MongoDB collection "diseases"
                  → GET /api/diseases (public, read-only)
                  → Frontend DiseasesPage & AnalyzePage
```
