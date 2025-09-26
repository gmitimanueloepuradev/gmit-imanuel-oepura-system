import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function PekerjaanPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "namaPekerjaan",
      label: "Nama Pekerjaan",
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
    { key: "namaPekerjaan", label: "Nama Pekerjaan" },
    { 
      key: "isActive", 
      label: "Status Aktif", 
      getValue: (item) => item?.isActive ? "Aktif" : "Tidak Aktif" 
    },
  ];

  const formFields = [
    {
      key: "namaPekerjaan",
      label: "Nama Pekerjaan",
      type: "text",
      required: true,
      placeholder: "Masukkan nama pekerjaan"
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
      title="Data Pekerjaan"
      description="Kelola data pekerjaan"
      service={{
        get: () => masterService.getPekerjaan(),
        create: (data) => masterService.createPekerjaan(data),
        update: (id, data) => masterService.updatePekerjaan(id, data),
        delete: (id) => masterService.deletePekerjaan(id)
      }}
      queryKey="pekerjaan"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="namaPekerjaan"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Pekerjaan" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["namaPekerjaan"]}
    />
  );
}