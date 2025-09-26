import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Trash,
  Plus,
  Church,
  Calendar,
  Pen,
} from "lucide-react";

import jenisIbadahService from "@/services/jenisIbadahService";
import { jenisIbadahSchema } from "@/validations/masterSchema";
import useModalForm from "@/hooks/useModalForm";
import CreateOrEditModal from "@/components/common/CreateOrEditModal";
import ListGrid from "@/components/ui/ListGrid";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import useConfirm from "@/hooks/useConfirm";

const jenisIbadahFields = [
  {
    type: "text",
    name: "namaIbadah",
    label: "Nama Ibadah",
    placeholder: "Masukkan nama ibadah",
    required: true,
  },
];

export default function JenisIbadahPage() {
  const modal = useModalForm();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [viewData, setViewData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jenis-ibadah"],
    queryFn: () => jenisIbadahService.getAll(),
  });

  // Jenis Ibadah mutations
  const jenisIbadahCreateMutation = useMutation({
    mutationFn: (data) => jenisIbadahService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jenis-ibadah"] });
      modal.close();
    },
  });

  const jenisIbadahUpdateMutation = useMutation({
    mutationFn: ({ id, data }) => jenisIbadahService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jenis-ibadah"] });
      modal.close();
    },
  });

  const jenisIbadahDeleteMutation = useMutation({
    mutationFn: (id) => jenisIbadahService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jenis-ibadah"] });
    },
  });

  const columns = [
    {
      key: "id",
      label: "ID",
      type: "text",
      render: (value) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "namaIbadah",
      label: "Nama Ibadah",
      type: "text",
      render: (value) => (
        <span className="flex items-center text-sm font-medium">
          <Church className="w-4 h-4 mr-2 text-blue-500" />
          {value}
        </span>
      ),
    },
    {
      key: "_count",
      label: "Jumlah Penggunaan",
      type: "text",
      render: (value) => (
        <span className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-green-500" />
          {value?.jadwalIbadahs || 0} kali
        </span>
      ),
    },
  ];

  const handleJenisIbadahSubmit = async (formData, isEdit) => {
    if (isEdit) {
      return jenisIbadahUpdateMutation.mutateAsync({ id: modal.editData.id, data: formData });
    }
    return jenisIbadahCreateMutation.mutateAsync(formData);
  };

  const handleDelete = (item) => {
    if (item._count?.jadwalIbadahs > 0) {
      alert(
        "Tidak dapat menghapus jenis ibadah ini karena masih digunakan dalam jadwal ibadah"
      );
      return;
    }

    confirm.showConfirm({
      title: "Hapus Jenis Ibadah",
      message: `Apakah Anda yakin ingin menghapus jenis ibadah "${item.namaIbadah}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: async () => {
        jenisIbadahDeleteMutation.mutate(item.id);
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
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Data Master", href: "/admin/data-master" },
          { label: "Jenis Ibadah", href: "/admin/data-master/jenis-ibadah" },
        ]}
        columns={columns}
        data={data?.data?.items || []}
        description="Kelola data jenis-jenis ibadah di gereja"
        isLoading={isLoading}
        rowActionType="horizontal"
        rowActions={[
          {
            icon: Pen,
            onClick: (item) => modal.open(item),
            variant: "outline",
            tooltip: "Edit jenis ibadah",
          },
          {
            icon: Eye,
            onClick: handleView,
            variant: "outline",
            tooltip: "Lihat detail lengkap",
          },
          {
            icon: Trash,
            onClick: handleDelete,
            variant: "outline",
            tooltip: "Hapus jenis ibadah",
          },
        ]}
        searchPlaceholder="Cari nama ibadah..."
        title="Manajemen Jenis Ibadah"
        onAdd={() => modal.open()}
        exportable={true}
        exportFilename="jenis-ibadah"
      />

      <CreateOrEditModal
        defaultValues={{
          namaIbadah: "",
        }}
        editData={modal.editData}
        fields={jenisIbadahFields}
        isOpen={modal.isOpen}
        isLoading={jenisIbadahCreateMutation.isPending || jenisIbadahUpdateMutation.isPending}
        schema={jenisIbadahSchema}
        title="Jenis Ibadah"
        onClose={modal.close}
        onSubmit={handleJenisIbadahSubmit}
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

      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm transition-opacity"></div>

          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Detail Jenis Ibadah
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      ID
                    </label>
                    <p className="text-sm text-gray-900">{viewData.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Nama Ibadah
                    </label>
                    <p className="text-sm text-gray-900">{viewData.namaIbadah}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Jumlah Penggunaan
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewData._count?.jadwalIbadahs || 0} kali
                    </p>
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
