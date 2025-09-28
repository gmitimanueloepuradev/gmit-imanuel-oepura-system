# System Information Module

## Overview
Modul ini menyediakan informasi lengkap tentang sistem server dan database untuk aplikasi GMIT Imanuel Oepura. Fitur ini dirancang khusus untuk administrator untuk memantau kesehatan sistem dan statistik penggunaan database.

## Features

### 1. Informasi Server
- **System Status**: Status kesehatan server (healthy/warning/error)
- **Uptime**: Waktu operasi server sejak startup terakhir
- **Platform & Architecture**: Informasi sistem operasi dan arsitektur
- **Node.js Version**: Versi Node.js yang digunakan
- **CPU Information**: Model, jumlah core, dan penggunaan CPU
- **Memory Usage**: Penggunaan RAM dengan visualisasi progress bar
- **Load Average**: Rata-rata beban sistem
- **Active Connections**: Jumlah koneksi aktif

### 2. Statistik Database
- **Total Records**: Jumlah total record di semua tabel
- **Entity Counts**: Statistik untuk setiap entitas utama (Jemaat, Keluarga, Rayon, dll)
- **Active Status**: Persentase data aktif vs total
- **Table Categories**: Pembagian tabel master data dan operational
- **Role Distribution**: Distribusi pengguna berdasarkan role
- **Document Status**: Status dokumen (approved, pending, rejected)
- **Recent Activity**: Aktivitas 30 hari terakhir

## Files Structure

```
src/
├── pages/
│   ├── admin/
│   │   └── system-info/
│   │       └── index.js              # Halaman utama system info
│   └── api/
│       └── admin/
│           ├── system-info.js        # API endpoint informasi server (dengan auth)
│           ├── system-database.js    # API endpoint statistik database (dengan auth)
│           ├── system-info-test.js   # API endpoint server tanpa auth (untuk testing)
│           └── system-database-test.js # API endpoint database tanpa auth (untuk testing)
├── components/
│   └── system/
│       ├── SystemInfo.jsx           # Komponen informasi server
│       └── DatabaseStats.jsx        # Komponen statistik database
└── config/
    └── navigationItem.js            # Konfigurasi navigasi (ditambahkan menu System Info)
```

## API Endpoints

### 1. System Information
- **Endpoint**: `/api/admin/system-info`
- **Method**: GET
- **Auth**: Required (Admin only)
- **Response**: Informasi server (CPU, Memory, Disk, Network, etc.)

### 2. Database Statistics
- **Endpoint**: `/api/admin/system-database`
- **Method**: GET
- **Auth**: Required (Admin only)
- **Response**: Statistik database dan penggunaan

### 3. Test Endpoints (Tanpa Auth)
- `/api/admin/system-info-test` - Untuk testing informasi server
- `/api/admin/system-database-test` - Untuk testing statistik database

## Navigation

Menu "Informasi Sistem" telah ditambahkan ke navigasi admin dengan:
- **Route**: `/admin/system-info`
- **Icon**: Monitor
- **Access**: Admin only

## Features Detail

### Server Monitoring
1. **Real-time Updates**: Data diperbarui setiap 30 detik
2. **Responsive Design**: Tampilan optimal di desktop dan mobile
3. **Status Indicators**: Visual indicator untuk status sistem
4. **Memory Visualization**: Progress bar untuk penggunaan memory
5. **CPU Usage**: Monitoring penggunaan CPU real-time

### Database Analytics
1. **Comprehensive Stats**: Statistik lengkap semua tabel
2. **Category Grouping**: Pembagian tabel master dan operational
3. **Usage Trends**: Aktivitas dan tren penggunaan
4. **Health Monitoring**: Status kesehatan database
5. **Auto Refresh**: Pembaruan otomatis setiap 60 detik

## Authentication

- Sistem menggunakan **Supabase Authentication** dengan JWT token
- Endpoint API memerlukan header: `Authorization: Bearer <token>`
- Hanya role **ADMIN** yang dapat mengakses fitur ini
- Token diverifikasi menggunakan `@/lib/jwt`

## Usage

### Akses Halaman
1. Login sebagai admin
2. Navigasi ke menu "Informasi Sistem"
3. Halaman akan menampilkan informasi real-time

### Manual Refresh
- Klik tombol "Refresh" di header untuk memperbarui data manually
- Data akan otomatis ter-refresh sesuai interval yang ditentukan

## Technical Details

### Dependencies
- **@tanstack/react-query**: State management dan caching
- **@prisma/client**: Database operations
- **lucide-react**: Icons
- **os**: Node.js system information
- **fs/promises**: File system operations

### Performance
- Caching dengan React Query
- Interval refresh yang optimal
- Error handling yang robust
- Progress indicators untuk loading state

## Security Considerations

1. **Authentication Required**: Semua endpoint dilindungi authentication
2. **Role-based Access**: Hanya admin yang dapat mengakses
3. **No Sensitive Data**: Tidak menampilkan informasi sensitif
4. **Error Handling**: Error message yang aman

## Future Enhancements

1. **Real-time Alerts**: Notifikasi untuk status kritis
2. **Historical Data**: Trend data historis
3. **Export Functionality**: Export data ke PDF/Excel
4. **Advanced Monitoring**: Monitoring database performance
5. **Dashboard Widgets**: Widget untuk dashboard utama

## Testing

Untuk testing tanpa authentication, gunakan endpoint test:
- `http://localhost:3001/api/admin/system-info-test`
- `http://localhost:3001/api/admin/system-database-test`

## Support

Untuk pertanyaan atau issue terkait System Information Module, silakan buka issue di repository atau hubungi team developer.