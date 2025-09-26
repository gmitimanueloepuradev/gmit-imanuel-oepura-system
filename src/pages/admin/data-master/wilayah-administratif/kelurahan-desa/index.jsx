import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pen, Trash } from "lucide-react";

import masterService from "@/services/masterService";
import { kelurahanDesaSchema } from "@/validations/masterSchema";
import useModalForm from "@/hooks/useModalForm";
import CreateOrEditModal from "@/components/common/CreateOrEditModal";
import ListGrid from "@/components/ui/ListGrid";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import useConfirm from "@/hooks/useConfirm";

const kelurahanDesaFields = [
  {
    type: "text",
    name: "nama",
    label: "Nama Kelurahan / Desa",
    placeholder: "Masukkan nama kelurahan/desa",
    required: true,
  },
  {
    type: "select",
    name: "idKecamatan",
    label: "Kecamatan",
    placeholder: "Pilih kecamatan",
    required: true,
    options: [], // Will be populated dynamically
  },
  {
    type: "text",
    name: "kodePos",
    label: "Kode Pos",
    placeholder: "Masukkan kode pos (5 digit)",
    required: true,
  },
];

export default function KelurahanDesaPage() {
  const modal = useModalForm();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [viewData, setViewData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["kelurahanDesa"],
    queryFn: () => masterService.getKelurahanDesa(),
  });

  const { data: kecamatanData } = useQuery({
    queryKey: ["kecamatan-options"],
    queryFn: () => masterService.getKecamatan(),
  });

  // Kelurahan/Desa mutations
  const kelurahanDesaCreateMutation = useMutation({
    mutationFn: (data) => masterService.createKelurahanDesa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelurahanDesa"] });
      modal.close();
    },
  });

  const kelurahanDesaUpdateMutation = useMutation({
    mutationFn: ({ id, data }) => masterService.updateKelurahanDesa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelurahanDesa"] });
      modal.close();
    },
  });

  // Update kecamatan options
  const fieldsWithOptions = kelurahanDesaFields.map(field => {
    if (field.name === "idKecamatan" && kecamatanData?.data?.items) {
      return {
        ...field,
        options: kecamatanData.data.items.map(item => ({
          value: item.id,
          label: item.nama
        }))
      };
    }
    return field;
  });

  const columns = [
    { key: "id", label: "ID", type: "text" },
    { key: "nama", label: "Nama Kelurahan / Desa", type: "text" },
    {
      key: "isActive",
      label: "Status",
      type: "boolean",
      badgeVariant: (value) => (value === true ? "success" : "danger"),
    },
  ];

  const handleSubmit = async (formData, isEdit) => {
    if (isEdit) {
      return kelurahanDesaUpdateMutation.mutateAsync({ id: modal.editData.id, data: formData });
    }
    return kelurahanDesaCreateMutation.mutateAsync(formData);
  };

  const handleDelete = (item) => {
    confirm.showConfirm({
      title: "Hapus Kelurahan/Desa",
      message: `Apakah Anda yakin ingin menghapus "${item.nama}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        try {
          await masterService.deleteKelurahanDesa(item.id);
          refetch();
        } catch (error) {
          console.error("Error deleting kelurahan/desa:", error);
        }
      },
    });
  };

  const handleView = (item) => {
    setViewData(item);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <ListGrid
        columns={columns}
        data={data?.data?.items || []}
        isLoading={isLoading}
        title={"Daftar Kelurahan / Desa"}
        exportable={true}
        exportFilename="kelurahan-desa"
        searchPlaceholder="Cari kelurahan/desa..."
        description={"Kelola data kelurahan/desa"}
        rowActionType="horizontal"
        rowActions={[
          {
            label: "Edit",
            icon: Pen,
            onClick: (item) => modal.open(item),
            variant: "outline",
            tooltip: "Edit kelurahan/desa",
          },
          {
            label: "View",
            icon: Eye,
            onClick: handleView,
            variant: "outline",
            tooltip: "Lihat detail kelurahan/desa",
          },
          {
            label: "Delete",
            icon: Trash,
            onClick: handleDelete,
            variant: "outline",
            tooltip: "Hapus kelurahan/desa",
          },
        ]}
        breadcrumb={[
          {
            label: "Wilayah Administratif",
            href: "/admin/data-master/wilayah-administratif",
          },
          {
            label: "Kelurahan / Desa",
          },
        ]}
        onAdd={() => modal.open()}
      />

      <CreateOrEditModal
        defaultValues={{ nama: "", idKecamatan: "", kodePos: "" }}
        editData={modal.editData}
        fields={fieldsWithOptions}
        isOpen={modal.isOpen}
        isLoading={kelurahanDesaCreateMutation.isPending || kelurahanDesaUpdateMutation.isPending}
        schema={kelurahanDesaSchema}
        title="Kelurahan / Desa"
        onClose={modal.close}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.hideConfirm}
        onConfirm={confirm.handleConfirm}
        title={confirm.config.title}
        message={confirm.config.message}
        confirmText={confirm.config.confirmText}
        cancelText={confirm.config.cancelText}
        variant={confirm.config.variant}
      />

      {/* View Modal */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm transition-opacity"></div>
          
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Detail Kelurahan/Desa
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID</label>
                    <p className="text-sm text-gray-900">{viewData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nama</label>
                    <p className="text-sm text-gray-900">{viewData.nama}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {viewData.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
