import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function PendidikanPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "jenjang",
      label: "Jenjang Pendidikan",
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
    { key: "jenjang", label: "Jenjang Pendidikan" },
    { 
      key: "isActive", 
      label: "Status Aktif", 
      getValue: (item) => item?.isActive ? "Aktif" : "Tidak Aktif" 
    },
  ];

  const formFields = [
    {
      key: "jenjang",
      label: "Jenjang Pendidikan",
      type: "text",
      required: true,
      placeholder: "Masukkan jenjang pendidikan"
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
      title="Data Pendidikan"
      description="Kelola data pendidikan"
      service={{
        get: () => masterService.getPendidikan(),
        create: (data) => masterService.createPendidikan(data),
        update: (id, data) => masterService.updatePendidikan(id, data),
        delete: (id) => masterService.deletePendidikan(id)
      }}
      queryKey="pendidikan"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="jenjang"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Pendidikan" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["jenjang"]}
    />
  );
}