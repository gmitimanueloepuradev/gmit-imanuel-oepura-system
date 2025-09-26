import MasterDataPage from "@/components/ui/MasterDataPage";
import masterService from "@/services/masterService";

export default function RayonPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "namaRayon",
      label: "Nama Rayon",
      type: "text",
    },
    {
      key: "_count.keluargas",
      label: "Jumlah Keluarga",
      type: "custom",
      render: (item) =>
        item && item._count && typeof item._count.keluargas === "number"
          ? `${item._count.keluargas} keluarga`
          : "0 keluarga",
    },
  ];

  const viewFields = [
    { key: "id", label: "ID" },
    { key: "namaRayon", label: "Nama Rayon" },
    {
      key: "_count.keluargas",
      label: "Jumlah Keluarga",
      render: (item) =>
        item && item._count && typeof item._count.keluargas === "number"
          ? `${item._count.keluargas} keluarga`
          : "0 keluarga",
    },
  ];

  const formFields = [
    {
      key: "namaRayon",
      label: "Nama Rayon",
      type: "text",
      required: true,
      placeholder: "Contoh: Rayon I, Rayon II, Rayon III",
      validation: {
        maxLength: {
          value: 50,
          message: "Nama rayon maksimal 50 karakter",
        },
        minLength: {
          value: 1,
          message: "Nama rayon minimal 1 karakter",
        },
      },
    },
  ];

  return (
    <MasterDataPage
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Rayon" },
      ]}
      columns={columns}
      description="Kelola data rayon untuk pembagian wilayah jemaat"
      formFields={formFields}
      itemNameField="namaRayon"
      queryKey="rayon"
      service={{
        get: () => masterService.getRayon(),
        create: (data) => masterService.createRayon(data),
        update: (id, data) => masterService.updateRayon(id, data),
        delete: (id) => masterService.deleteRayon(id),
      }}
      title="Kelola Rayon"
      viewFields={viewFields}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["namaRayon", "deskripsi"]}
    />
  );
}
