import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { showToast } from "@/utils/showToast";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TextInput from "@/components/ui/inputs/TextInput";
import SelectInput from "@/components/ui/inputs/SelectInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import {
  User,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  LogOut
} from "lucide-react";

const validationSchema = z.object({
  nama: z.string().min(1, "Nama lengkap harus diisi"),
  jenisKelamin: z.union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === "string") {
        return val === "true";
      }
      return val;
    }),
  tanggalLahir: z.string()
    .min(1, "Tanggal lahir harus diisi")
    .transform((str) => new Date(str)),
  idStatusDalamKeluarga: z.string().min(1, "Status dalam keluarga harus dipilih"),
  idSuku: z.string().min(1, "Suku harus dipilih"),
  idPendidikan: z.string().min(1, "Pendidikan harus dipilih"),
  idPekerjaan: z.string().min(1, "Pekerjaan harus dipilih"),
  idPendapatan: z.string().min(1, "Pendapatan harus dipilih"),
  idJaminanKesehatan: z.string().min(1, "Jaminan kesehatan harus dipilih"),
  idKeluarga: z.string().min(1, "Kepala keluarga harus dipilih"),
  golonganDarah: z.string().optional(),
  idPernikahan: z.string().optional()
});

const jenisKelaminOptions = [
  { value: "true", label: "Laki-laki" },
  { value: "false", label: "Perempuan" }
];

const golonganDarahOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" }
];

export default function OnboardingDialog({ user, onComplete }) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange"
  });

  const {
    handleSubmit,
    formState: { errors, isValid }
  } = methods;

  // Create jemaat profile mutation
  const onboardingMutation = useMutation({
    mutationFn: async (data) => {
      // Prepare data for jemaat creation with proper relations
      const jemaatData = {
        nama: data.nama,
        jenisKelamin: data.jenisKelamin,
        tanggalLahir: data.tanggalLahir,
        golonganDarah: data.golonganDarah,
        idKeluarga: data.idKeluarga,
        idStatusDalamKeluarga: data.idStatusDalamKeluarga,
        idSuku: data.idSuku,
        idPendidikan: data.idPendidikan,
        idPekerjaan: data.idPekerjaan,
        idPendapatan: data.idPendapatan,
        idJaminanKesehatan: data.idJaminanKesehatan,
        idPernikahan: data.idPernikahan
      };
      
      // Step 1: Create jemaat profile
      const jemaatResponse = await axios.post("/api/jemaat", jemaatData);
      console.log("Jemaat created successfully:", jemaatResponse.data);
      
      // Step 2: Update user with jemaat ID
      const userUpdateResponse = await axios.patch(`/api/users/${user.id}`, {
        idJemaat: jemaatResponse.data.data.id
      });
      console.log("User updated successfully:", userUpdateResponse.data);
      
      return jemaatResponse.data;
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description: "Profil berhasil dilengkapi!",
        color: "success"
      });
      // Invalidate all user-related queries to force refresh
      queryClient.invalidateQueries(['user']);
      queryClient.invalidateQueries(['auth']);
      queryClient.refetchQueries(['user']);
      
      // Reload page to ensure fresh data
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
    },
    onError: (error) => {
      console.error("Error onboarding:", error);
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal melengkapi profil",
        color: "danger"
      });
    }
  });

  const onSubmit = (data) => {
    onboardingMutation.mutate(data);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setShowLogoutDialog(false);

      // Use the AuthContext logout function which handles everything properly
      await logout();

      // Additional cleanup for onboarding
      queryClient.clear();

      // Clear all storage to be absolutely sure
      localStorage.clear();
      sessionStorage.clear();

      // Force a hard redirect to login page
      window.location.replace("/login");

    } catch (error) {
      console.error("Logout error:", error);

      // Fallback: force logout even if something fails
      authService.logout();
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();

      showToast({
        title: "Logout",
        description: "Mengarahkan ke halaman login...",
        color: "success"
      });

      // Hard redirect as fallback
      setTimeout(() => {
        window.location.replace("/login");
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto transition-colors">
        {/* Header */}
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
                  Profil Belum Lengkap
                </h2>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Anda harus melengkapi profil terlebih dahulu untuk dapat menggunakan sistem
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <TextInput
                        name="nama"
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>

                    <SelectInput
                      name="jenisKelamin"
                      label="Jenis Kelamin"
                      options={jenisKelaminOptions}
                      placeholder="Pilih jenis kelamin"
                      required
                    />

                    <DatePicker
                      name="tanggalLahir"
                      label="Tanggal Lahir"
                      placeholder="Pilih tanggal lahir"
                      required
                    />

                    <AutoCompleteInput
                      name="idStatusDalamKeluarga"
                      label="Status dalam Keluarga"
                      apiEndpoint="/status-dalam-keluarga/options"
                      placeholder="Pilih status dalam keluarga"
                      required
                    />

                    <AutoCompleteInput
                      name="idSuku"
                      label="Suku"
                      apiEndpoint="/suku/options"
                      placeholder="Pilih suku"
                      required
                    />

                    <AutoCompleteInput
                      name="idPendidikan"
                      label="Pendidikan"
                      apiEndpoint="/pendidikan/options"
                      placeholder="Pilih pendidikan terakhir"
                      required
                    />

                    <AutoCompleteInput
                      name="idPekerjaan"
                      label="Pekerjaan"
                      apiEndpoint="/pekerjaan/options"
                      placeholder="Pilih pekerjaan"
                      required
                    />

                    <AutoCompleteInput
                      name="idPendapatan"
                      label="Kategori Pendapatan"
                      apiEndpoint="/pendapatan/options"
                      placeholder="Pilih kategori pendapatan"
                      required
                    />

                    <AutoCompleteInput
                      name="idJaminanKesehatan"
                      label="Jaminan Kesehatan"
                      apiEndpoint="/jaminan-kesehatan/options"
                      placeholder="Pilih jaminan kesehatan"
                      required
                    />

                    <div className="md:col-span-2">
                      <AutoCompleteInput
                        name="idKeluarga"
                        label="Kepala Keluarga"
                        apiEndpoint="/keluarga/options"
                        placeholder="Pilih kepala keluarga Anda"
                        required
                      />
                    </div>

                    <SelectInput
                      name="golonganDarah"
                      label="Golongan Darah"
                      options={golonganDarahOptions}
                      placeholder="Pilih golongan darah (opsional)"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={!isValid || onboardingMutation.isLoading}
                      className="min-w-[120px]"
                    >
                      {onboardingMutation.isLoading ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {onboardingMutation.isLoading ? "Menyimpan..." : "Simpan Profil"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        confirmText="Ya, Logout"
        cancelText="Batal"
        isOpen={showLogoutDialog}
        message="Apakah Anda yakin ingin logout? Data yang sedang diisi akan hilang dan Anda harus login ulang untuk melengkapi profil."
        title="Konfirmasi Logout"
        variant="danger"
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}