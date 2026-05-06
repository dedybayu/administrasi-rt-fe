# Administrasi RT - Frontend Web

Antarmuka pengguna untuk sistem administrasi RT yang dibangun menggunakan React, TypeScript, dan Tailwind CSS.

## Teknologi Utama
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React
- **State Management**: React Hooks & Context API
- **HTTP Client**: Axios (dengan interceptor untuk Refresh Token)

---

## Panduan Instalasi (Development)

### 1. Prasyarat
- Node.js (versi 18 ke atas disarankan)
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
- Node.js (versi 18 ke atas disarankan)
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
Jika Anda ingin menjalankan aplikasi di server VPS menggunakan PM2:
1. Pastikan `pm2` dan package `serve` sudah terinstal:
   ```bash
   npm install -g pm2 serve
   ```
2. Jalankan aplikasi menggunakan PM2:
   ```bash
   pm2 serve dist 5173 --spa --name "administrasi-rt-fe"
   ```
   *Ganti `5173` dengan port yang Anda inginkan.*

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
