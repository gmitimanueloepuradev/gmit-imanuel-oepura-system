import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function StatusKepemilikanRumahPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "status",
      label: "Status Kepemilikan",
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
    { key: "status", label: "Status Kepemilikan" },
    { 
      key: "isActive", 
      label: "Status Aktif", 
      getValue: (item) => item?.isActive ? "Aktif" : "Tidak Aktif" 
    },
  ];

  const formFields = [
    {
      key: "status",
      label: "Status Kepemilikan Rumah",
      type: "text",
      required: true,
      placeholder: "Masukkan status kepemilikan rumah"
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
      title="Data Status Kepemilikan Rumah"
      description="Kelola data status kepemilikan rumah"
      service={{
        get: () => masterService.getStatusKepemilikanRumah(),
        create: (data) => masterService.createStatusKepemilikanRumah(data),
        update: (id, data) => masterService.updateStatusKepemilikanRumah(id, data),
        delete: (id) => masterService.deleteStatusKepemilikanRumah(id)
      }}
      queryKey="status-kepemilikan-rumah"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="status"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Status Kepemilikan Rumah" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["status"]}
    />
  );
}