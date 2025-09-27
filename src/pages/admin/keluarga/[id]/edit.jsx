import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Home } from "lucide-react";
import { useEffect } from "react";

import { keluargaEditSchema } from "@/validations/masterSchema";
import keluargaService from "@/services/keluargaService";
import masterService from "@/services/masterService";
import { showToast } from "@/utils/showToast";
import { Card } from "@/components/ui/Card";
import HookForm from "@/components/form/HookForm";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";

export default function EditKeluargaPage() {
  const router = useRouter();
  const { id } = router.query;

  const methods = useForm({
    resolver: zodResolver(keluargaEditSchema),
    defaultValues: {
      noBagungan: "",
      idRayon: "",
      idStatusKeluarga: "",
      idStatusKepemilikanRumah: "",
      idKeadaanRumah: "",
    },
  });

  const { reset, handleSubmit, formState: { errors } } = methods;

  // Fetch keluarga data
  const { data: keluargaData, isLoading } = useQuery({
    queryKey: ["keluarga", id],
    queryFn: () => keluargaService.getById(id),
    enabled: !!id,
  });

  // Fetch master data
  const { data: rayonData } = useQuery({
    queryKey: ["rayon"],
    queryFn: () => masterService.getRayon(),
  });

  const { data: statusKeluargaData } = useQuery({
    queryKey: ["status-keluarga"],
    queryFn: () => masterService.getStatusKeluarga(),
  });

  const { data: statusKepemilikanRumahData } = useQuery({
    queryKey: ["status-kepemilikan-rumah"],
    queryFn: () => masterService.getStatusKepemilikanRumah(),
  });

  const { data: keadaanRumahData } = useQuery({
    queryKey: ["keadaan-rumah"],
    queryFn: () => masterService.getKeadaanRumah(),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => keluargaService.update(id, data),
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Data keluarga berhasil diperbarui",
        color: "success",
      });
      router.push(`/admin/keluarga/${id}`);
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.message || "Gagal memperbarui data keluarga",
        color: "error",
      });
    },
  });

  // Pre-fill form when data is loaded
  useEffect(() => {
    if (keluargaData?.data) {
      const keluarga = keluargaData.data;
      reset({
        noBagungan: keluarga.noBagungan || "",
        idRayon: keluarga.idRayon || "",
        idStatusKeluarga: keluarga.idStatusKeluarga || "",
        idStatusKepemilikanRumah: keluarga.idStatusKepemilikanRumah || "",
        idKeadaanRumah: keluarga.idKeadaanRumah || "",
      });
    }
  }, [keluargaData, reset]);

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  const keluarga = keluargaData?.data;
  
  if (!keluarga) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Data Tidak Ditemukan</h2>
          <p className="text-gray-600">Keluarga tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          onClick={() => router.push(`/admin/keluarga/${id}`)}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Kembali
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Keluarga - No. Bangunan {keluarga.noBagungan}
          </h1>
          <p className="text-gray-600 mt-1">
            Perbarui informasi data keluarga
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-blue-500" />
          Informasi Keluarga
        </h2>

        <HookForm methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              required
              label="No. Bangunan"
              name="noBagungan"
              placeholder="Masukkan no. bangunan"
            />

            <SelectInput
              required
              label="Rayon"
              name="idRayon"
              options={rayonData?.data?.items?.map((item) => ({
                value: item.id,
                label: item.namaRayon,
              })) || []}
              placeholder="Pilih rayon"
            />

            <SelectInput
              label="Status Keluarga"
              name="idStatusKeluarga"
              options={statusKeluargaData?.data?.items?.map((item) => ({
                value: item.id,
                label: item.status,
              })) || []}
              placeholder="Pilih status keluarga (opsional)"
            />

            <SelectInput
              label="Status Kepemilikan Rumah"
              name="idStatusKepemilikanRumah"
              options={statusKepemilikanRumahData?.data?.items?.map((item) => ({
                value: item.id,
                label: item.status,
              })) || []}
              placeholder="Pilih status kepemilikan rumah (opsional)"
            />

            <SelectInput
              label="Keadaan Rumah"
              name="idKeadaanRumah"
              options={keadaanRumahData?.data?.items?.map((item) => ({
                value: item.id,
                label: item.keadaan,
              })) || []}
              placeholder="Pilih keadaan rumah (opsional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              type="button"
              onClick={() => router.push(`/admin/keluarga/${id}`)}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={updateMutation.isPending}
              type="submit"
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </HookForm>
      </Card>
    </div>
  );
}