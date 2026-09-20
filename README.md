# Mini Project EC

Aplikasi web sederhana untuk mengelola data karyawan, riwayat terbilang, dan
bintang. Proyek menggunakan arsitektur frontend dan backend terpisah.

## Arsitektur

```text
Nuxt frontend -> Laravel REST API -> Elasticsearch
```

| Bagian         | Teknologi            | Rencana deployment |
| -------------- | -------------------- | ------------------ |
| Frontend       | Nuxt 4 / Vue 3       | Vercel             |
| Backend        | Laravel 11 / PHP 8.2 | Render             |
| Database NoSQL | Elasticsearch 8      | Elastic Cloud      |

## Struktur proyek

```text
mini-project-ec/
|- frontend/   Aplikasi dan antarmuka Nuxt
|- backend/    REST API Laravel
|- docker-compose.yml
`- README.md
```

Petunjuk lengkap masing-masing aplikasi tersedia di:

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)

## Menjalankan secara lokal

1. Jalankan Elasticsearch lokal dengan `docker compose up -d` atau gunakan
   kredensial Elastic Cloud pada backend.
2. Ikuti petunjuk instalasi pada `backend/README.md`.
3. Ikuti petunjuk instalasi pada `frontend/README.md`.

Jangan commit file `.env` atau kredensial Elastic Cloud ke repository.
