import MasterDataPage from "@/components/ui/MasterDataPage";
import masterService from "@/services/masterService";

export default function KategoriPengumumanPage() {
  const columns = [
    {
      key: "nama",
      label: "Nama Kategori",
      type: "text",
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "text",
      truncate: true,
    },
    {
      key: "_count.jenisPengumuman",
      label: "Jumlah Jenis",
      type: "custom",
      render: (item) =>
        item && item._count && typeof item._count.jenisPengumuman === "number"
          ? `${item._count.jenisPengumuman} jenis`
          : "0 jenis",
    },
    {
      key: "_count.pengumuman",
      label: "Jumlah Pengumuman",
      type: "custom",
      render: (item) =>
        item && item._count && typeof item._count.pengumuman === "number"
          ? `${item._count.pengumuman} pengumuman`
          : "0 pengumuman",
    },
    {
      key: "isActive",
      label: "Status",
      type: "boolean",
      badgeVariant: (value) => (value === true ? "success" : "danger"),
    },
  ];

  const viewFields = [
    { key: "nama", label: "Nama Kategori" },
    { key: "deskripsi", label: "Deskripsi" },
    {
      key: "_count.jenisPengumuman",
      label: "Jumlah Jenis Pengumuman",
      render: (item) =>
        item && item._count && typeof item._count.jenisPengumuman === "number"
          ? `${item._count.jenisPengumuman} jenis`
          : "0 jenis",
    },
    {
      key: "_count.pengumuman",
      label: "Jumlah Pengumuman",
      render: (item) =>
        item && item._count && typeof item._count.pengumuman === "number"
          ? `${item._count.pengumuman} pengumuman`
          : "0 pengumuman",
    },
    {
      key: "isActive",
      label: "Status",
      render: (item) => (item.isActive ? "Aktif" : "Tidak Aktif"),
    },
    { key: "createdAt", label: "Dibuat Pada", type: "datetime" },
    { key: "updatedAt", label: "Diperbarui Pada", type: "datetime" },
  ];

  const formFields = [
    {
      key: "nama",
      label: "Nama Kategori",
      type: "text",
      required: true,
      placeholder: "Contoh: Kategorial, Umum, Khusus",
      validation: {
        maxLength: {
          value: 100,
          message: "Nama kategori maksimal 100 karakter",
        },
        minLength: {
          value: 2,
          message: "Nama kategori minimal 2 karakter",
        },
      },
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Deskripsi kategori pengumuman (opsional)",
      rows: 3,
    },
    {
      key: "isActive",
      label: "Status Aktif",
      type: "boolean",
      defaultValue: true,
      description: "Kategori aktif dapat digunakan untuk membuat pengumuman",
    },
  ];

  return (
    <MasterDataPage
      allowBulkDelete={true}
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Kategori Pengumuman" },
      ]}
      columns={columns}
      description="Kelola data kategori pengumuman untuk pengelompokan jenis pengumuman"
      exportable={true}
      formFields={formFields}
      itemNameField="nama"
      queryKey="kategori-pengumuman"
      searchFields={["nama", "deskripsi"]}
      service={{
        get: (params) =>
          masterService.getKategoriPengumuman({
            ...params,
            includeCount: true,
          }),
        create: (data) => masterService.createKategoriPengumuman(data),
        update: (id, data) => masterService.updateKategoriPengumuman(id, data),
        delete: (id) => masterService.deleteKategoriPengumuman(id),
      }}
      title="Kelola Kategori Pengumuman"
      viewFields={viewFields}
    />
  );
}
