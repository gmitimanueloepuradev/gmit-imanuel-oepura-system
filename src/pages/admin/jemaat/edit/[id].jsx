import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import jemaatService from "@/services/jemaatService";
import masterService from "@/services/masterService";
import { showToast } from "@/utils/showToast";
import Stepper, {
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import DatePicker from "@/components/ui/inputs/DatePicker";
import PageHeader from "@/components/ui/PageHeader";
import { ArrowLeft } from "lucide-react";

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
      form.setValue("tanggalLahir", jemaat.tanggalLahir ? new Date(jemaat.tanggalLahir).toISOString().split('T')[0] : "");
      form.setValue("golonganDarah", jemaat.golonganDarah || "");
      form.setValue("idKeluarga", jemaat.idKeluarga || "");
      form.setValue("idStatusDalamKeluarga", jemaat.idStatusDalamKeluarga || "");
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
      if (jemaat.statusDalamKeluarga?.status?.toLowerCase().includes("kepala")) {
        setIsKepalaKeluarga(true);
        setCreateKeluarga(true);
        setCreateAlamat(true);

        // Fill keluarga data if exists
        if (jemaat.keluarga) {
          form.setValue("idStatusKeluarga", jemaat.keluarga.idStatusKeluarga || "");
          form.setValue("idStatusKepemilikanRumah", jemaat.keluarga.idStatusKepemilikanRumah || "");
          form.setValue("idKeadaanRumah", jemaat.keluarga.idKeadaanRumah || "");
          form.setValue("idRayon", jemaat.keluarga.idRayon || "");
          form.setValue("noBagungan", jemaat.keluarga.noBagungan || "");

          // Fill alamat data if exists
          if (jemaat.keluarga.alamat) {
            form.setValue("idKelurahan", jemaat.keluarga.alamat.idKelurahan || "");
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
        if (!jemaatData?.data?.statusDalamKeluarga?.status?.toLowerCase().includes("kepala")) {
          setCreateKeluarga(false);
          setCreateAlamat(false);
        }
      }
    }
  }, [watchStatusDalamKeluarga, statusDalamKeluarga, jemaatData]);

  const updateJemaatMutation = useMutation({
    mutationFn: ({ id, data }) => jemaatService.update(id, data),
    onSuccess: (data) => {
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
        description: error.response?.data?.message || "Gagal memperbarui data jemaat",
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
      return (
        values.idKelurahan &&
        values.rt &&
        values.rw &&
        values.jalan
      );
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
          title="Edit Jemaat"
          breadcrumb={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Jemaat", href: "/admin/jemaat" },
            { label: "Edit Jemaat" },
          ]}
          description="Perbarui data jemaat"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          title="Edit Jemaat"
          breadcrumb={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Jemaat", href: "/admin/jemaat" },
            { label: "Edit Jemaat" },
          ]}
          description="Perbarui data jemaat"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Data jemaat tidak ditemukan</p>
            <button
              onClick={() => router.push("/admin/jemaat")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        title="Edit Jemaat"
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Jemaat", href: "/admin/jemaat" },
          { label: "Edit Jemaat" },
        ]}
        description="Perbarui data jemaat dengan mengikuti langkah-langkah berikut"
        actions={[
          {
            label: "Kembali",
            icon: ArrowLeft,
            variant: "outline",
            onClick: () => router.push("/admin/jemaat"),
          },
        ]}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    {...form.register("nama", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin *
                  </label>
                  <select
                    {...form.register("jenisKelamin", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={true}>Laki-laki</option>
                    <option value={false}>Perempuan</option>
                  </select>
                </div>

                <div>
                  <DatePicker
                    label="Tanggal Lahir"
                    required={true}
                    value={form.watch("tanggalLahir")}
                    onChange={(value) => form.setValue("tanggalLahir", value)}
                    placeholder="Pilih tanggal lahir"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Golongan Darah
                  </label>
                  <select
                    {...form.register("golonganDarah")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih golongan darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Dalam Keluarga *
                  </label>
                  <select
                    {...form.register("idStatusDalamKeluarga", {
                      required: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih status</option>
                    {statusDalamKeluarga?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.status}
                      </option>
                    ))}
                  </select>
                </div>

                {!isKepalaKeluarga && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keluarga *
                    </label>
                    <select
                      {...form.register("idKeluarga", {
                        required: !isKepalaKeluarga,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih keluarga</option>
                      {keluargaList?.data?.items?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.rayon?.namaRayon} - {item.noBagungan}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suku *
                  </label>
                  <select
                    {...form.register("idSuku", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih suku</option>
                    {suku?.data?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.namaSuku}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pendidikan *
                  </label>
                  <select
                    {...form.register("idPendidikan", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih pendidikan</option>
                    {pendidikan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.jenjang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pekerjaan *
                  </label>
                  <select
                    {...form.register("idPekerjaan", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih pekerjaan</option>
                    {pekerjaan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.namaPekerjaan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pendapatan *
                  </label>
                  <select
                    {...form.register("idPendapatan", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih pendapatan</option>
                    {pendapatan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jaminan Kesehatan *
                  </label>
                  <select
                    {...form.register("idJaminanKesehatan", {
                      required: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih jaminan kesehatan</option>
                    {jaminanKesehatan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.jenisJaminan}
                      </option>
                    ))}
                  </select>
                </div>
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
                    {hasExistingUser ? "Perbarui akun user" : "Buatkan akun user untuk jemaat ini"}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...form.register("email", {
                        required: createUserAccount,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contoh@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      {...form.register("role")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="JEMAAT">Jemaat</option>
                      <option value="MAJELIS">Majelis</option>
                      <option value="EMPLOYEE">Employee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {hasExistingUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password *"}
                    </label>
                    <input
                      type="password"
                      {...form.register("password", {
                        required: !hasExistingUser && createUserAccount,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={hasExistingUser ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                    />
                  </div>

                  {(!hasExistingUser || form.watch("password")) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password *
                      </label>
                      <input
                        type="password"
                        {...form.register("confirmPassword", {
                          required: (!hasExistingUser && createUserAccount) || form.watch("password"),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ulangi password"
                      />
                    </div>
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
                      : "Perbarui data keluarga untuk jemaat ini."
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Keluarga *
                  </label>
                  <select
                    {...form.register("idStatusKeluarga", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih status keluarga</option>
                    {statusKeluarga?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Kepemilikan Rumah *
                  </label>
                  <select
                    {...form.register("idStatusKepemilikanRumah", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih status kepemilikan</option>
                    {statusKepemilikanRumah?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keadaan Rumah *
                  </label>
                  <select
                    {...form.register("idKeadaanRumah", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih keadaan rumah</option>
                    {keadaanRumah?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.keadaan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rayon *
                  </label>
                  <select
                    {...form.register("idRayon", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih rayon</option>
                    {rayon?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.namaRayon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. Bagungan *
                  </label>
                  <input
                    type="number"
                    {...form.register("noBagungan", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nomor bagungan"
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelurahan *
                  </label>
                  <select
                    {...form.register("idKelurahan", {
                      required: createKeluarga,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih kelurahan</option>
                    {kelurahan?.data?.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nama} - {item.kodepos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jalan *
                  </label>
                  <input
                    type="text"
                    {...form.register("jalan", { required: createKeluarga })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama jalan / kampung"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RT *
                  </label>
                  <input
                    type="number"
                    {...form.register("rt", { required: createKeluarga })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RW *
                  </label>
                  <input
                    type="number"
                    {...form.register("rw", { required: createKeluarga })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="001"
                  />
                </div>
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