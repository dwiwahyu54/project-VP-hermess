# Voyage Report Portal
PT Mentari Mas Multimoda

## Struktur Project

```
voyage-portal/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── ship.svg
└── src/
    ├── main.jsx     ← entry point, render <App/>
    ├── App.jsx      ← seluruh aplikasi (dashboard, form, dll)
    └── index.css    ← global styles
```

## Jalankan di Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Login Demo

- Master: `master@ism.id` / `master123`
- DPA: `dpa@ism.id` / `dpa123`

## Upload ke GitHub

```bash
git init
git add .
git commit -m "Initial commit - Voyage Report Portal"
git branch -M main
git remote add origin https://github.com/USERNAME/voyage-portal.git
git push -u origin main
```

## Deploy ke Vercel

1. Buka https://vercel.com → Login dengan GitHub
2. **Add New Project** → pilih repo `voyage-portal`
3. Framework Preset: **Vite** (otomatis terdeteksi)
4. Klik **Deploy**

Selesai — Vercel akan memberi URL seperti `voyage-portal.vercel.app`

## Catatan

Versi ini menyimpan data di memori browser (state React) — data akan hilang saat refresh.
Untuk penyimpanan permanen + multi-user, integrasikan dengan Supabase (lihat panduan terpisah).
