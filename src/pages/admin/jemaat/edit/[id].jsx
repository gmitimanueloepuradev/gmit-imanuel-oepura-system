import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Card } from "@/components/ui/Card";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextInput from "@/components/ui/inputs/TextInput";
import PageHeader from "@/components/ui/PageHeader";
import Stepper, {
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper";
import jemaatService from "@/services/jemaatService";
import masterService from "@/services/masterService";
import { showToast } from "@/utils/showToast";

const steps = [
  {
    id: 1,
    title: "Data Jemaat",
    description: "Informasi dasar jemaat",
  },
  {
    id: 2,
    title: "Akun User",
    description: "Pembuatan akun login",
  },
  {
    id: 3,
    title: "Data Keluarga",
    description: "Informasi keluarga",
  },
  {
    id: 4,
    title: "Alamat",
    description: "Alamat keluarga",
  },
];

export default function EditJemaat() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jemaat: {},
    user: {},
    keluarga: {},
    alamat: {},
  });
  const [isKepalaKeluarga, setIsKepalaKeluarga] = useState(false);
  const [createUserAccount, setCreateUserAccount] = useState(false);
  const [createKeluarga, setCreateKeluarga] = useState(false);
  const [createAlamat, setCreateAlamat] = useState(false);
  const [hasExistingUser, setHasExistingUser] = useState(false);

  const form = useForm({
    defaultValues: {
      // Jemaat fields
      nama: "",
      jenisKelamin: true, // true = laki-laki, false = perempuan
      tanggalLahir: "",
      golonganDarah: "",
      idKeluarga: "",
      idStatusDalamKeluarga: "",
      idSuku: "",
      idPendidikan: "",
      idPekerjaan: "",
      idPendapatan: "",
      idJaminanKesehatan: "",
      // User fields
      email: "",
      password: "",
      confirmPassword: "",
      role: "JEMAAT",
      // Keluarga fields
      idStatusKeluarga: "",
      idStatusKepemilikanRumah: "",
      idKeadaanRumah: "",
      idRayon: "",
      noBagungan: "",
      // Alamat fields
      idKelurahan: "",
      rt: "",
      rw: "",
      jalan: "",
    },
  });

  // Fetch jemaat data
  const { data: jemaatData, isLoading: jemaatLoading } = useQuery({
    queryKey: ["jemaat", id],
    queryFn: () => jemaatService.getById(id),
    enabled: !!id,
  });

  // Fetch master data
  const { data: statusDalamKeluarga } = useQuery({
    queryKey: ["status-dalam-keluarga"],
    queryFn: () => masterService.getStatusDalamKeluarga(),
  });

  const { data: keluargaList } = useQuery({
    queryKey: ["keluarga-list"],
    queryFn: () => masterService.getKeluarga(),
  });

  const { data: suku } = useQuery({
    queryKey: ["suku"],
    queryFn: () => masterService.getSuku(),
  });

  const { data: pendidikan } = useQuery({
    queryKey: ["pendidikan"],
    queryFn: () => masterService.getPendidikan(),
  });

  const { data: pekerjaan } = useQuery({
    queryKey: ["pekerjaan"],
    queryFn: () => masterService.getPekerjaan(),
  });

  const { data: pendapatan } = useQuery({
    queryKey: ["pendapatan"],
    queryFn: () => masterService.getPendapatan(),
  });

  const { data: jaminanKesehatan } = useQuery({
    queryKey: ["jaminan-kesehatan"],
    queryFn: () => masterService.getJaminanKesehatan(),
  });

  const { data: statusKeluarga } = useQuery({
    queryKey: ["status-keluarga"],
    queryFn: () => masterService.getStatusKeluarga(),
    enabled: createKeluarga,
  });

  const { data: statusKepemilikanRumah } = useQuery({
    queryKey: ["status-kepemilikan-rumah"],
    queryFn: () => masterService.getStatusKepemilikanRumah(),
    enabled: createKeluarga,
  });

  const { data: keadaanRumah } = useQuery({
    queryKey: ["keadaan-rumah"],
    queryFn: () => masterService.getKeadaanRumah(),
    enabled: createKeluarga,
  });

  const { data: rayon } = useQuery({
    queryKey: ["rayon"],
    queryFn: () => masterService.getRayon(),
    enabled: createKeluarga,
  });

  const { data: kelurahan } = useQuery({
    queryKey: ["kelurahan"],
    queryFn: () => masterService.getKelurahan(),
    enabled: createKeluarga,
  });

  // Pre-fill form when data loaded
  useEffect(() => {
    if (jemaatData?.data) {
      const jemaat = jemaatData.data;

      // Fill jemaat data
      form.setValue("nama", jemaat.nama || "");
      form.setValue("jenisKelamin", jemaat.jenisKelamin ?? true);
      form.setValue(
        "tanggalLahir",
        jemaat.tanggalLahir
          ? new Date(jemaat.tanggalLahir).toISOString().split("T")[0]
          : ""
      );
      form.setValue("golonganDarah", jemaat.golonganDarah || "");
      form.setValue("idKeluarga", jemaat.idKeluarga || "");
      form.setValue(
        "idStatusDalamKeluarga",
        jemaat.idStatusDalamKeluarga || ""
      );
      form.setValue("idSuku", jemaat.idSuku || "");
      form.setValue("idPendidikan", jemaat.idPendidikan || "");
      form.setValue("idPekerjaan", jemaat.idPekerjaan || "");
      form.setValue("idPendapatan", jemaat.idPendapatan || "");
      form.setValue("idJaminanKesehatan", jemaat.idJaminanKesehatan || "");

      // Check if has user account
      if (jemaat.User) {
        setHasExistingUser(true);
        setCreateUserAccount(true);
        form.setValue("email", jemaat.User.email || "");
        form.setValue("role", jemaat.User.role || "JEMAAT");
      }

      // Check if kepala keluarga and has keluarga data
      if (
        jemaat.statusDalamKeluarga?.status?.toLowerCase().includes("kepala")
      ) {
        setIsKepalaKeluarga(true);
        setCreateKeluarga(true);
        setCreateAlamat(true);

        // Fill keluarga data if exists
        if (jemaat.keluarga) {
          form.setValue(
            "idStatusKeluarga",
            jemaat.keluarga.idStatusKeluarga || ""
          );
          form.setValue(
            "idStatusKepemilikanRumah",
            jemaat.keluarga.idStatusKepemilikanRumah || ""
          );
          form.setValue("idKeadaanRumah", jemaat.keluarga.idKeadaanRumah || "");
          form.setValue("idRayon", jemaat.keluarga.idRayon || "");
          form.setValue("noBagungan", jemaat.keluarga.noBagungan || "");

          // Fill alamat data if exists
          if (jemaat.keluarga.alamat) {
            form.setValue(
              "idKelurahan",
              jemaat.keluarga.alamat.idKelurahan || ""
            );
            form.setValue("rt", jemaat.keluarga.alamat.rt || "");
            form.setValue("rw", jemaat.keluarga.alamat.rw || "");
            form.setValue("jalan", jemaat.keluarga.alamat.jalan || "");
          }
        }
      }
    }
  }, [jemaatData, form]);

  // Watch status dalam keluarga to determine if user is kepala keluarga
  const watchStatusDalamKeluarga = form.watch("idStatusDalamKeluarga");

  useEffect(() => {
    if (statusDalamKeluarga?.data?.items) {
      const kepalaKeluargaStatus = statusDalamKeluarga.data.items.find(
        (status) => status.status.toLowerCase().includes("kepala")
      );

      if (
        kepalaKeluargaStatus &&
        watchStatusDalamKeluarga === kepalaKeluargaStatus.id
      ) {
        setIsKepalaKeluarga(true);
        setCreateKeluarga(true);
        setCreateAlamat(true); // Always create alamat when creating keluarga
      } else {
        setIsKepalaKeluarga(false);
        // Don't automatically set to false if editing existing data
        if (
          !jemaatData?.data?.statusDalamKeluarga?.status
            ?.toLowerCase()
            .includes("kepala")
        ) {
          setCreateKeluarga(false);
          setCreateAlamat(false);
        }
      }
    }
  }, [watchStatusDalamKeluarga, statusDalamKeluarga, jemaatData]);

  const updateJemaatMutation = useMutation({
    mutationFn: ({ id, data }) => jemaatService.update(id, data),
    onSuccess: (data) => {
      // Invalidate queries related to jemaat data
      queryClient.invalidateQueries(['jemaat']);
      queryClient.invalidateQueries(['jemaat-list']);
      queryClient.invalidateQueries(['admin-jemaat']);
      queryClient.invalidateQueries(['jemaat', id]);

      showToast({
        title: "Berhasil",
        description: "Data jemaat berhasil diperbarui!",
        color: "success",
      });
      router.push("/admin/jemaat");
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description:
          error.response?.data?.message || "Gagal memperbarui data jemaat",
        color: "error",
      });
    },
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate jemaat data
      const jemaatData = {
        nama: form.getValues("nama"),
        jenisKelamin: form.getValues("jenisKelamin"),
        tanggalLahir: form.getValues("tanggalLahir"),
        idStatusDalamKeluarga: form.getValues("idStatusDalamKeluarga"),
        idSuku: form.getValues("idSuku"),
        idPendidikan: form.getValues("idPendidikan"),
        idPekerjaan: form.getValues("idPekerjaan"),
        idPendapatan: form.getValues("idPendapatan"),
        idJaminanKesehatan: form.getValues("idJaminanKesehatan"),
        golonganDarah: form.getValues("golonganDarah"),
      };

      if (!isKepalaKeluarga) {
        jemaatData.idKeluarga = form.getValues("idKeluarga");
      }

      setFormData((prev) => ({ ...prev, jemaat: jemaatData }));
    } else if (currentStep === 2) {
      // Validate user data
      if (createUserAccount && !hasExistingUser) {
        const password = form.getValues("password");
        const confirmPassword = form.getValues("confirmPassword");

        if (password && password !== confirmPassword) {
          showToast({
            title: "Error",
            description: "Password dan konfirmasi password tidak cocok",
            color: "error",
          });

          return;
        }

        const userData = {
          email: form.getValues("email"),
          password: form.getValues("password"),
          role: form.getValues("role"),
        };

        setFormData((prev) => ({ ...prev, user: userData }));
      } else if (createUserAccount && hasExistingUser) {
        // Update existing user
        const userData = {
          email: form.getValues("email"),
          role: form.getValues("role"),
        };

        const password = form.getValues("password");

        if (password) {
          userData.password = password;
        }

        setFormData((prev) => ({ ...prev, user: userData }));
      }
    } else if (currentStep === 3 && createKeluarga) {
      // Validate keluarga data
      const keluargaData = {
        idStatusKeluarga: form.getValues("idStatusKeluarga"),
        idStatusKepemilikanRumah: form.getValues("idStatusKepemilikanRumah"),
        idKeadaanRumah: form.getValues("idKeadaanRumah"),
        idRayon: form.getValues("idRayon"),
        noBagungan: parseInt(form.getValues("noBagungan")),
      };

      setFormData((prev) => ({ ...prev, keluarga: keluargaData }));
    }

    if (currentStep < getMaxStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getMaxStep = () => {
    if (!createUserAccount) return 1;
    if (!createKeluarga) return 2;

    // Alamat is always required when creating keluarga
    return 4;
  };

  // Watch form values for real-time validation
  const watchedValues = form.watch([
    "nama",
    "tanggalLahir",
    "idStatusDalamKeluarga",
    "idSuku",
    "idPendidikan",
    "idPekerjaan",
    "idPendapatan",
    "idJaminanKesehatan",
    "idKeluarga",
    "email",
    "password",
    "confirmPassword",
    "idStatusKeluarga",
    "idStatusKepemilikanRumah",
    "idKeadaanRumah",
    "idRayon",
    "noBagungan",
  ]);

  const canGoNext = () => {
    const values = form.getValues();

    if (currentStep === 1) {
      return (
        values.nama &&
        values.tanggalLahir &&
        values.idStatusDalamKeluarga &&
        values.idSuku &&
        values.idPendidikan &&
        values.idPekerjaan &&
        values.idPendapatan &&
        values.idJaminanKesehatan &&
        (isKepalaKeluarga || values.idKeluarga)
      );
    }

    if (currentStep === 2 && createUserAccount && !hasExistingUser) {
      return values.email && values.password && values.confirmPassword;
    }

    if (currentStep === 2 && createUserAccount && hasExistingUser) {
      return values.email; // Password optional for existing user
    }

    if (currentStep === 3 && createKeluarga) {
      return (
        values.idStatusKeluarga &&
        values.idStatusKepemilikanRumah &&
        values.idKeadaanRumah &&
        values.idRayon &&
        values.noBagungan
      );
    }

    if (currentStep === 4 && createKeluarga) {
      return values.idKelurahan && values.rt && values.rw && values.jalan;
    }

    return true;
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData.jemaat,
      updateUser: createUserAccount,
      ...(createUserAccount && formData.user),
      updateKeluarga: createKeluarga,
      ...(createKeluarga && { keluargaData: formData.keluarga }),
      updateAlamat: createKeluarga, // Always create alamat when creating keluarga
      ...(createKeluarga && {
        alamatData: {
          idKelurahan: form.getValues("idKelurahan"),
          rt: parseInt(form.getValues("rt")),
          rw: parseInt(form.getValues("rw")),
          jalan: form.getValues("jalan"),
        },
      }),
    };

    updateJemaatMutation.mutate({ id, data: submitData });
  };

  if (jemaatLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <PageHeader
          breadcrumb={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Jemaat", href: "/admin/jemaat" },
            { label: "Edit Jemaat" },
          ]}
          description="Perbarui data jemaat"
          title="Edit Jemaat"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data jemaat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jemaatData?.data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <PageHeader
          breadcrumb={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Jemaat", href: "/admin/jemaat" },
            { label: "Edit Jemaat" },
          ]}
          description="Perbarui data jemaat"
          title="Edit Jemaat"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Data jemaat tidak ditemukan</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push("/admin/jemaat")}
            >
              Kembali ke Daftar Jemaat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        actions={[
          {
            label: "Kembali",
            icon: ArrowLeft,
            variant: "outline",
            onClick: () => router.push("/admin/jemaat"),
          },
        ]}
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Jemaat", href: "/admin/jemaat" },
          { label: "Edit Jemaat" },
        ]}
        description="Perbarui data jemaat dengan mengikuti langkah-langkah berikut"
        title="Edit Jemaat"
      />

      <Card className="p-6 mt-4">
        <Stepper
          currentStep={currentStep}
          steps={steps.slice(0, getMaxStep())}
        />

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Step 1: Data Jemaat */}
          {currentStep === 1 && (
            <StepContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  name="nama"
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  required
                />

                <SelectInput
                  name="jenisKelamin"
                  label="Jenis Kelamin"
                  placeholder="Pilih jenis kelamin"
                  options={[
                    { value: "true", label: "Laki-laki" },
                    { value: "false", label: "Perempuan" }
                  ]}
                  required
                />

                <DatePicker
                  label="Tanggal Lahir"
                  placeholder="Pilih tanggal lahir"
                  required={true}
                  value={form.watch("tanggalLahir")}
                  onChange={(value) => form.setValue("tanggalLahir", value)}
                />

                <SelectInput
                  name="golonganDarah"
                  label="Golongan Darah"
                  placeholder="Pilih golongan darah"
                  options={[
                    { value: "A", label: "A" },
                    { value: "B", label: "B" },
                    { value: "AB", label: "AB" },
                    { value: "O", label: "O" }
                  ]}
                />

                <AutoCompleteInput
                  name="idStatusDalamKeluarga"
                  label="Status Dalam Keluarga"
                  placeholder="Pilih status"
                  options={statusDalamKeluarga?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.status
                  })) || []}
                  required
                />

                {!isKepalaKeluarga && (
                  <AutoCompleteInput
                    name="idKeluarga"
                    label="Keluarga"
                    placeholder="Pilih keluarga"
                    options={keluargaList?.data?.items?.map((item) => ({
                      value: item.id,
                      label: `${item.rayon?.namaRayon} - ${item.noBagungan}`
                    })) || []}
                    required
                  />
                )}

                <AutoCompleteInput
                  name="idSuku"
                  label="Suku"
                  placeholder="Pilih suku"
                  options={suku?.data?.map((item) => ({
                    value: item.id,
                    label: item.namaSuku
                  })) || []}
                  required
                />

                <AutoCompleteInput
                  name="idPendidikan"
                  label="Pendidikan"
                  placeholder="Pilih pendidikan"
                  options={pendidikan?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.jenjang
                  })) || []}
                  required
                />

                <AutoCompleteInput
                  name="idPekerjaan"
                  label="Pekerjaan"
                  placeholder="Pilih pekerjaan"
                  options={pekerjaan?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.namaPekerjaan
                  })) || []}
                  required
                />

                <AutoCompleteInput
                  name="idPendapatan"
                  label="Pendapatan"
                  placeholder="Pilih pendapatan"
                  options={pendapatan?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.label
                  })) || []}
                  required
                />

                <AutoCompleteInput
                  name="idJaminanKesehatan"
                  label="Jaminan Kesehatan"
                  placeholder="Pilih jaminan kesehatan"
                  options={jaminanKesehatan?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.jenisJaminan
                  })) || []}
                  required
                />
              </div>
            </StepContent>
          )}

          {/* Step 2: User Account */}
          {currentStep === 2 && (
            <StepContent>
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    checked={createUserAccount}
                    className="mr-2"
                    type="checkbox"
                    onChange={(e) => setCreateUserAccount(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {hasExistingUser
                      ? "Perbarui akun user"
                      : "Buatkan akun user untuk jemaat ini"}
                  </span>
                </label>
                {hasExistingUser && (
                  <p className="text-sm text-blue-600 mt-1">
                    Jemaat ini sudah memiliki akun user
                  </p>
                )}
              </div>

              {createUserAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="contoh@email.com"
                    required={createUserAccount}
                  />

                  <SelectInput
                    name="role"
                    label="Role"
                    placeholder="Pilih role"
                    options={[
                      { value: "JEMAAT", label: "Jemaat" },
                      { value: "MAJELIS", label: "Majelis" },
                      { value: "EMPLOYEE", label: "Employee" }
                    ]}
                  />

                  <TextInput
                    name="password"
                    type="password"
                    label={hasExistingUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}
                    placeholder={hasExistingUser ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                    required={!hasExistingUser && createUserAccount}
                  />

                  {(!hasExistingUser || form.watch("password")) && (
                    <TextInput
                      name="confirmPassword"
                      type="password"
                      label="Konfirmasi Password"
                      placeholder="Ulangi password"
                      required={(!hasExistingUser && createUserAccount) || !!form.watch("password")}
                    />
                  )}
                </div>
              )}
            </StepContent>
          )}

          {/* Step 3: Keluarga Data */}
          {currentStep === 3 && createKeluarga && (
            <StepContent>
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    {isKepalaKeluarga
                      ? "Jemaat ini adalah kepala keluarga. Silakan lengkapi data keluarga."
                      : "Perbarui data keluarga untuk jemaat ini."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AutoCompleteInput
                  name="idStatusKeluarga"
                  label="Status Keluarga"
                  placeholder="Pilih status keluarga"
                  options={statusKeluarga?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.status
                  })) || []}
                  required={createKeluarga}
                />

                <AutoCompleteInput
                  name="idStatusKepemilikanRumah"
                  label="Status Kepemilikan Rumah"
                  placeholder="Pilih status kepemilikan"
                  options={statusKepemilikanRumah?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.status
                  })) || []}
                  required={createKeluarga}
                />

                <AutoCompleteInput
                  name="idKeadaanRumah"
                  label="Keadaan Rumah"
                  placeholder="Pilih keadaan rumah"
                  options={keadaanRumah?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.keadaan
                  })) || []}
                  required={createKeluarga}
                />

                <AutoCompleteInput
                  name="idRayon"
                  label="Rayon"
                  placeholder="Pilih rayon"
                  options={rayon?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.namaRayon
                  })) || []}
                  required={createKeluarga}
                />

                <TextInput
                  name="noBagungan"
                  type="number"
                  label="No. Bagungan"
                  placeholder="Masukkan nomor bagungan"
                  required={createKeluarga}
                />
              </div>

              <div className="mt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-700">
                    Alamat akan diperbarui untuk keluarga ini.
                  </p>
                </div>
              </div>
            </StepContent>
          )}

          {/* Step 4: Alamat */}
          {currentStep === 4 && createKeluarga && (
            <StepContent>
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    Perbarui alamat untuk keluarga ini.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AutoCompleteInput
                  name="idKelurahan"
                  label="Kelurahan"
                  placeholder="Pilih kelurahan"
                  options={kelurahan?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.kodepos ? `${item.nama} - ${item.kodepos}` : item.nama
                  })) || []}
                  required={createKeluarga}
                />

                <TextInput
                  name="jalan"
                  label="Jalan"
                  placeholder="Nama jalan / kampung"
                  required={createKeluarga}
                />

                <TextInput
                  name="rt"
                  type="number"
                  label="RT"
                  placeholder="001"
                  required={createKeluarga}
                />

                <TextInput
                  name="rw"
                  type="number"
                  label="RW"
                  placeholder="001"
                  required={createKeluarga}
                />
              </div>
            </StepContent>
          )}

          <StepperNavigation
            canGoNext={canGoNext()}
            currentStep={currentStep}
            isLoading={updateJemaatMutation.isPending}
            nextButtonText="Lanjut"
            submitButtonText="Perbarui Jemaat"
            totalSteps={getMaxStep()}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
          />
        </form>
      </Card>
    </div>
  );
}
