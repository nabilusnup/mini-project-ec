# Frontend

Frontend Mini Project EC dibangun menggunakan Nuxt 4 dan Vue 3. Aplikasi ini
mengakses REST API Laravel dan menggunakan Google reCAPTCHA pada halaman login.

## Kebutuhan

- Node.js 22.19 atau lebih baru
- npm
- Backend Laravel yang sudah berjalan

## Instalasi lokal

```bash
cd frontend
npm install
cp .env.example .env
```

Untuk PowerShell, salin environment dengan `Copy-Item .env.example .env`.

Isi `frontend/.env`:

```env
NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Perintah npm

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run preview` | Menjalankan production build secara lokal |
| `npm run generate` | Menghasilkan versi static |

## Environment variables

| Variable | Keterangan |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | URL publik backend Laravel tanpa akhiran `/api` |
| `NUXT_PUBLIC_RECAPTCHA_SITE_KEY` | Site key Google reCAPTCHA |

Contoh production:

```env
NUXT_PUBLIC_API_BASE_URL=https://nama-backend.onrender.com
NUXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key
```

Karena kedua variable bersifat `PUBLIC`, jangan menaruh API key Elasticsearch
atau secret reCAPTCHA di frontend.

## Deployment Vercel

1. Import repository GitHub ke Vercel.
2. Atur **Root Directory** menjadi `frontend`.
3. Vercel akan mendeteksi Nuxt dan menggunakan `npm run build`.
4. Tambahkan kedua environment variables di atas.
5. Deploy dan tambahkan domain Vercel ke daftar domain Google reCAPTCHA.

Deploy backend terlebih dahulu agar nilai `NUXT_PUBLIC_API_BASE_URL` tersedia.
