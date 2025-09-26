import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function KeadaanRumahPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "keadaan",
      label: "Keadaan Rumah",
      type: "text",
    },
    {
      key: "isActive",
      label: "Status",
      type: "boolean",
      badgeVariant: (value) => (value === true ? "success" : "danger"),
    },
  ];

  const viewFields = [
    { key: "id", label: "ID" },
    { key: "keadaan", label: "Keadaan Rumah" },
    { 
      key: "isActive", 
      label: "Status Aktif", 
      getValue: (item) => item?.isActive ? "Aktif" : "Tidak Aktif" 
    },
  ];

  const formFields = [
    {
      key: "keadaan",
      label: "Keadaan Rumah",
      type: "text",
      required: true,
      placeholder: "Masukkan keadaan rumah"
    },
    {
      key: "isActive",
      label: "Status Aktif",
      type: "boolean",
      defaultValue: true
    }
  ];

  return (
    <MasterDataPage
      title="Data Keadaan Rumah"
      description="Kelola data keadaan rumah"
      service={{
        get: () => masterService.getKeadaanRumah(),
        create: (data) => masterService.createKeadaanRumah(data),
        update: (id, data) => masterService.updateKeadaanRumah(id, data),
        delete: (id) => masterService.deleteKeadaanRumah(id)
      }}
      queryKey="keadaan-rumah"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="keadaan"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Keadaan Rumah" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["keadaan"]}
    />
  );
}