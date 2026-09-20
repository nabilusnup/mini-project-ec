# Backend

Backend Mini Project EC adalah REST API berbasis Laravel 11. Data aplikasi dan
token autentikasi disimpan di Elasticsearch.

## Kebutuhan

- PHP 8.2 atau lebih baru
- Composer
- Elasticsearch 8 lokal atau deployment Elastic Cloud

## Instalasi lokal

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Untuk PowerShell, salin environment dengan `Copy-Item .env.example .env`.

### Elasticsearch lokal

Jalankan dari direktori root proyek:

```bash
docker compose up -d
```

Gunakan konfigurasi berikut:

```env
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_CLOUD_ID=
ELASTICSEARCH_API_KEY=
```

### Elastic Cloud

```env
ELASTICSEARCH_CLOUD_ID=your_cloud_id
ELASTICSEARCH_API_KEY=your_encoded_api_key
```

Jika kedua nilai tersedia, Laravel menggunakan Elastic Cloud.
`ELASTICSEARCH_URL` hanya menjadi fallback ketika konfigurasi cloud kosong.

Tambahkan secret reCAPTCHA lalu jalankan backend:

```env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

```bash
php artisan serve
```

API tersedia di `http://127.0.0.1:8000`, sedangkan health check tersedia di
`http://127.0.0.1:8000/up`.

## Endpoint utama

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/api/login` | Login dengan email, password, dan reCAPTCHA |
| `POST` | `/api/logout` | Logout pengguna |
| `GET` | `/api/me` | Mendapatkan pengguna aktif |
| `GET` | `/api/profile` | Mendapatkan profil karyawan |
| `GET/POST` | `/api/employees` | Daftar atau membuat karyawan |
| `GET/PUT/DELETE` | `/api/employees/{employeeId}` | Detail, edit, atau hapus karyawan |
| `GET/POST/DELETE` | `/api/terbilang` | Mengelola riwayat terbilang |
| `GET/POST/DELETE` | `/api/stars` | Mengelola riwayat bintang |

Selain login, endpoint API memerlukan `Authorization: Bearer <token>`.

## Deployment Render

Backend memiliki `Dockerfile` untuk Apache pada port `10000`.

1. Pilih repository GitHub proyek dan runtime **Docker**.
2. Atur **Root Directory** menjadi `backend`.
3. Pilih instance **Free** dan health check path `/up`.
4. Tambahkan environment variables berikut:

```env
APP_NAME=Mini Project EC
APP_ENV=production
APP_KEY=base64:your_generated_app_key
APP_DEBUG=false
APP_URL=https://nama-backend.onrender.com
LOG_CHANNEL=stderr
ELASTICSEARCH_CLOUD_ID=your_cloud_id
ELASTICSEARCH_API_KEY=your_encoded_api_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

Buat nilai `APP_KEY` secara lokal dengan `php artisan key:generate --show`.
Jangan commit `.env`, Cloud ID, API key, atau secret reCAPTCHA.
