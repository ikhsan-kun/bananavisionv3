# Laporan Pengujian Black Box Lengkap — BananaVision v3.2

Pengujian *Black Box* (kotak hitam) berfokus pada pengujian fungsionalitas sistem berdasarkan spesifikasi kebutuhan tanpa harus mengetahui struktur internal kode program. Pengujian ini bertujuan untuk menemukan kesalahan dalam kategori berikut:
1. Fungsi-fungsi yang tidak benar atau hilang.
2. Kesalahan antarmuka (interface).
3. Kesalahan dalam struktur data atau akses database.
4. Kesalahan performa atau validasi input.
5. Inisialisasi dan kesalahan terminasi.

Pengujian dibagi menjadi **Kasus Uji Positif** (masukan valid) dan **Kasus Uji Negatif** (masukan tidak valid/uji batas) untuk membuktikan ketahanan sistem.

---

## 1. MODUL 1: AUTENTIKASI PENGGUNA (USER AUTHENTICATION)

Tujuan: Memverifikasi fungsionalitas registrasi, masuk sistem (*login*), pengelolaan sesi (*JWT Session*), dan profil pengguna.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-UA-01** | Login dengan Google OAuth (Positif) | Firebase Google ID Token valid | 1. Buka halaman login.<br>2. Klik "Login dengan Google".<br>3. Pilih akun Google valid. | Pengguna berhasil login, dialihkan ke `/dashboard`, token disimpan di LocalStorage. | Sesuai harapan | **PASSED** |
| **TC-UA-02** | Login Google OAuth dengan Token Kadaluwarsa (Negatif) | Firebase ID Token expired | 1. Kirim request POST ke `/api/auth/google`. | Server mengembalikan kode `401 Unauthorized` dengan pesan "Invalid Firebase token". | Sesuai harapan | **PASSED** |
| **TC-UA-03** | Ambil Data Profil Pengguna (Positif) | Header: `Authorization Bearer JWT` | 1. Masuk ke aplikasi.<br>2. Buka menu `/profile`. | Informasi pengguna (nama, email, avatar, preferensi) tampil lengkap di layar. | Sesuai harapan | **PASSED** |
| **TC-UA-04** | Ambil Profil Tanpa Login / Tanpa Token (Negatif) | Header: `Authorization` kosong | 1. Akses langsung URL `/api/auth/profile` via Postman tanpa token. | Server mengembalikan kode `401 Unauthorized` dengan pesan "Invalid token". | Sesuai harapan | **PASSED** |
| **TC-UA-05** | Perbarui Profil Pengguna (Positif) | Nama baru, preferensi bahasa ("id"), status notifikasi | 1. Buka menu `/profile`.<br>2. Ubah data nama & bahasa.<br>3. Klik "Simpan Profil". | Database terupdate, muncul notifikasi sukses "berhasil memperbarui data profile user". | Sesuai harapan | **PASSED** |
| **TC-UA-06** | Perbarui Profil dengan Input Tidak Valid (Negatif) | Nama kosong/hanya spasi | 1. Buka formulir profil.<br>2. Kosongkan kolom nama.<br>3. Klik "Simpan Profil". | Sistem memblokir aksi di frontend (required input) atau API mengembalikan respon gagal. | Sesuai harapan | **PASSED** |
| **TC-UA-07** | Verifikasi Token Sesi Valid (Positif) | Token JWT valid | 1. Refresh halaman aplikasi web. | Aplikasi mendeteksi token aktif, memanggil `/api/auth/verify-token`, status tetap terautentikasi. | Sesuai harapan | **PASSED** |
| **TC-UA-08** | Verifikasi Token Sesi Kadaluwarsa (Negatif) | Token JWT expired / dimodifikasi | 1. Modifikasi token di LocalStorage secara acak.<br>2. Refresh halaman. | Sistem memanggil API verifikasi, menerima kode `401`, menghapus token lokal, dan redirect ke `/login`. | Sesuai harapan | **PASSED** |

---

## 2. MODUL 2: ANALISIS GAMBAR DAUN PISANG (IMAGE ANALYSIS)

Tujuan: Memverifikasi akurasi pendeteksian penyakit daun pisang, validasi filter objek (ImageNet Gatekeeper), penyimpanan riwayat, dan penanganan kegagalan server AI.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-IA-01** | Klasifikasi Daun Pisang Sehat (Positif) | Foto daun pisang sehat (Base64 string) | 1. Buka halaman Deteksi.<br>2. Upload foto daun sehat.<br>3. Klik "Analisis". | Respon sukses, menampilkan hasil diagnosis "Healthy" dengan tingkat confidence tinggi, data tersimpan di DB. | Sesuai harapan | **PASSED** |
| **TC-IA-02** | Klasifikasi Daun Terkena Penyakit Sigatoka (Positif) | Foto daun terkena Sigatoka (Base64 string) | 1. Upload foto daun sakit Sigatoka.<br>2. Klik "Analisis". | Respon sukses, diagnosis "Sigatoka" terdeteksi beserta grafik persentase confidence dan cara penanganan. | Sesuai harapan | **PASSED** |
| **TC-IA-03** | Deteksi Gambar Bukan Daun Pisang (Negatif) | Foto mobil/wajah manusia | 1. Upload foto mobil.<br>2. Klik "Analisis". | ImageNet Gatekeeper memblokir request. Respon `is_banana: false` dengan pesan "Bukan daun pisang". Data tidak disimpan di DB. | Sesuai harapan | **PASSED** |
| **TC-IA-04** | Kirim Request Analisis Tanpa Gambar (Negatif) | File gambar kosong / null | 1. Klik tombol "Analisis" sebelum mengunggah gambar. | Validasi frontend memblokir klik, atau API mengembalikan respon `400 Bad Request` "gambar kosong / tidak valid". | Sesuai harapan | **PASSED** |
| **TC-IA-05** | Penanganan Saat Server AI Offline (Fallback) | Gambar valid, ML Server dihentikan | 1. Matikan ML Server (FastAPI).<br>2. Lakukan analisis gambar. | Sistem mencatat status "failed" pada database, memunculkan pesan "ML server tidak dapat diakses. Silakan coba lagi nanti." di UI. | Sesuai harapan | **PASSED** |
| **TC-IA-06** | Ambil Riwayat Analisis Pengguna (Positif) | Header JWT token valid | 1. Buka halaman Riwayat (History). | Menampilkan daftar analisis yang pernah dilakukan beserta tanggal diagnosis dan catatan. | Sesuai harapan | **PASSED** |
| **TC-IA-07** | Hapus Riwayat Analisis Milik Sendiri (Positif) | `analysisId` valid milik user | 1. Klik "Hapus" pada salah satu riwayat analisis. | Riwayat dihapus secara logis (*soft delete* - isDeleted: true), daftar di UI ter-refresh. | Sesuai harapan | **PASSED** |
| **TC-IA-08** | Hapus Riwayat Analisis Milik Pengguna Lain (Negatif) | `analysisId` milik user lain | 1. Tembak endpoint DELETE `/api/analyses/:id` menggunakan ID riwayat milik akun lain. | Server menolak dengan kode `404 Not Found` atau `403 Forbidden` "Analisis tidak ditemukan". | Sesuai harapan | **PASSED** |

---

## 3. MODUL 3: SARAN DAN ULASAN (FEEDBACK SYSTEM)

Tujuan: Memverifikasi pengiriman feedback pengguna untuk evaluasi kepuasan sistem.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FB-01** | Kirim Feedback Lengkap (Positif) | `message: "Sangat membantu"`, `rating: 5` | 1. Buka form feedback.<br>2. Isi pesan & pilih rating bintang.<br>3. Klik "Kirim". | Data disimpan di MongoDB, muncul pesan sukses "berhasil membuat feedback". | Sesuai harapan | **PASSED** |
| **TC-FB-02** | Kirim Feedback Hanya Pesan (Positif - Opsional Rating) | `message: "Cukup baik"`, rating kosong | 1. Isi pesan saja.<br>2. Klik "Kirim". | Feedback tetap berhasil disimpan karena rating bersifat opsional di skema database. | Sesuai harapan | **PASSED** |
| **TC-FB-03** | Kirim Feedback dengan Pesan Kosong (Negatif) | `message: ""` (kosong), `rating: 3` | 1. Klik "Kirim" dengan kolom pesan kosong. | Sistem menolak pengiriman karena pesan wajib diisi (*required field*). | Sesuai harapan | **PASSED** |

---

## 4. MODUL 4: AUTENTIKASI ADMINISTRATOR (ADMIN AUTHENTICATION)

Tujuan: Memverifikasi hak akses khusus administrator, login credentials, dan enkripsi password bcrypt.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AD-01** | Login Admin dengan Kredensial Valid (Positif) | `email: "admin@bananavision.com"`, `password: "admin123"` | 1. Buka halaman `/admin/login`.<br>2. Isi kredensial valid.<br>3. Klik "Login". | Token JWT Admin dihasilkan, dialihkan ke dashboard panel admin. | Sesuai harapan | **PASSED** |
| **TC-AD-02** | Login Admin dengan Email Tidak Terdaftar (Negatif) | `email: "salah@admin.com"`, `password: "admin123"` | 1. Isi email sembarang.<br>2. Klik "Login". | Respon gagal dengan kode `401 Unauthorized` dengan pesan "Email atau password admin salah". | Sesuai harapan | **PASSED** |
| **TC-AD-03** | Login Admin dengan Password Salah (Negatif) | `email: "admin@bananavision.com"`, `password: "passwordsalah"` | 1. Isi password salah.<br>2. Klik "Login". | Respon gagal dengan kode `401 Unauthorized` dengan pesan "Email atau password admin salah". | Sesuai harapan | **PASSED** |
| **TC-AD-04** | Login Admin Tanpa Input Data (Negatif) | Email kosong, password kosong | 1. Langsung klik "Login". | Frontend memblokir atau API mengembalikan respon `400 Bad Request` "Email dan password wajib diisi". | Sesuai harapan | **PASSED** |
| **TC-AD-05** | Akses Menu Admin Tanpa Login Admin (Negatif) | Header: JWT User biasa (Bukan Admin) | 1. Coba akses endpoint GET `/api/admin/stats` dengan token user biasa. | Middleware menolak dengan status `403 Forbidden` / `401 Unauthorized` (role tidak diizinkan). | Sesuai harapan | **PASSED** |

---

## 5. MODUL 5: KELOLA DATA PENYAKIT (DISEASE MANAGEMENT - CRUD)

Tujuan: Memverifikasi pengelolaan katalog penyakit daun pisang oleh administrator.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DM-01** | Tambah Penyakit Baru Lengkap (Positif) | Nama, deskripsi, kategori, severity, gejala, penanganan | 1. Buka form "Tambah Penyakit".<br>2. Isi semua kolom.<br>3. Klik "Simpan". | Data penyakit baru masuk ke DB, muncul pesan sukses "Berhasil menambahkan data penyakit baru". | Sesuai harapan | **PASSED** |
| **TC-DM-02** | Tambah Penyakit Tanpa Field Wajib (Negatif) | Kategori kosong, severity kosong | 1. Kosongkan kolom kategori & keparahan.<br>2. Klik "Simpan". | Respon kode `400` "Field name, description, category, dan severity wajib diisi". | Sesuai harapan | **PASSED** |
| **TC-DM-03** | Perbarui Data Penyakit (Positif) | Deskripsi baru untuk `id` penyakit valid | 1. Pilih penyakit, klik "Edit".<br>2. Ubah kolom deskripsi.<br>3. Klik "Simpan". | Perubahan diperbarui di database, daftar penyakit di UI langsung ter-update. | Sesuai harapan | **PASSED** |
| **TC-DM-04** | Toggle Status Visibilitas Aktif/Non-aktif (Positif) | `id` penyakit valid, `isActive: false` | 1. Klik toggle switch pada list penyakit. | Status berubah di DB. Penyakit berstatus non-aktif tidak akan tampil pada katalog aplikasi pengguna. | Sesuai harapan | **PASSED** |
| **TC-DM-05** | Hapus Penyakit (Soft-Delete) | `id` penyakit valid, `hard: false` | 1. Klik ikon "Hapus" -> Konfirmasi. | Penyakit disembunyikan secara logis (soft-delete), status `isActive` berubah menjadi `false`. | Sesuai harapan | **PASSED** |

---

## 6. MODUL 6: KELOLA MODEL MACHINE LEARNING (ML MODEL MANAGEMENT)

Tujuan: Memverifikasi sistem upload model `.keras`, proses integrasi dynamic hot-reload ke FastAPI server, penanganan validasi berkas, serta pencegahan kerusakan sistem akibat menghapus model aktif.

| ID Uji | Skenario Pengujian | Masukan (Input Data) | Prosedur / Langkah Pengujian | Hasil yang Diharapkan | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-MM-01** | Unggah Model ML Valid (Positif) | File model `.keras` valid berukuran 40MB | 1. Pilih file `.keras`.<br>2. Isi nama & tipe model.<br>3. Klik "Upload". | File tersimpan di Supabase Storage, database merekam entri model dengan status `isActive: false`. | Sesuai harapan | **PASSED** |
| **TC-MM-02** | Unggah Model dengan Ekstensi Salah (Negatif) | File format `.h5` atau `.zip` | 1. Upload file `.zip`.<br>2. Klik "Upload". | Sistem menolak unggahan di tingkat middleware dengan pesan "Hanya file model dengan ekstensi .keras yang diperbolehkan!". | Sesuai harapan | **PASSED** |
| **TC-MM-03** | Unggah Model Melebihi Batas Ukuran (Negatif) | File `.keras` berukuran 300MB | 1. Pilih file 300MB.<br>2. Klik "Upload". | Sistem mengembalikan respon kode `413 Payload Too Large` dengan pesan "File too large" (batas maksimal 250MB). | Sesuai harapan | **PASSED** |
| **TC-MM-04** | Aktifkan Model ML / Hot-Reload (Positif) | `id` model valid, FastAPI ML Server online | 1. Klik tombol "Aktifkan" pada model non-aktif. | FastAPI memuat model ke memori TensorFlow. Model berhasil diaktifkan tanpa downtime, model lain otomatis dinonaktifkan. | Sesuai harapan | **PASSED** |
| **TC-MM-05** | Hapus Model ML Non-Aktif (Positif) | `id` model valid berstatus non-aktif | 1. Klik tombol hapus pada model non-aktif. | Berkas di Supabase terhapus, data record di database terhapus secara permanen. | Sesuai harapan | **PASSED** |
| **TC-MM-06** | Hapus Model ML Aktif (Negatif) | `id` model berstatus aktif | 1. Klik tombol hapus pada model yang berlabel "Aktif". | Sistem mendeteksi model sedang aktif, memblokir proses penghapusan, dan mengembalikan pesan error. | Sesuai harapan | **PASSED** |
| **TC-MM-07** | Cek Status Kesehatan Server AI (Positif) | ML Server online | 1. Buka menu Models. | Sistem melakukan healthcheck ke ML Server, memunculkan status badge hijau "Online" beserta metrik RAM/CPU server. | Sesuai harapan | **PASSED** |
