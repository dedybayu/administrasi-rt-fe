# Administrasi RT - Frontend Web

Antarmuka pengguna untuk sistem administrasi RT yang dibangun menggunakan React, TypeScript, dan Tailwind CSS.

### 🚀 Live Demo
Aplikasi ini sudah dideploy dan dapat diakses melalui:
**[https://adm-rt.dbsnetwork.my.id/](https://adm-rt.dbsnetwork.my.id/)**

Backend API: **[https://api-rt.dbsnetwork.my.id/api](https://api-rt.dbsnetwork.my.id/api)**

## Teknologi Utama
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS & DaisyUI
- **Icons**: Lucide React
- **State Management**: React Hooks & Context API
- **HTTP Client**: Axios (dengan interceptor untuk Refresh Token)
- **Minimum Node.js**: v20.x (LTS) atau lebih baru

---

## Akun Default Login
Gunakan kredensial berikut untuk masuk ke dalam sistem (pastikan Anda sudah menjalankan *seeding* di backend):
- **Role RT**: `ketuart` / `password123`
- **Role Warga**: (Username diambil secara otomatis saat seeding, silakan cek tabel `m_users` di database. Password defaultnya adalah `warga123`)

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
VITE_API_URL=https://api-rt.dbsnetwork.my.id/api
```
*Catatan: Jika berjalan secara lokal, ubah menjadi `http://127.0.0.1:8000/api`.*

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

# Dokumentasi Tampilan Antarmuka

Berikut adalah rincian tampilan antarmuka Sistem Administrasi RT untuk berbagai fitur dan peran pengguna.

## 1. Halaman Publik & Autentikasi

Halaman awal yang dapat diakses oleh publik dan proses masuk ke dalam sistem.

### Landing Page
![Landing Page](./readme_img/landing_page.png)

### Login Page
![Login Page](./readme_img/login_page.png)

### Dark Mode Feature
![Dark Mode](./readme_img/dark_mode_feature.png)

---

## 2. Peran: Ketua RT (Administrator)

Ketua RT memiliki akses penuh untuk mengelola data warga, keuangan, dan melihat laporan statistik.

### A. Dashboard & Statistik
Dashboard interaktif dengan grafik arus kas (cashflow), perbandingan bulanan, dan laporan harian.

#### Main Dashboard
![Dashboard RT](./readme_img/role_rt/dashboard/dashboard_page.png)

#### Detail Keuangan Bulanan (Modal)
![Detail Modal](./readme_img/role_rt/dashboard/detail_keuangan_bulanan_modal.png)

#### Ekspor Laporan PDF
![PDF Export](./readme_img/role_rt/dashboard/detail_keuangan_bulanan_pdf_export.png)

### B. Manajemen Rumah & Penghuni
Mengelola unit properti dan mencatat riwayat penghuni (Tetap, Kontrak, atau Sewa).

#### Daftar Rumah
![House List](./readme_img/role_rt/houses/house_list.png)

#### Detail Rumah & Penghuni
![House Detail](./readme_img/role_rt/houses/house_detail.png)

#### Form Tambah Penghuni
![Add Occupant](./readme_img/role_rt/houses/add_house_occupant.png)

### C. Manajemen Warga
Basis data warga lengkap dengan informasi status perkawinan, nomor telepon, dan foto KTP.

#### Daftar Warga
![Occupant List](./readme_img/role_rt/occupants/occupant_list.png)

#### Detail Profil Warga
![Occupant Detail](./readme_img/role_rt/occupants/show_occupant.png)

#### Form Tambah Warga
![Create Occupant](./readme_img/role_rt/occupants/create_occupant.png)

### D. Keuangan: Iuran & Pengeluaran
Pencatatan pemasukan dari warga dan pengeluaran kas RT secara transparan.

#### Daftar Pembayaran Iuran
![Payment List](./readme_img/role_rt/payments/payment_list.png)

#### Verifikasi Pembayaran Warga
![Verification](./readme_img/role_rt/payments/payment_verification.png)

#### Daftar Pengeluaran Kas
![Expense List](./readme_img/role_rt/expenses/expenses_list.png)

---

## 3. Peran: Warga

Warga dapat memantau status iuran pribadi, melakukan konfirmasi pembayaran, dan melihat pengumuman dashboard.

### Dashboard Warga
![Dashboard Warga](./readme_img/role_occupant/dashboard.png)

### Status Iuran Saya
![My Dues](./readme_img/role_occupant/my_dues.png)

### Form Konfirmasi Pembayaran (Upload Bukti)
![Pay Dues](./readme_img/role_occupant/pay_dues.png)

### Status Pembayaran Menunggu Verifikasi
![Pending Payment](./readme_img/role_occupant/after_pay_dues_pending.png)

### Update Profil & Password
![Update Profile](./readme_img/role_occupant/update_password.png)

---
