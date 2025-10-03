import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Card } from "@/components/ui/Card";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import TextInput from "@/components/ui/inputs/TextInput";
import PageHeader from "@/components/ui/PageHeader";
import PageTitle from "@/components/ui/PageTitle";
import SkeletonInput from "@/components/ui/skeletons/SkeletonInput";
import Stepper, {
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper";
import { GOLONGAN_DARAH_OPTIONS } from "@/constants/golonganDarah";
import { JENIS_KELAMIN_OPTIONS } from "@/constants/jenisKelamin";
import { USER_ROLE_OPTIONS } from "@/constants/userRoles";
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

export default function CreateJemaat() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { keluargaId, isKepalaKeluarga: isKepalaKeluargaParam } = router.query;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    jemaat: {},
    user: {},
    keluarga: {},
    alamat: {},
  });
  const [isKepalaKeluarga, setIsKepalaKeluarga] = useState(false);
  const [createUserAccount, setCreateUserAccount] = useState(true);
  const [createKeluarga, setCreateKeluarga] = useState(false);
  const [createAlamat, setCreateAlamat] = useState(false);
  const [preSelectedKeluarga, setPreSelectedKeluarga] = useState(null);

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
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      noWhatsapp: "",
      role: "JEMAAT",
      // Keluarga fields
      idStatusKeluarga: "",
      idStatusKepemilikanRumah: "",
      idKeadaanRumah: "",
      idRayon: "",
      noBagungan: "",
      noKK: "",
      // Alamat fields
      idKelurahan: "",
      rt: "",
      rw: "",
      jalan: "",
    },
  });

  // Fetch master data with loading states
  const { data: statusDalamKeluarga, isLoading: isLoadingStatusDalamKeluarga } =
    useQuery({
      queryKey: ["status-dalam-keluarga"],
      queryFn: () => masterService.getStatusDalamKeluarga(),
    });

  const { data: keluargaList, isLoading: isLoadingKeluargaList } = useQuery({
    queryKey: ["keluarga-list"],
    queryFn: () => masterService.getKeluarga(),
  });

  const { data: suku, isLoading: isLoadingSuku } = useQuery({
    queryKey: ["suku"],
    queryFn: () => masterService.getSuku(),
  });

  const { data: pendidikan, isLoading: isLoadingPendidikan } = useQuery({
    queryKey: ["pendidikan"],
    queryFn: () => masterService.getPendidikan(),
  });

  const { data: pekerjaan, isLoading: isLoadingPekerjaan } = useQuery({
    queryKey: ["pekerjaan"],
    queryFn: () => masterService.getPekerjaan(),
  });

  const { data: pendapatan, isLoading: isLoadingPendapatan } = useQuery({
    queryKey: ["pendapatan"],
    queryFn: () => masterService.getPendapatan(),
  });

  const { data: jaminanKesehatan, isLoading: isLoadingJaminanKesehatan } =
    useQuery({
      queryKey: ["jaminan-kesehatan"],
      queryFn: () => masterService.getJaminanKesehatan(),
    });

  const { data: statusKeluarga, isLoading: isLoadingStatusKeluarga } = useQuery(
    {
      queryKey: ["status-keluarga"],
      queryFn: () => masterService.getStatusKeluarga(),
      enabled: createKeluarga,
    }
  );

  const {
    data: statusKepemilikanRumah,
    isLoading: isLoadingStatusKepemilikanRumah,
  } = useQuery({
    queryKey: ["status-kepemilikan-rumah"],
    queryFn: () => masterService.getStatusKepemilikanRumah(),
    enabled: createKeluarga,
  });

  const { data: keadaanRumah, isLoading: isLoadingKeadaanRumah } = useQuery({
    queryKey: ["keadaan-rumah"],
    queryFn: () => masterService.getKeadaanRumah(),
    enabled: createKeluarga,
  });

  const { data: rayon, isLoading: isLoadingRayon } = useQuery({
    queryKey: ["rayon"],
    queryFn: () => masterService.getRayon(),
    enabled: createKeluarga,
  });

  const { data: kelurahan, isLoading: isLoadingKelurahan } = useQuery({
    queryKey: ["kelurahan"],
    queryFn: () => masterService.getKelurahan(),
    enabled: createKeluarga,
  });

  // Transform data for AutoCompleteInput
  const statusDalamKeluargaOptions =
    statusDalamKeluarga?.data?.items?.map((item) => ({
      value: item.id,
      label: item.status,
    })) || [];

  const keluargaListOptions =
    keluargaList?.data?.items?.map((item) => {
      const kepalaKeluarga = item.jemaats?.find((j) =>
        j.statusDalamKeluarga?.status?.toLowerCase().includes("kepala")
      );
      const kepalaName = kepalaKeluarga?.nama || "Belum ada kepala keluarga";

      return {
        value: item.id,
        label: `${kepalaName} - No. ${item.noBagungan} (${item.rayon?.namaRayon})`,
      };
    }) || [];

  const sukuOptions =
    suku?.data?.map((item) => ({
      value: item.id,
      label: item.namaSuku,
    })) || [];

  const pendidikanOptions =
    pendidikan?.data?.items?.map((item) => ({
      value: item.id,
      label: item.jenjang,
    })) || [];

  const pekerjaanOptions =
    pekerjaan?.data?.items?.map((item) => ({
      value: item.id,
      label: item.namaPekerjaan,
    })) || [];

  const pendapatanOptions =
    pendapatan?.data?.items?.map((item) => ({
      value: item.id,
      label: item.label,
    })) || [];

  const jaminanKesehatanOptions =
    jaminanKesehatan?.data?.items?.map((item) => ({
      value: item.id,
      label: item.jenisJaminan,
    })) || [];

  const statusKeluargaOptions =
    statusKeluarga?.data?.items?.map((item) => ({
      value: item.id,
      label: item.status,
    })) || [];

  const statusKepemilikanRumahOptions =
    statusKepemilikanRumah?.data?.items?.map((item) => ({
      value: item.id,
      label: item.status,
    })) || [];

  const keadaanRumahOptions =
    keadaanRumah?.data?.items?.map((item) => ({
      value: item.id,
      label: item.keadaan,
    })) || [];

  const rayonOptions =
    rayon?.data?.items?.map((item) => ({
      value: item.id,
      label: item.namaRayon,
    })) || [];

  const kelurahanOptions =
    kelurahan?.data?.items?.map((item) => ({
      value: item.id,
      label: item.kodepos ? `${item.nama} - ${item.kodepos}` : item.nama,
    })) || [];

  // Watch status dalam keluarga to determine if user is kepala keluarga
  const watchStatusDalamKeluarga = form.watch("idStatusDalamKeluarga");

  // Handle URL parameters for pre-filled keluarga
  useEffect(() => {
    if (keluargaId && isKepalaKeluargaParam === "true") {
      form.setValue("idKeluarga", keluargaId);
      setPreSelectedKeluarga(keluargaId);

      // Auto-set kepala keluarga status
      if (statusDalamKeluarga?.data?.items) {
        const kepalaKeluargaStatus = statusDalamKeluarga.data.items.find(
          (status) => status.status.toLowerCase().includes("kepala")
        );

        if (kepalaKeluargaStatus) {
          form.setValue("idStatusDalamKeluarga", kepalaKeluargaStatus.id);
          setIsKepalaKeluarga(true);
        }
      }
    }
  }, [keluargaId, isKepalaKeluargaParam, statusDalamKeluarga, form]);

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
        // Don't set createKeluarga to false if we have pre-selected keluarga
        if (!preSelectedKeluarga) {
          setCreateKeluarga(false);
          setCreateAlamat(false);
        }
      }
    }
  }, [watchStatusDalamKeluarga, statusDalamKeluarga, preSelectedKeluarga]);

  const createJemaatMutation = useMutation({
    mutationFn: jemaatService.createWithUser,
    onSuccess: (data) => {
      showToast({
        title: "Berhasil",
        description: preSelectedKeluarga
          ? "Kepala keluarga berhasil dibuat! Keluarga sudah lengkap."
          : "Jemaat berhasil dibuat!",
        color: "success",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["jemaat"] });
      queryClient.invalidateQueries({ queryKey: ["keluarga"] });
      queryClient.invalidateQueries({ queryKey: ["rayon"] });

      // Redirect to keluarga page if this was a kepala keluarga creation
      router.push(preSelectedKeluarga ? "/admin/keluarga" : "/admin/jemaat");
    },
    onError: (error) => {
      showToast({
        title: "Gagal",
        description: error.response?.data?.message || "Gagal membuat jemaat",
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
      if (createUserAccount) {
        const password = form.getValues("password");
        const confirmPassword = form.getValues("confirmPassword");

        if (password !== confirmPassword) {
          showToast({
            title: "Error",
            description: "Password dan konfirmasi password tidak cocok",
            color: "error",
          });

          return;
        }

        const userData = {
          username: form.getValues("username"),
          email: form.getValues("email"),
          password: form.getValues("password"),
          noWhatsapp: form.getValues("noWhatsapp") || null,
          role: form.getValues("role"),
        };

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
        noKK: form.getValues("noKK"),
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

  const handleGenerateDefaultPassword = () => {
    const defaultPassword = "oepura78";

    form.setValue("password", defaultPassword);
    form.setValue("confirmPassword", defaultPassword);
    showToast({
      title: "Password Generated",
      description: `Password default "${defaultPassword}" berhasil diisi`,
      color: "success",
    });
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
    "username",
    "email",
    "password",
    "confirmPassword",
    "noWhatsapp",
    "idStatusKeluarga",
    "idStatusKepemilikanRumah",
    "idKeadaanRumah",
    "idRayon",
    "noBagungan",
    "idKelurahan",
    "rt",
    "rw",
    "jalan",
  ]);

  const canGoNext = () => {
    const values = form.getValues();

    if (currentStep === 1) {
      // Check if required data is still loading
      const isDataLoaded =
        !isLoadingStatusDalamKeluarga &&
        !isLoadingSuku &&
        !isLoadingPendidikan &&
        !isLoadingPekerjaan &&
        !isLoadingPendapatan &&
        !isLoadingJaminanKesehatan;

      if (!isKepalaKeluarga && !preSelectedKeluarga && isLoadingKeluargaList) {
        return false;
      }

      if (!isDataLoaded) return false;

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

    if (currentStep === 2 && createUserAccount) {
      return (
        values.username &&
        values.email &&
        values.password &&
        values.confirmPassword
      );
    }

    if (currentStep === 3 && createKeluarga) {
      // Check if keluarga data is still loading
      const isKeluargaDataLoaded =
        !isLoadingStatusKeluarga &&
        !isLoadingStatusKepemilikanRumah &&
        !isLoadingKeadaanRumah &&
        !isLoadingRayon;

      if (!isKeluargaDataLoaded) return false;

      return (
        values.idStatusKeluarga &&
        values.idStatusKepemilikanRumah &&
        values.idKeadaanRumah &&
        values.idRayon &&
        values.noBagungan
      );
    }

    if (currentStep === 4 && createKeluarga) {
      if (isLoadingKelurahan) return false;

      return values.idKelurahan && values.rt && values.rw && values.jalan;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Get user data directly from form (in case user clicked submit without clicking "next" on step 2)
    const userData = createUserAccount
      ? {
          username: form.getValues("username"),
          email: form.getValues("email"),
          password: form.getValues("password"),
          noWhatsapp: form.getValues("noWhatsapp") || null,
          role: form.getValues("role"),
        }
      : {};

    const submitData = {
      ...formData.jemaat,
      createUser: createUserAccount,
      ...userData, // Use fresh data from form instead of formData.user
      createKeluarga,
      ...(createKeluarga && { keluargaData: formData.keluarga }),
      createAlamat: createKeluarga, // Always create alamat when creating keluarga
      ...(createKeluarga && {
        alamatData: {
          idKelurahan: form.getValues("idKelurahan"),
          rt: parseInt(form.getValues("rt")),
          rw: parseInt(form.getValues("rw")),
          jalan: form.getValues("jalan"),
        },
      }),
    };

    createJemaatMutation.mutate(submitData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageTitle title="Tambah Jemaat" />
      <PageHeader
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          ...(preSelectedKeluarga
            ? [
                { label: "Keluarga", href: "/admin/keluarga" },
                { label: "Tambah Kepala Keluarga" },
              ]
            : [
                { label: "Jemaat", href: "/admin/jemaat" },
                { label: "Tambah Jemaat" },
              ]),
        ]}
        description={
          preSelectedKeluarga
            ? "Lengkapi data kepala keluarga untuk keluarga yang baru dibuat"
            : "Lengkapi data jemaat dengan mengikuti langkah-langkah berikut"
        }
        title={
          preSelectedKeluarga ? "Tambah Kepala Keluarga" : "Tambah Jemaat Baru"
        }
      />

      <Card className="p-6 mt-4">
        <Stepper
          currentStep={currentStep}
          steps={steps.slice(0, getMaxStep())}
        />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {/* Step 1: Data Jemaat */}
            {currentStep === 1 && (
              <StepContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <TextInput
                      required
                      label="Nama Lengkap"
                      name="nama"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <AutoCompleteInput
                      required
                      label="Jenis Kelamin"
                      name="jenisKelamin"
                      options={JENIS_KELAMIN_OPTIONS}
                      placeholder="Pilih jenis kelamin"
                    />
                  </div>

                  <div>
                    <DatePicker
                      label="Tanggal Lahir"
                      name="tanggalLahir"
                      placeholder="Pilih tanggal lahir"
                      required={true}
                    />
                  </div>

                  <div>
                    <AutoCompleteInput
                      label="Golongan Darah"
                      name="golonganDarah"
                      options={GOLONGAN_DARAH_OPTIONS}
                      placeholder="Pilih golongan darah"
                    />
                  </div>

                  <div>
                    {isLoadingStatusDalamKeluarga ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Status Dalam Keluarga"
                        name="idStatusDalamKeluarga"
                        options={statusDalamKeluargaOptions}
                        placeholder="Pilih status"
                      />
                    )}
                  </div>

                  {!isKepalaKeluarga && !preSelectedKeluarga && (
                    <div>
                      {isLoadingKeluargaList ? (
                        <SkeletonInput />
                      ) : (
                        <AutoCompleteInput
                          label="Keluarga"
                          name="idKeluarga"
                          options={keluargaListOptions}
                          placeholder="Pilih keluarga"
                          required={!isKepalaKeluarga && !preSelectedKeluarga}
                        />
                      )}
                    </div>
                  )}

                  {preSelectedKeluarga && (
                    <div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Kepala Keluarga</strong> - Jemaat ini akan
                          menjadi kepala keluarga yang baru dibuat.
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    {isLoadingSuku ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Suku"
                        name="idSuku"
                        options={sukuOptions}
                        placeholder="Pilih suku"
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingPendidikan ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Pendidikan"
                        name="idPendidikan"
                        options={pendidikanOptions}
                        placeholder="Pilih pendidikan"
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingPekerjaan ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Pekerjaan"
                        name="idPekerjaan"
                        options={pekerjaanOptions}
                        placeholder="Pilih pekerjaan"
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingPendapatan ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Pendapatan"
                        name="idPendapatan"
                        options={pendapatanOptions}
                        placeholder="Pilih pendapatan"
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingJaminanKesehatan ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        required
                        label="Jaminan Kesehatan"
                        name="idJaminanKesehatan"
                        options={jaminanKesehatanOptions}
                        placeholder="Pilih jaminan kesehatan"
                      />
                    )}
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
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Buatkan akun user untuk jemaat ini
                    </span>
                  </label>
                </div>

                {createUserAccount && (
                  <>
                    <div className="mb-4">
                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                        type="button"
                        onClick={handleGenerateDefaultPassword}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            fillRule="evenodd"
                          />
                        </svg>
                        Generate Password Default (oepura78)
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Klik tombol di atas untuk mengisi password dengan
                        default <strong>oepura78</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <TextInput
                          label="Username"
                          name="username"
                          placeholder="Username untuk login"
                          required={createUserAccount}
                          type="text"
                        />
                      </div>

                      <div>
                        <TextInput
                          label="Email"
                          name="email"
                          placeholder="contoh@email.com"
                          required={createUserAccount}
                          type="email"
                        />
                      </div>

                      <div>
                        <TextInput
                          label="No. WhatsApp"
                          name="noWhatsapp"
                          placeholder="08123456789"
                          required={true}
                          type="tel"
                        />
                      </div>

                      <div>
                        <AutoCompleteInput
                          label="Role"
                          name="role"
                          options={USER_ROLE_OPTIONS}
                          placeholder="Pilih role"
                        />
                      </div>

                      <div>
                        <TextInput
                          label="Password"
                          name="password"
                          placeholder="Masukkan password"
                          required={createUserAccount}
                          type="password"
                        />
                      </div>

                      <div>
                        <TextInput
                          label="Konfirmasi Password"
                          name="confirmPassword"
                          placeholder="Ulangi password"
                          required={createUserAccount}
                          type="password"
                        />
                      </div>
                    </div>
                  </>
                )}
              </StepContent>
            )}

            {/* Step 3: Keluarga Data */}
            {currentStep === 3 && createKeluarga && (
              <StepContent>
                <div className="mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Jemaat ini adalah kepala keluarga. Silakan lengkapi data
                      keluarga.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {isLoadingStatusKeluarga ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        label="Status Keluarga"
                        name="idStatusKeluarga"
                        options={statusKeluargaOptions}
                        placeholder="Pilih status keluarga"
                        required={createKeluarga}
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingStatusKepemilikanRumah ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        label="Status Kepemilikan Rumah"
                        name="idStatusKepemilikanRumah"
                        options={statusKepemilikanRumahOptions}
                        placeholder="Pilih status kepemilikan"
                        required={createKeluarga}
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingKeadaanRumah ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        label="Keadaan Rumah"
                        name="idKeadaanRumah"
                        options={keadaanRumahOptions}
                        placeholder="Pilih keadaan rumah"
                        required={createKeluarga}
                      />
                    )}
                  </div>

                  <div>
                    {isLoadingRayon ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        label="Rayon"
                        name="idRayon"
                        options={rayonOptions}
                        placeholder="Pilih rayon"
                        required={createKeluarga}
                      />
                    )}
                  </div>

                  <div>
                    <TextInput
                      label="No. Bagungan"
                      name="noBagungan"
                      placeholder="Masukkan nomor bagungan"
                      required={createKeluarga}
                      type="number"
                    />
                  </div>

                  <div>
                    <TextInput
                      required
                      label="No. Kartu Keluarga (KK)"
                      maxLength={16}
                      name="noKK"
                      placeholder="Masukkan nomor KK (16 digit)"
                      type="text"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Alamat akan otomatis dibuat untuk keluarga baru ini.
                    </p>
                  </div>
                </div>
              </StepContent>
            )}

            {/* Step 4: Alamat */}
            {currentStep === 4 && createKeluarga && (
              <StepContent>
                <div className="mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Lengkapi alamat untuk keluarga baru ini.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {isLoadingKelurahan ? (
                      <SkeletonInput />
                    ) : (
                      <AutoCompleteInput
                        label="Kelurahan"
                        name="idKelurahan"
                        options={kelurahanOptions}
                        placeholder="Pilih kelurahan"
                        required={createKeluarga}
                      />
                    )}
                  </div>

                  <div>
                    <TextInput
                      label="Jalan"
                      name="jalan"
                      placeholder="Nama jalan / kampung"
                      required={createKeluarga}
                    />
                  </div>

                  <div>
                    <TextInput
                      label="RT"
                      name="rt"
                      placeholder="001"
                      required={createKeluarga}
                      type="number"
                    />
                  </div>

                  <div>
                    <TextInput
                      label="RW"
                      name="rw"
                      placeholder="001"
                      required={createKeluarga}
                      type="number"
                    />
                  </div>
                </div>
              </StepContent>
            )}

            <StepperNavigation
              canGoNext={canGoNext()}
              currentStep={currentStep}
              isLoading={createJemaatMutation.isPending}
              nextButtonText="Lanjut"
              submitButtonText="Simpan Jemaat"
              totalSteps={getMaxStep()}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
