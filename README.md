# Administrasi RT - Frontend Web

Antarmuka pengguna untuk sistem administrasi RT yang dibangun menggunakan React, TypeScript, dan Tailwind CSS.

## Teknologi Utama
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React
- **State Management**: React Hooks & Context API
- **HTTP Client**: Axios (dengan interceptor untuk Refresh Token)
- **Minimum Node.js**: v20.x (LTS) atau lebih baru

---

## Panduan Instalasi (Development)

### 1. Prasyarat
- **Node.js (Minimum v20.x)** — Disarankan menggunakan versi LTS terbaru.
- npm atau yarn

### 2. Kloning Repositori
```bash
git clone https://github.com/dedybayu/administrasi-rt-fe.git
cd administrasi-rt-fe
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment
Buat file `.env` di root directory:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```
*Pastikan backend Laravel sudah berjalan di URL tersebut.*

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

---

## Panduan Instalasi (Production)

### 1. Prasyarat
- **Node.js (Minimum v20.x)** — Disarankan menggunakan versi LTS terbaru.
- npm atau yarn

### 2. Kloning Repositori
```bash
git clone <url-repositori-ini>
cd administrasi-rt-fe
```

### 3. Instal Dependensi
```bash
npm install
```
### 4. Build Project
```bash
npm run build
```
Hasil build akan berada di folder `/dist`.

### 5. Deployment
Isi dari folder `/dist` dapat di-host di berbagai platform static hosting seperti:
- Vercel
- Netlify
- Firebase Hosting
- Web Server (Nginx/Apache)
- PM2 (Process Manager 2)

Jika menggunakan Nginx, pastikan konfigurasi rute diarahkan ke `index.html` untuk mendukung Client Side Routing:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Opsi Deployment dengan PM2

PM2 adalah process manager untuk Node.js yang memungkinkan Anda menjalankan aplikasi di background dan memastikan aplikasi tetap berjalan (auto-restart).

**1. Instalasi PM2 & Serve secara Global**
Instal PM2 dan package `serve` untuk melayani file statis:
```bash
npm install -g pm2 serve
```

**2. Jalankan Aplikasi**
Gunakan perintah berikut untuk menjalankan folder `dist` pada port tertentu (contoh: 5173):
```bash
pm2 serve dist 5173 --spa --name "administrasi-rt-fe"
```
- `--spa`: Memastikan semua rute diarahkan ke `index.html` (penting untuk React Router).
- `--name`: Memberikan nama proses agar mudah dikelola.

**3. Manajemen Proses PM2**
Berikut adalah beberapa perintah dasar untuk mengelola aplikasi:
- **Melihat status**: `pm2 status` atau `pm2 list`
- **Melihat log**: `pm2 logs administrasi-rt-fe`
- **Memberhentikan aplikasi**: `pm2 stop administrasi-rt-fe`
- **Menjalankan ulang**: `pm2 restart administrasi-rt-fe`
- **Menghapus dari daftar**: `pm2 delete administrasi-rt-fe`

**4. Konfigurasi Persistence (Auto-start saat Reboot)**
Agar aplikasi otomatis berjalan kembali saat server/VPS di-reboot:
1. Simpan daftar proses yang sedang berjalan:
   ```bash
   pm2 save
   ```
2. Buat script startup:
   ```bash
   pm2 startup
   ```
3. Jalankan perintah yang muncul di terminal (biasanya diawali dengan `sudo env PATH=...`).


---

## Fitur Utama
- Dashboard Statistik (RT & Warga)
- Manajemen Data Warga (CRUD + Foto KTP)
- Manajemen Data Rumah & Penghuni
- Sistem Iuran & Pembayaran (Konfirmasi Pembayaran)
- Catatan Pengeluaran Kas
- Role-Based Access Control (RBAC)
- Token Refresh Otomatis

## Catatan
Aplikasi ini bergantung sepenuhnya pada API dari repositori backend. Pastikan backend sudah terkonfigurasi dan berjalan dengan benar.

<br>

# Dokumentasi Hasil Tampilan
