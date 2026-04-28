# Vercel Deployment - BananaVision Frontend

## Tujuan

Dokumentasi ini menjelaskan langkah men-deploy frontend BananaVision ke Vercel.

## Struktur deployment

Frontend berada di folder `frontend`. Aplikasi dibangun menggunakan Vite dan dideploy sebagai static site.

## Konfigurasi Vercel

1. Tambahkan project baru di Vercel.
2. Pilih repository `BananaVisionV2`.
3. Atur `Root Directory` ke `frontend`.
4. Gunakan perintah build default:
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Environment Variables

Tambahkan environment variables berikut di Vercel Settings > Environment Variables:

- `VITE_API_BASE_URL`
  - Contoh: `https://api.example.com/api`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

> Pastikan server backend berjalan di URL yang sama dengan `VITE_API_BASE_URL`.

## File konfigurasi

File `frontend/vercel.json` digunakan untuk memberitahu Vercel bahwa ini adalah project Vite static build.

## Cara deploy

1. Commit semua perubahan ke branch `main` atau branch deployment.
2. Push ke GitHub.
3. Di dashboard Vercel, pilih project dan deploy dari branch yang berisi perubahan.
4. Vercel akan menjalankan `npm install` dan `npm run build` secara otomatis.

## Pengujian

Setelah deploy selesai, buka URL Vercel dari dashboard dan pastikan:

- Halaman login muncul.
- Login Google selesai dengan benar.
- API backend dapat diakses melalui `VITE_API_BASE_URL`.

## Catatan tambahan

- Jika menggunakan fitur PWA offline, pastikan `service-worker.js` berada di `public/`.
- Jika mengalami path issue, pastikan `base` di `vite.config.js` tidak terpasang kecuali diperlukan.
