# Panduan Penggunaan Fitur Analisis Penyakit Daun Pisang

## Deskripsi Fitur

Fitur analisis memungkinkan pengguna untuk mendeteksi penyakit pada daun pisang melalui upload gambar atau menggunakan kamera perangkat. Sistem menggunakan model machine learning untuk mengidentifikasi 7 jenis kondisi daun pisang.

## Penyakit yang Dapat Dideteksi

1. **Black Sigatoka** - Penyakit jamur berat
2. **Bract Mosaic Virus** - Penyakit virus sedang
3. **Healthy Leaf** - Daun sehat
4. **Insect Pest** - Serangan hama sedang
5. **Moko Disease** - Penyakit bakteri berat
6. **Panama Disease** - Penyakit jamur berat
7. **Yellow Sigatoka** - Penyakit jamur sedang

## Cara Penggunaan

### 1. Akses Halaman Analisis

- Login ke aplikasi BananaVision
- Klik menu "Analisis" atau navigasi ke halaman analisis

### 2. Pilih Gambar

Terdapat 3 cara untuk memilih gambar:

#### A. Upload dari Galeri/Storage

- Klik tombol "Pilih File"
- Pilih gambar dari galeri perangkat
- Mendukung format JPG, PNG

#### B. Menggunakan Kamera

- Klik tombol "Buka Kamera"
- Izinkan akses kamera jika diminta
- Ambil foto daun pisang
- Pastikan pencahayaan cukup dan fokus pada daun

#### C. Drag & Drop

- Seret gambar dari desktop/file explorer
- Lepaskan di area upload

### 3. Analisis Gambar

- Setelah gambar dipilih, klik "Analisis Sekarang"
- Tunggu proses analisis (beberapa detik)
- Progress bar akan menunjukkan status analisis

### 4. Melihat Hasil Analisis

#### Hasil Berhasil

- **Nama Penyakit**: Ditampilkan dengan jelas
- **Tingkat Kepercayaan**: Persentase akurasi deteksi (0-100%)
- **Kategori**: Jenis penyakit (Jamur, Virus, Bakteri, Hama, Sehat)
- **Severity**: Tingkat keparahan (Ringan, Sedang, Berat)

#### Jika Daun Sehat

- Pesan konfirmasi daun dalam kondisi sehat
- Saran perawatan rutin

#### Jika Terinfeksi Penyakit

- Rekomendasi tindakan:
  - Isolasi tanaman terinfeksi
  - Konsultasi dengan ahli pertanian
  - Penggunaan fungisida/pestisida sesuai
  - Tingkatkan sanitasi kebun
- Tombol "Pelajari Lebih Lanjut" untuk detail penyakit

### 5. Opsi Setelah Analisis

- **Analisis Gambar Baru**: Hapus gambar saat ini dan pilih gambar baru
- **Pelajari Lebih Lanjut**: Navigasi ke halaman detail penyakit
- Hasil analisis tersimpan dalam riwayat untuk dilihat di halaman History

## Tips untuk Hasil Analisis Terbaik

1. **Pencahayaan**: Pastikan cahaya cukup, hindari bayangan berlebih
2. **Fokus**: Gambar harus fokus pada daun, hindari latar belakang yang ramai
3. **Jarak**: Ambil gambar dari jarak sedang (20-50 cm)
4. **Kualitas**: Gunakan resolusi tinggi untuk detail yang lebih baik
5. **Sudut**: Ambil dari berbagai sudut jika memungkinkan

## Troubleshooting

- **Gagal Upload**: Pastikan ukuran file tidak terlalu besar (< 10MB)
- **Kamera Tidak Bisa Dibuka**: Periksa izin kamera di browser/perangkat
- **Analisis Gagal**: Periksa koneksi internet, coba lagi
- **Hasil Tidak Akurat**: Sistem ML memiliki keterbatasan, konsultasikan dengan ahli

## Riwayat Analisis

- Semua analisis tersimpan di halaman History
- Dapat dilihat statistik dan tren analisis
- Data tersimpan di akun pengguna

## Dukungan Teknis

Jika mengalami masalah, hubungi tim dukungan atau lihat dokumentasi API untuk developer.
