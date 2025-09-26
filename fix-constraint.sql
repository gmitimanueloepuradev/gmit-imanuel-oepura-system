-- Fix jenis_pengumuman unique constraint
-- Drop the existing constraint that only allows one kategoriId
ALTER TABLE jenis_pengumuman DROP CONSTRAINT IF EXISTS unique_kode_per_kategori;

-- Add new constraint that allows multiple entries per kategoriId but unique nama within same kategori
ALTER TABLE jenis_pengumuman ADD CONSTRAINT unique_nama_per_kategori UNIQUE (kategori_id, nama);