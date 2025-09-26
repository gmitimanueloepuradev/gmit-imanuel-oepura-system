import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function StatusDalamKeluargaPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "status",
      label: "Nama Status",
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
    { key: "status", label: "Status" },
    {
      key: "isActive",
      label: "Status Aktif",
      getValue: (item) => (item?.isActive ? "Aktif" : "Tidak Aktif"),
    },
  ];

  const formFields = [
    {
      key: "status",
      label: "Status Dalam Keluarga",
      type: "text",
      required: true,
      placeholder: "Masukkan status dalam keluarga",
    },
    {
      key: "isActive",
      label: "Status Aktif",
      type: "boolean",
      defaultValue: true,
    },
  ];

  return (
    <MasterDataPage
      title="Data Status Dalam Keluarga"
      description="Kelola data status dalam keluarga"
      service={{
        get: () => masterService.getStatusDalamKeluarga(),
        create: (data) => masterService.createStatusDalamKeluarga(data),
        update: (id, data) => masterService.updateStatusDalamKeluarga(id, data),
        delete: (id) => masterService.deleteStatusDalamKeluarga(id),
      }}
      queryKey="status-dalam-keluarga"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="status"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Status Dalam Keluarga" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["status"]}
    />
  );
}
