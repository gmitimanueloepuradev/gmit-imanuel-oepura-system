# Dependencies untuk Super Export Feature

## Install Dependencies

Jalankan command berikut untuk menginstall dependencies yang diperlukan:

```bash
npm install jspdf jspdf-autotable xlsx date-fns
```

## Dependencies:

1. **jspdf** - Library untuk generate PDF
2. **jspdf-autotable** - Plugin untuk membuat tabel di PDF
3. **xlsx** - Library untuk generate Excel/CSV files
4. **date-fns** - Library untuk format tanggal (sudah ada kemungkinan)

## Manual Import jika diperlukan:

Jika belum ada, tambahkan juga:
```bash
npm install lucide-react @tanstack/react-query
```

## Usage:

Setelah install dependencies, super export feature siap digunakan dengan:
- PDF Export (Table, Cards, Detailed layouts)
- Excel Export (Multiple sheets, grouping)
- CSV Export (Lightweight format)
- Advanced filtering dan grouping
- Custom field selection
- Professional formatting