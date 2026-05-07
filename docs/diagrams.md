# UML Diagrams — BananaVision

Diagram untuk keperluan laporan tugas akhir. Dibuat menggunakan Mermaid.

---

## 1. Use Case Diagram

```mermaid
graph LR
    U(["👤 User"])

    subgraph SYS["🖥️ Sistem BananaVision"]
        direction TB
        UC1(["Login dengan Google"])
        UC2(["Analisis Gambar Daun"])
        UC3(["Lihat Riwayat Analisis"])
        UC4(["Lihat Dashboard Statistik"])
        UC5(["Lihat Katalog Penyakit"])
        UC6(["Kirim Feedback"])
        UC7(["Lihat Profil"])
        UC8(["Logout"])
    end

    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8

    UC2 -. "«include»" .-> UC1
    UC3 -. "«include»" .-> UC1
    UC4 -. "«include»" .-> UC1
    UC6 -. "«include»" .-> UC1
    UC7 -. "«include»" .-> UC1
    UC8 -. "«include»" .-> UC1
```

---

## 2. Activity Diagram — Analisis Gambar Daun

```mermaid
flowchart TD
    Start(["🔵 Start"]) --> A["Buka Aplikasi BananaVision"]
    A --> B{"Sudah Login?"}

    B -- Tidak --> C["Klik Sign in with Google"]
    C --> D["Firebase Google Sign-In Pop-up"]
    D --> E{"Auth Berhasil?"}
    E -- Tidak --> ERR1(["❌ Tampilkan Pesan Error"])
    E -- Ya --> F["Terima Firebase ID Token"]
    F --> G["POST /api/auth/google"]
    G --> H["Backend Verifikasi Token"]
    H --> I["Simpan JWT ke localStorage"]
    I --> J["Masuk ke Dashboard"]

    B -- Ya --> J
    J --> K["Buka Halaman Analisis"]
    K --> L{"Pilih Sumber Gambar"}

    L -- Upload File --> M["Pilih File dari Perangkat"]
    L -- Kamera --> N["Ambil Foto via Kamera"]

    M --> O["FileReader → Encode Base64"]
    N --> O

    O --> P["Klik Tombol Analisis"]
    P --> Q["POST /api/analyses/analyze"]
    Q --> R{"ML Server\nTersedia?"}

    R -- Tidak --> S["Simpan Status: failed"]
    S --> T["Tampilkan Pesan Error ML Server"]

    R -- Ya --> U["MobileNetV2 Prediksi"]
    U --> V["Return: disease, confidence, predictions"]
    V --> W["Simpan Analysis ke MongoDB"]
    W --> X["Tampilkan Hasil Deteksi"]

    X --> Y{"Kirim Feedback?"}
    Y -- Ya --> Z["Isi Rating & Pesan"]
    Z --> AA["POST /api/feedbacks"]
    AA --> End(["🔵 End"])

    Y -- Tidak --> End
    T --> End
    ERR1 --> End
```

---

## 3. Sequence Diagram — Login & Analisis

```mermaid
sequenceDiagram
    actor User as 👤 User
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant FB as Firebase Auth
    participant ML as ML Server (FastAPI)
    participant DB as MongoDB

    rect rgb(220, 240, 220)
        Note over User,DB: Alur 1 — Login dengan Google
        User->>FE: Klik "Sign in with Google"
        FE->>FB: signInWithPopup(GoogleProvider)
        FB-->>FE: Firebase ID Token
        FE->>BE: POST /api/auth/google { idToken }
        BE->>FB: admin.verifyIdToken(idToken)
        FB-->>BE: { uid, email, name, picture }
        BE->>DB: upsert User (findOrCreate by providerId)
        DB-->>BE: User document
        BE-->>FE: { user, token: JWT(7d) }
        FE->>FE: localStorage.setItem("token", jwt)
        FE->>User: Redirect ke Dashboard
    end

    rect rgb(220, 230, 245)
        Note over User,DB: Alur 2 — Analisis Gambar
        User->>FE: Upload / Foto gambar daun
        FE->>FE: FileReader → base64 string
        FE->>BE: POST /api/analyses/analyze\n{ imageBase64, notes }
        BE->>BE: Verify JWT middleware
        alt ML Server Aktif
            BE->>ML: POST /api/predict { image: base64 }
            ML->>ML: Decode → Resize 224x224\n→ MobileNetV2 → Softmax
            ML-->>BE: { detectedDisease, confidence, predictions[] }
            BE->>DB: Disease.findByName(detectedDisease)
            DB-->>BE: Disease document (atau null)
            BE->>DB: Analysis.create({ imageUrl: null, ... })
            DB-->>BE: Analysis document
            BE-->>FE: { success: true, data: analysis }
            FE->>User: Tampilkan hasil deteksi
        else ML Server Down
            BE->>DB: Analysis.create({ status: "failed" })
            DB-->>BE: Analysis document
            BE-->>FE: { success: true, data: { status: "failed" } }
            FE->>User: Tampilkan pesan "ML Server tidak tersedia"
        end
    end

    rect rgb(245, 235, 220)
        Note over User,DB: Alur 3 — Kirim Feedback
        User->>FE: Isi rating & pesan feedback
        FE->>BE: POST /api/feedbacks\n{ message, rating }
        BE->>BE: Verify JWT + Validate input
        BE->>DB: Feedback.create({ userId, message, rating })
        DB-->>BE: Feedback document
        BE-->>FE: { success: true }
        FE->>User: Tampilkan konfirmasi terima kasih
    end
```

---

## 4. Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +String id
        +String email
        +String name
        +String? avatar
        +String provider
        +String? providerId
        +Boolean notifications
        +String language
        +DateTime createdAt
        +DateTime? lastLoginAt
        +Boolean isDeleted
    }

    class Analysis {
        +String id
        +String userId
        +String? imageUrl
        +String detectedDisease
        +String? diseaseId
        +Float confidence
        +String status
        +Json predictions
        +String? notes
        +DateTime createdAt
        +Boolean isDeleted
    }

    class Disease {
        +String id
        +String name
        +String description
        +String category
        +String severity
        +String[] symptoms
        +String[] prevention
        +String[] treatment
        +String? imageUrl
        +Boolean isActive
        +DateTime createdAt
    }

    class Feedback {
        +String id
        +String userId
        +String message
        +Int? rating
        +DateTime createdAt
    }

    class AuthService {
        +verifyFirebaseToken(idToken) User
        +getUserProfile(userId) User
        +updateUserProfile(userId, data) User
    }

    class AnalysisService {
        +analyzeImage(userId, base64, notes) Analysis
        +getAnalysesByUserId(userId) Analysis[]
        +getAnalysisById(id) Analysis
        +deleteAnalysis(id) Analysis
        +getDashboardStats(userId) Stats
        +getDashboardTrends(userId, period) Trend[]
    }

    class DiseaseService {
        +getDiseases(filters) Disease[]
        +getDiseaseById(id) Disease
        +getDiseaseByName(name) Disease
    }

    class FeedbackService {
        +createFeedback(data) Feedback
        +getFeedbacks() Feedback[]
        +getFeedbacksByUserId(userId) Feedback[]
        +updateFeedback(id, data) Feedback
        +deleteFeedback(id) void
    }

    class MLServer {
        +predict(imageBase64) PredictionResult
        +predictFile(file) PredictionResult
    }

    class PredictionResult {
        +String detectedDisease
        +Float confidence
        +Array predictions
    }

    User "1" --> "0..*" Analysis : memiliki
    User "1" --> "0..*" Feedback : mengirim
    Disease "1" --> "0..*" Analysis : terdeteksi pada
    Analysis --> PredictionResult : menyimpan hasil
    MLServer --> PredictionResult : menghasilkan

    AuthService ..> User : mengelola
    AnalysisService ..> Analysis : mengelola
    AnalysisService ..> MLServer : memanggil
    AnalysisService ..> Disease : lookup
    DiseaseService ..> Disease : membaca
    FeedbackService ..> Feedback : mengelola
```
