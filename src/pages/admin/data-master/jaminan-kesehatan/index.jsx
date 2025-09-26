import masterService from "@/services/masterService";
import MasterDataPage from "@/components/ui/MasterDataPage";

export default function JaminanKesehatanPage() {
  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "jenisJaminan",
      label: "Jenis Jaminan",
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
    { key: "jenisJaminan", label: "Jenis Jaminan" },
    { 
      key: "isActive", 
      label: "Status Aktif", 
      getValue: (item) => item?.isActive ? "Aktif" : "Tidak Aktif" 
    },
  ];

  const formFields = [
    {
      key: "jenisJaminan",
      label: "Jenis Jaminan",
      type: "text",
      required: true,
      placeholder: "Masukkan jenis jaminan kesehatan"
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
      title="Data Jaminan Kesehatan"
      description="Kelola data jaminan kesehatan"
      service={{
        get: () => masterService.getJaminanKesehatan(),
        create: (data) => masterService.createJaminanKesehatan(data),
        update: (id, data) => masterService.updateJaminanKesehatan(id, data),
        delete: (id) => masterService.deleteJaminanKesehatan(id)
      }}
      queryKey="jaminan-kesehatan"
      columns={columns}
      viewFields={viewFields}
      formFields={formFields}
      itemNameField="jenisJaminan"
      breadcrumb={[
        { label: "Admin", href: "/admin/dashboard" },
        { label: "Jaminan Kesehatan" },
      ]}
      exportable={true}
      allowBulkDelete={true}
      searchFields={["jenisJaminan"]}
    />
  );
}