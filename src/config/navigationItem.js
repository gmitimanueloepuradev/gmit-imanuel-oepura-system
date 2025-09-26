import {
  Baby,
  BarChart3,
  Bell,
  Building,
  Building2,
  Calendar,
  Church,
  ClipboardList,
  Crown,
  Database,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Image,
  List,
  Map,
  MapPin,
  MoreHorizontal,
  Shield,
  Tag,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";

// Role-based configurations
export const roleConfigs = {
  admin: {
    roleTitle: "Admin",
    fullTitle: "GMIT Admin",
    description:
      "Sistem administrasi gereja untuk mengelola data jemaat, kegiatan, dan keuangan dengan mudah dan efisien.",
    baseRoute: "/admin",
    dashboardRoute: "/admin/dashboard",
    logoIcon: Shield,
    userInfo: {
      name: "Admin GMIT",
      email: "admin@gmit-imanuel.org",
      organization: "Imanuel Oepura",
    },
    navigation: [
      { href: "/admin/dashboard", label: "Dashboard", icon: Home },
      { href: "/admin/users", label: "Kelola Akun", icon: Users },
      { href: "/admin/jemaat", label: "Jemaat", icon: Users },
      { href: "/admin/majelis", label: "Majelis", icon: UserCheck },
      { href: "/admin/kegiatan", label: "Kegiatan", icon: Calendar },
      { href: "/admin/keluarga", label: "Keluarga", icon: UsersRound },
      { href: "/admin/rayon", label: "Rayon", icon: MapPin },
      {
        href: "/admin/pengumuman",
        label: "Pengumuman",
        icon: Bell,
      },
      {
        href: "/admin/sidi",
        label: "Sidi",
        icon: GraduationCap,
      },
      {
        href: "/admin/baptis",
        label: "Baptis",
        icon: Baby,
      },
      {
        href: "/admin/pernikahan",
        label: "Pernikahan",
        icon: Heart,
      },
      { href: "/admin/keuangan", label: "Keuangan", icon: DollarSign },
      { href: "/admin/laporan", label: "Laporan", icon: FileText },
      {
        href: "/admin/data-master",
        label: "Data Master",
        icon: Database,
        children: [
          {
            href: "/admin/data-master/wilayah-administratif",
            label: "Wilayah Administratif",
            icon: Map,
          },
          {
            href: "/admin/data-master/status-keluarga",
            label: "Status Keluarga",
            icon: MapPin,
          },

          {
            href: "/admin/data-master/jenis-ibadah",
            label: "Jenis Ibadah",
            icon: MapPin,
          },
          {
            href: "/admin/data-master/klasis",
            label: "Klasis",
            icon: Church,
          },

          {
            href: "/admin/data-master/keadaan-rumah",
            label: "Keadaan Rumah",
            icon: Building,
          },
          {
            href: "/admin/data-master/status-kepemilikan-rumah",
            label: "Status Kepemilikan Rumah",
            icon: Tag,
          },
          {
            href: "/admin/data-master/status-dalam-keluarga",
            label: "Status Dalam Keluarga",
            icon: UserCog,
          },
          {
            href: "/admin/data-master/suku",
            label: "Suku",
            icon: Tag,
          },
          {
            href: "/admin/data-master/kategori-jadwal",
            label: "Kategori Jadwal",
            icon: Tag,
          },
          {
            href: "/admin/data-master/jenis-jabatan",
            label: "Jenis Jabatan",
            icon: Crown,
          },
          {
            href: "/admin/data-master/pekerjaan",
            label: "Pekerjaan",
            icon: Tag,
          },
          {
            href: "/admin/data-master/pendidikan",
            label: "Pendidikan",
            icon: Tag,
          },
          {
            href: "/admin/data-master/pendapatan",
            label: "Pendapatan",
            icon: Tag,
          },
          {
            href: "/admin/data-master/jaminan-kesehatan",
            label: "Jaminan Kesehatan",
            icon: Tag,
          },
          {
            href: "/admin/data-master/kategori-pengumuman",
            label: "Kategori Pengumuman",
            icon: Tag,
          },
          {
            href: "/admin/data-master/jenis-pengumuman",
            label: "Jenis Pengumuman",
            icon: Tag,
          },
        ],
      },
      {
        href: "/admin/data-master-keuangan",
        label: "Data Master Keuangan",
        icon: DollarSign,
        children: [
          {
            href: "/admin/data-master/keuangan/kategori",
            label: "Kategori Keuangan",
            icon: Tag,
          },
          {
            href: "/admin/data-master/keuangan/item",
            label: "Item Keuangan",
            icon: List,
          },
          {
            href: "/admin/data-master/keuangan/periode",
            label: "Periode Anggaran",
            icon: Calendar,
          },
        ],
      },
      { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
      // { href: "/admin/settings", label: "Pengaturan", icon: Settings },
    ],
    footerLinks: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/members", label: "Manajemen Jemaat" },
      { href: "/admin/events", label: "Manajemen Acara" },
      { href: "/admin/finance", label: "Keuangan" },
    ],
  },

  jemaat: {
    roleTitle: "Jemaat",
    fullTitle: "Portal Jemaat",
    description:
      "Portal untuk jemaat GMIT Imanuel Oepura untuk mengakses informasi kegiatan, persembahan, dan layanan gereja.",
    baseRoute: "/jemaat",
    dashboardRoute: "/jemaat/dashboard",
    logoIcon: Heart,
    userInfo: {
      name: "Jemaat GMIT",
      email: "jemaat@gmit-imanuel.org",
      organization: "Imanuel Oepura",
    },
    navigation: [
      { href: "/jemaat/dashboard", label: "Beranda", icon: Home },
      { href: "/jemaat/profile", label: "Profil Saya", icon: UserCheck },
      { href: "/jemaat/jadwal-ibadah", label: "Jadwal Ibadah", icon: Calendar },
      { href: "/jemaat/keluarga", label: "Keluarga", icon: DollarSign },
      // { href: "/jemaat/attendance", label: "Kehadiran", icon: CheckSquare },
      // { href: "/jemaat/prayer", label: "Doa", icon: Heart },
      // { href: "/jemaat/news", label: "Berita", icon: Bell },
    ],
    footerLinks: [
      { href: "/jemaat/dashboard", label: "Beranda" },
      { href: "/jemaat/events", label: "Kegiatan" },
      { href: "/jemaat/offering", label: "Persembahan" },
      { href: "/jemaat/prayer", label: "Doa" },
    ],
  },

  majelis: {
    roleTitle: "Majelis",
    fullTitle: "Portal Majelis",
    description: "Sistem manajemen untuk majelis gereja dalam mengawasi dan mengelola kegiatan pelayanan.",
    baseRoute: "/majelis",
    dashboardRoute: "/majelis/dashboard",
    logoIcon: Building2,
    userInfo: {
      name: "Majelis GMIT",
      email: "majelis@gmit-imanuel.org",
      organization: "Imanuel Oepura",
    },
    navigation: [
      { href: "/majelis/dashboard", label: "Dashboard", icon: Home },
      {
        href: "/majelis/jemaat",
        label: "Data Jemaat",
        icon: Users,
      },
      {
        href: "/majelis/keluarga",
        label: "Data Keluarga",
        icon: UsersRound,
      },
      {
        href: "/majelis/jadwal-ibadah",
        label: "Jadwal Ibadah",
        icon: Calendar,
      },
      {
        href: "/majelis/pengumuman",
        label: "Pengumuman",
        icon: Bell,
      },

      // { href: "/majelis/meetings", label: "Rapat", icon: Users },
      // { href: "/majelis/decisions", label: "Keputusan", icon: ClipboardList },
      // { href: "/majelis/programs", label: "Program", icon: BookOpen },
      // { href: "/majelis/reports", label: "Laporan", icon: FileText },
    ],
    footerLinks: [
      { href: "/majelis/dashboard", label: "Dashboard" },
      { href: "/majelis/oversight", label: "Pengawasan" },
      { href: "/majelis/meetings", label: "Rapat" },
      { href: "/majelis/reports", label: "Laporan" },
    ],
  },

  employee: {
    roleTitle: "Pegawai",
    fullTitle: "Portal Pegawai",
    description: "Sistem untuk pegawai gereja dalam mengelola tugas harian dan koordinasi pelayanan.",
    baseRoute: "/employee",
    dashboardRoute: "/employee/dashboard",
    logoIcon: UserPlus,
    userInfo: {
      name: "Pegawai GMIT",
      email: "employee@gmit-imanuel.org",
      organization: "Imanuel Oepura",
    },
    navigation: [
      { href: "/employee/dashboard", label: "Dashboard", icon: Home },
      {
        href: "/employee/kegiatan-gereja",
        label: "Kegiatan Gereja",
        icon: Calendar,
      },
      { href: "/employee/pengumuman", label: "Pengumuman", icon: Heart },
      {
        href: "/employee/lainnya",
        label: "Lainnya",
        icon: MoreHorizontal,
        children: [
          {
            href: "/employee/lainnya/baptis",
            label: "Baptis",
            icon: Users,
          },
          {
            href: "/employee/lainnya/sidi",
            label: "Sidi",
            icon: ClipboardList,
          },
          {
            href: "/employee/lainnya/pernikahan",
            label: "Pernikahan",
            icon: Heart,
          },
          {
            href: "/employee/lainnya/atestasi",
            label: "Atestasi",
            icon: FileText,
          },
        ],
      },
      {
        href: "/employee/galeri",
        label: "Galeri",
        icon: Image,
      },
    ],
    footerLinks: [
      { href: "/employee/dashboard", label: "Dashboard" },
      { href: "/employee/tasks", label: "Tugas" },
      { href: "/employee/schedule", label: "Jadwal" },
      { href: "/employee/services", label: "Pelayanan" },
    ],
  },
};

// Common church contact information
export const churchContact = {
  address: "Jl. Gereja No. 123, Kupang, NTT",
  phone: "+62 380-123456",
  email: "info@gmit-imanuel.org",
  website: "www.gmit-imanuel.org",
};

// Helper function to get role config
export const getRoleConfig = (role) => {
  return roleConfigs[role] || roleConfigs.admin;
};
