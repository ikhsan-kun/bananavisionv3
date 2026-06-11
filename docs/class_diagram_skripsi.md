# Class Diagram — BananaVision v3.2 (Sederhana - Standar Skripsi)

Dokumen ini berisi rancangan **Class Diagram** untuk basis data (tabel/koleksi) sistem **BananaVision** yang disederhanakan agar mudah dipahami dan sesuai dengan standar skripsi umum (fokus pada nama tabel, atribut/field, operation/metode CRUD, dan relasi antar tabel).

---

## 1. Kode PlantUML Class Diagram (Sederhana)

```plantuml
@startuml
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam shadowing false
skinparam class {
    BackgroundColor White
    ArrowColor #2C3E50
    BorderColor #2C3E50
}

class User {
  + id: ObjectId
  + email: String
  + name: String
  + avatar: String
  + provider: String
  + providerId: String
  + notifications: Boolean
  + language: String
  + createdAt: DateTime
  + updatedAt: DateTime
  + lastLoginAt: DateTime
  + isDeleted: Boolean
  + deletedAt: DateTime
  --
  + findById(id: String): User
  + findByEmail(email: String): User
  + findByProviderId(providerId: String): User
  + create(data: Object): User
  + update(id: String, data: Object): User
  + updateLastLogin(id: String): User
  + delete(id: String): User
}

class Analysis {
  + id: ObjectId
  + userId: ObjectId
  + imageUrl: String
  + imageSize: Int
  + detectedDisease: String
  + diseaseId: ObjectId
  + confidence: Float
  + status: String
  + predictions: Json
  + notes: String
  + createdAt: DateTime
  + updatedAt: DateTime
  + isDeleted: Boolean
  + deletedAt: DateTime
  --
  + createAnalysis(data: Object): Analysis
  + getAnalysisById(id: String): Analysis
  + getAnalysesByUserId(userId: String, opts: Object): Analysis[]
  + countByUserId(userId: String): Int
  + deleteAnalysis(id: String): Analysis
}

class Disease {
  + id: ObjectId
  + name: String
  + description: String
  + category: String
  + severity: String
  + symptoms: String[]
  + prevention: String[]
  + treatment: String[]
  + imageUrl: String
  + isActive: Boolean
  + createdAt: DateTime
  + updatedAt: DateTime
  --
  + createDisease(data: Object): Disease
  + getDiseaseById(id: String): Disease
  + getDiseaseByName(name: String): Disease
  + getDiseases(filters: Object): Disease[]
  + updateDisease(id: String, data: Object): Disease
  + deleteDisease(id: String): Disease
  + getAllCategories(): String[]
}

class Feedback {
  + id: ObjectId
  + userId: ObjectId
  + message: String
  + rating: Int
  + createdAt: DateTime
  + updatedAt: DateTime
  --
  + createFeedback(data: Object): Feedback
  + getFeedbacks(): Feedback[]
  + getFeedbacksByUserId(userId: String): Feedback[]
  + updateFeedback(id: String, data: Object): Feedback
  + deleteFeedback(id: String): Feedback
}

class Admin {
  + id: ObjectId
  + email: String
  + password: String
  + name: String
  + role: String
  + createdAt: DateTime
  + updatedAt: DateTime
  --
  + findById(id: String): Admin
  + findByEmail(email: String): Admin
  + create(data: Object): Admin
  + update(id: String, data: Object): Admin
  + count(): Int
}

class MlModel {
  + id: ObjectId
  + name: String
  + filename: String
  + modelType: String
  + isActive: Boolean
  + fileSize: Int
  + uploadedAt: DateTime
  + updatedAt: DateTime
  --
  + create(data: Object): MlModel
  + findById(id: String): MlModel
  + findActive(): MlModel
  + findByFilename(filename: String): MlModel
  + findAll(): MlModel[]
  + update(id: String, data: Object): MlModel
  + deactivateAllExcept(activeId: String): void
  + delete(id: String): MlModel
}

' Relasi antar tabel
User "1" -- "0..*" Analysis : has >
User "1" -- "0..*" Feedback : submits >
Disease "1" -- "0..*" Analysis : identified_in >
Admin "1" -- "0..*" MlModel : manages >
@enduml
```

---

## 2. Penjelasan Relasi & Multiplisitas

1. **User ke Analysis (1 to 0..\*)**
   * **Arti**: Satu pengguna (*User*) dapat memiliki banyak riwayat analisis daun pisang (*Analysis*), namun satu analisis hanya dimiliki oleh satu pengguna.
   * **Foreign Key**: Diwakili oleh kolom `userId` pada tabel `Analysis`.

2. **User ke Feedback (1 to 0..\*)**
   * **Arti**: Satu pengguna (*User*) dapat mengirimkan banyak masukan (*Feedback*), namun setiap ulasan feedback hanya ditulis oleh satu pengguna.
   * **Foreign Key**: Diwakili oleh kolom `userId` pada tabel `Feedback`.

3. **Disease ke Analysis (1 to 0..\*)**
   * **Arti**: Satu jenis penyakit (*Disease*) dapat terdeteksi di dalam banyak analisis gambar daun pisang, namun satu analisis yang berhasil hanya mengacu pada satu diagnosis penyakit (atau sehat).
   * **Foreign Key**: Diwakili oleh kolom `diseaseId` pada tabel `Analysis`.

4. **Admin ke MlModel (1 to 0..\*) - Relasi Konseptual**
   * **Arti**: Satu administrator (*Admin*) dapat mengelola (unggah, aktifkan, hapus) banyak model machine learning (*MlModel*).
   * **Keterangan**: Relasi ini bersifat konseptual di tingkat aplikasi. Di database fisik MongoDB, relasi ini tidak memiliki *Foreign Key* langsung.
