import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextInput from "@/components/ui/inputs/TextInput";
import PageTitle from "@/components/ui/PageTitle";
import { showToast } from "@/utils/showToast";

const validationSchema = z.object({
  nama: z.string().min(1, "Nama lengkap harus diisi"),
  jenisKelamin: z.union([z.boolean(), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return val === "true";
    }

    return val;
  }),
  tanggalLahir: z
    .string()
    .min(1, "Tanggal lahir harus diisi")
    .transform((str) => new Date(str)),
  idStatusDalamKeluarga: z
    .string()
    .min(1, "Status dalam keluarga harus dipilih"),
  idSuku: z.string().min(1, "Suku harus dipilih"),
  idPendidikan: z.string().min(1, "Pendidikan harus dipilih"),
  idPekerjaan: z.string().min(1, "Pekerjaan harus dipilih"),
  idPendapatan: z.string().min(1, "Pendapatan harus dipilih"),
  idJaminanKesehatan: z.string().min(1, "Jaminan kesehatan harus dipilih"),
  idKeluarga: z.string().min(1, "Kepala keluarga harus dipilih"),
  golonganDarah: z.string().optional(),
  idPernikahan: z.string().optional(),
});

const jenisKelaminOptions = [
  { value: "true", label: "Laki-laki" },
  { value: "false", label: "Perempuan" },
];

const golonganDarahOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "AB", label: "AB" },
  { value: "O", label: "O" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token } = router.query;
  const [tokenData, setTokenData] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = methods;

  // Validate token on mount and when token changes
  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (invitationToken) => {
    try {
      setIsValidating(true);

      const response = await axios.post("/api/auth/validate-invitation", {
        token: invitationToken,
      });

      if (response.data.success) {
        setTokenData(response.data.data);
        setIsTokenValid(true);
      } else {
        setIsTokenValid(false);
        showToast({
          title: "Token Tidak Valid",
          description:
            response.data.message ||
            "Token undangan tidak valid atau telah kedaluwarsa",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsTokenValid(false);
      showToast({
        title: "Gagal Validasi Token",
        description:
          error.response?.data?.message ||
          "Terjadi kesalahan saat validasi token",
        color: "danger",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Submit onboarding data
  const onboardingMutation = useMutation({
    mutationFn: async (data) => {
      // Prepare clean data with direct field mapping
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
        idPernikahan: data.idPernikahan,
      };

      const response = await axios.post("/api/auth/onboarding", {
        token,
        jemaatData: jemaatData,
      });

      return response.data;
    },
    onSuccess: () => {
      showToast({
        title: "Berhasil",
        description:
          "Profil berhasil dilengkapi! Silakan login untuk melanjutkan",
        color: "success",
      });
      router.push("/login");
    },
    onError: (error) => {
      console.error("Error onboarding:", error);
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal melengkapi profil",
        color: "danger",
      });
    },
  });

  const onSubmit = (data) => {
  onboardingMutation.mutate(data);
  };

  if (!token) {
    return (
      <>
        <PageTitle title="Token Tidak Ditemukan - Onboarding" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Token Tidak Ditemukan
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Link undangan tidak lengkap atau tidak valid.
              </p>
              <Button onClick={() => router.push("/login")}>
                Kembali ke Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isValidating) {
    return (
      <>
        <PageTitle title="Validasi Token - Onboarding" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Memvalidasi Token
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mohon tunggu sebentar...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!isTokenValid || !tokenData) {
    return (
      <>
        <PageTitle title="Token Tidak Valid - Onboarding" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Token Tidak Valid
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Link undangan tidak valid, telah kedaluwarsa, atau sudah
                digunakan.
              </p>
              <Button onClick={() => router.push("/login")}>
                Kembali ke Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        description="Lengkapi profil jemaat GMIT Imanuel Oepura"
        title="Lengkapi Profil - GMIT Imanuel Oepura"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  GMIT Imanuel Oepura
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lengkapi Profil Jemaat</p>
              </div>
            </div>
          </div>

          {/* User & Family Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Informasi Undangan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Nama User</label>
                  <p className="text-gray-900 dark:text-white">{tokenData.user.username}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-gray-900 dark:text-white">{tokenData.user.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Keluarga</label>
                  <p className="text-gray-900 dark:text-white">
                    {tokenData.keluarga.namaKepalaKeluarga || `Bangunan ${tokenData.keluarga.noBagungan}`}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 dark:text-gray-300">Rayon</label>
                  <p className="text-gray-900 dark:text-white">
                    {tokenData.keluarga.rayon.namaRayon}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <TextInput
                        required
                        label="Nama Lengkap"
                        name="nama"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <SelectInput
                      required
                      label="Jenis Kelamin"
                      name="jenisKelamin"
                      options={jenisKelaminOptions}
                      placeholder="Pilih jenis kelamin"
                    />

                    <DatePicker
                      required
                      label="Tanggal Lahir"
                      name="tanggalLahir"
                      placeholder="Pilih tanggal lahir"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/status-dalam-keluarga/options"
                      label="Status dalam Keluarga"
                      name="idStatusDalamKeluarga"
                      placeholder="Pilih status dalam keluarga"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/suku/options"
                      label="Suku"
                      name="idSuku"
                      placeholder="Pilih suku"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/pendidikan/options"
                      label="Pendidikan"
                      name="idPendidikan"
                      placeholder="Pilih pendidikan terakhir"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/pekerjaan/options"
                      label="Pekerjaan"
                      name="idPekerjaan"
                      placeholder="Pilih pekerjaan"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/pendapatan/options"
                      label="Kategori Pendapatan"
                      name="idPendapatan"
                      placeholder="Pilih kategori pendapatan"
                    />

                    <AutoCompleteInput
                      required
                      apiEndpoint="/jaminan-kesehatan/options"
                      label="Jaminan Kesehatan"
                      name="idJaminanKesehatan"
                      placeholder="Pilih jaminan kesehatan"
                    />

                    <div className="md:col-span-2">
                      <AutoCompleteInput
                        required
                        apiEndpoint="/keluarga/options"
                        label="Kepala Keluarga"
                        name="idKeluarga"
                        placeholder="Pilih kepala keluarga Anda"
                      />
                    </div>

                    <SelectInput
                      label="Golongan Darah"
                      name="golonganDarah"
                      options={golonganDarahOptions}
                      placeholder="Pilih golongan darah (opsional)"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/login")}
                    >
                      Batal
                    </Button>

                    <Button
                      className="min-w-[120px]"
                      disabled={!isValid || onboardingMutation.isLoading}
                      type="submit"
                    >
                      {onboardingMutation.isLoading ? (
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {onboardingMutation.isLoading
                        ? "Menyimpan..."
                        : "Simpan Profil"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
