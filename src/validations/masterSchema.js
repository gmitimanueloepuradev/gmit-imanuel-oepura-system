import { z } from "zod";

// Provinsi
export const provinsiSchema = z.object({
  nama: z.string().min(2, "Nama wajib diisi"),
});

// Kabupaten (jika ada)
export const kabupatenSchema = z.object({
  nama: z.string().min(2, "Nama kabupaten wajib diisi"),
  provinsiId: z.string().nonempty("Provinsi wajib dipilih"),
});

export const kotaKabupatenSchema = z.object({
  nama: z.string().min(2, "Nama kota/kabupaten wajib diisi"),
  idProvinsi: z.string().nonempty("ID Provinsi wajib dipilih"),
});

export const kecamatanSchema = z.object({
  nama: z.string().min(2, "Nama kecamatan wajib diisi"),
  idKotaKab: z.string().nonempty("ID Kota/Kabupaten wajib dipilih"),
});

export const kelurahanDesaSchema = z.object({
  nama: z.string().min(2, "Nama kelurahan/desa wajib diisi"),
  idKecamatan: z.string().nonempty("ID Kecamatan wajib dipilih"),
  kodePos: z.string().min(5, "Kode pos harus 5 digit"),
});

// Klasis
export const klasisSchema = z.object({
  nama: z.string().min(2, "Nama klasis wajib diisi"),
  deskripsi: z.string().optional(),
});

// Sidi
export const sidiSchema = z.object({
  idJemaat: z.string().nonempty("Jemaat wajib dipilih"),
  tanggal: z.string().nonempty("Tanggal sidi wajib diisi"),
  idKlasis: z.string().nonempty("Klasis wajib dipilih"),
  keterangan: z.string().optional(),
});

// Baptis
export const baptisSchema = z.object({
  idJemaat: z.string().nonempty("Jemaat wajib dipilih"),
  tanggal: z.string().nonempty("Tanggal baptis wajib diisi"),
  idKlasis: z.string().nonempty("Klasis wajib dipilih"),
  keterangan: z.string().optional(),
});

// Atestasi
export const atestasiSchema = z.object({
  tipe: z.enum(["MASUK", "KELUAR"], {
    required_error: "Tipe atestasi wajib dipilih",
  }),
  tanggal: z.string().nonempty("Tanggal wajib diisi"),
  idJemaat: z.string().optional(),
  idKlasis: z.string().optional(),
  gerejaAsal: z.string().optional(),
  gerejaTujuan: z.string().optional(),
  alasan: z.string().optional(),
  keterangan: z.string().optional(),
  namaCalonJemaat: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validasi untuk atestasi MASUK
  if (data.tipe === "MASUK") {
    if (!data.namaCalonJemaat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaCalonJemaat"],
        message: "Nama calon jemaat wajib diisi untuk atestasi masuk",
      });
    }
    if (!data.gerejaAsal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gerejaAsal"],
        message: "Gereja asal wajib diisi untuk atestasi masuk",
      });
    }
  }
  
  // Validasi untuk atestasi KELUAR
  if (data.tipe === "KELUAR") {
    if (!data.idJemaat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["idJemaat"],
        message: "Jemaat wajib dipilih untuk atestasi keluar",
      });
    }
    if (!data.gerejaTujuan) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gerejaTujuan"],
        message: "Gereja tujuan wajib diisi untuk atestasi keluar",
      });
    }
  }
});

// Jenis Ibadah
export const jenisIbadahSchema = z.object({
  namaIbadah: z.string().min(2, "Nama ibadah wajib diisi"),
});

// Kategori Jadwal
export const kategoriJadwalSchema = z.object({
  namaKategori: z.string().min(2, "Nama kategori jadwal wajib diisi"),
});

// Jenis Jabatan
export const jenisJabatanSchema = z.object({
  namaJabatan: z.string().min(2, "Nama jenis jabatan wajib diisi"),
});

// Majelis Creation Schema
export const majelisCreationSchema = z.object({
  // Majelis data
  namaLengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  mulai: z.string().nonempty("Tanggal mulai wajib diisi"),
  selesai: z.string().optional(),
  idRayon: z.string().optional(),
  jenisJabatanId: z.string().nonempty("Jenis jabatan wajib dipilih"),
  
  // User account data
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  noWhatsapp: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true; // Optional field
        // Check if it's a valid Indonesian phone number format
        const cleaned = val.replace(/\D/g, '');
        if (cleaned.startsWith('62')) {
          const afterCountryCode = cleaned.substring(2);
          return afterCountryCode.startsWith('8') && afterCountryCode.length >= 9 && afterCountryCode.length <= 13;
        }
        return false;
      },
      {
        message: 'Format nomor WhatsApp tidak valid. Gunakan format +6281234567890',
      }
    ),
});

// Majelis Edit Schema (without user account data)
export const majelisEditSchema = z.object({
  namaLengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  mulai: z.string().nonempty("Tanggal mulai wajib diisi"),
  selesai: z.string().optional(),
  idRayon: z.string().optional(),
  jenisJabatanId: z.string().nonempty("Jenis jabatan wajib dipilih"),
});

// Keluarga Edit Schema
export const keluargaEditSchema = z.object({
  noBagungan: z.string().min(1, "No. Bangunan wajib diisi"),
  idRayon: z.string().nonempty("Rayon wajib dipilih"),
  idStatusKeluarga: z.string().optional(),
  idStatusKepemilikanRumah: z.string().optional(),
  idKeadaanRumah: z.string().optional(),
});

// Kategori Pengumuman Schema
export const kategoriPengumumanSchema = z.object({
  nama: z.string()
    .min(2, "Nama kategori wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  deskripsi: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Jenis Pengumuman Schema
export const jenisPengumumanSchema = z.object({
  kategoriId: z.string().nonempty("Kategori pengumuman wajib dipilih"),
  nama: z.string()
    .min(2, "Nama jenis wajib diisi")
    .max(150, "Nama maksimal 150 karakter"),
  deskripsi: z.string().optional(),
  isActive: z.boolean().default(true),
});



// Jemaat Create Schema
export const jemaatCreateSchema = z.object({
  // Basic info
  nama: z.string().min(2, "Nama lengkap wajib diisi"),
  jenisKelamin: z.union([
    z.boolean(),
    z.string().refine(val => val === 'true' || val === 'false', "Jenis kelamin harus dipilih")
  ]),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  tempatLahir: z.string().min(2, "Tempat lahir wajib diisi"),
  golonganDarah: z.string().optional(),
  nomorTelepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .refine(
      (val) => {
        // Check if it's a valid Indonesian phone number format
        const cleaned = val.replace(/\D/g, '');
        if (cleaned.startsWith('62')) {
          const afterCountryCode = cleaned.substring(2);
          return afterCountryCode.startsWith('8') && afterCountryCode.length >= 9 && afterCountryCode.length <= 13;
        }
        return false;
      },
      {
        message: 'Format nomor telepon tidak valid. Gunakan format +6281234567890',
      }
    ),
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),

  // Required relations based on Prisma schema
  idStatusDalamKeluarga: z.string().nonempty("Status dalam keluarga wajib dipilih"),
  idSuku: z.string().nonempty("Suku wajib dipilih"),
  idPendidikan: z.string().nonempty("Pendidikan wajib dipilih"),
  idPekerjaan: z.string().nonempty("Pekerjaan wajib dipilih"),
  idPendapatan: z.string().nonempty("Pendapatan wajib dipilih"),
  idJaminanKesehatan: z.string().nonempty("Jaminan kesehatan wajib dipilih"),

  // Optional relations
  idPernikahan: z.string().optional(),

  // Family relation
  isKepalaKeluarga: z.boolean().default(false),
});

function testForking(){
  console.log("test forking");
}