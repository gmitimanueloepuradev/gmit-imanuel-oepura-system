import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  UserCheck,
  Crown,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";

import { majelisCreationSchema } from "@/validations/masterSchema";
import majelisService from "@/services/majelisService";
import masterService from "@/services/masterService";
import { showToast } from "@/utils/showToast";
import Stepper, {
  StepperNavigation,
  StepContent,
} from "@/components/ui/Stepper";
import HookForm from "@/components/form/HookForm";
import TextInput from "@/components/ui/inputs/TextInput";
import DatePicker from "@/components/ui/inputs/DatePicker";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";

const steps = [
  {
    id: "majelis-info",
    title: "Data Majelis",
    description: "Informasi dasar majelis",
  },
  {
    id: "account-info",
    title: "Data Akun",
    description: "Buat akun login untuk majelis",
  },
  {
    id: "confirmation",
    title: "Konfirmasi",
    description: "Review dan simpan data",
  },
];

export default function CreateMajelisPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const methods = useForm({
    resolver: zodResolver(majelisCreationSchema),
    defaultValues: {
      namaLengkap: "",
      mulai: "",
      selesai: "",
      idRayon: "",
      jenisJabatanId: "",
      username: "",
      email: "",
      password: "",
      noWhatsapp: "",
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = methods;

  const watchedValues = watch();

  // Check if current step can proceed
  const checkCanProceed = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);

    if (fieldsToValidate.length === 0) {
      setCanProceed(true);
      return;
    }

    const values = getValues();
    let canProceed = true;

    // Check required fields for current step
    for (const field of fieldsToValidate) {
      if (!values[field] || values[field] === '') {
        canProceed = false;
        break;
      }
    }

    setCanProceed(canProceed);
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);

    if (fieldsToValidate.length === 0) {
      return true;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ["namaLengkap", "mulai", "jenisJabatanId"];
      case 2:
        return ["username", "email", "password"];
      case 3:
        return []; // No validation needed for confirmation step
      default:
        return [];
    }
  };

  const handleNext = async () => {
    try {
      const isValid = await validateCurrentStep();

      if (isValid) {
        const nextStep = Math.min(currentStep + 1, steps.length);
        setCurrentStep(nextStep);
        // Reset can proceed for next step
        await checkCanProceed();
      } else {
        showToast({
          title: "Validasi Gagal",
          description: "Mohon lengkapi semua field yang wajib diisi dengan benar",
          color: "error",
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      showToast({
        title: "Error",
        description: "Terjadi kesalahan saat validasi",
        color: "error",
      });
    }
  };

  const handlePrevious = async () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    // Check can proceed for previous step
    await checkCanProceed();
  };

  const handleStepClick = async (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    } else if (stepNumber === currentStep + 1) {
      await handleNext();
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const result = await majelisService.createWithAccount(data);

      if (result.success) {
        showToast({
          title: "Berhasil",
          description: "Majelis dan akun berhasil dibuat",
          color: "success",
        });

        // Invalidate majelis query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["majelis"] });

        router.push("/admin/majelis");
      } else {
        showToast({
          title: "Gagal",
          description: result.message || "Gagal membuat majelis dan akun",
          color: "error",
        });
      }
    } catch (error) {
      console.error("Error creating majelis:", error);
      showToast({
        title: "Error",
        description: "Terjadi kesalahan sistem",
        color: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for form changes and update canProceed
  useEffect(() => {
    checkCanProceed();
  }, [watchedValues, currentStep]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Nama Lengkap"
                name="namaLengkap"
                placeholder="Masukkan nama lengkap majelis"
                required
                leftIcon={<User className="w-4 h-4" />}
              />

              <DatePicker
                label="Tanggal Mulai Jabatan"
                name="mulai"
                placeholder="Pilih tanggal mulai"
                required
                leftIcon={<Calendar className="w-4 h-4" />}
              />

              <DatePicker
                label="Tanggal Selesai Jabatan"
                name="selesai"
                placeholder="Pilih tanggal selesai (opsional)"
                leftIcon={<Calendar className="w-4 h-4" />}
              />

              <AutoCompleteInput
                label="Jenis Jabatan"
                name="jenisJabatanId"
                placeholder="Pilih jenis jabatan"
                apiEndpoint="/jenis-jabatan/options"
                required
                leftIcon={<Crown className="w-4 h-4" />}
              />

              <AutoCompleteInput
                label="Rayon"
                name="idRayon"
                placeholder="Pilih rayon (opsional)"
                apiEndpoint="/rayon/options"
                leftIcon={<MapPin className="w-4 h-4" />}
              />

            </div>
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                label="Username"
                name="username"
                placeholder="Masukkan username"
                required
                leftIcon={<UserCheck className="w-4 h-4" />}
              />

              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="Masukkan email"
                required
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                required
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <TextInput
                label="No. WhatsApp"
                name="noWhatsapp"
                placeholder="Masukkan nomor WhatsApp (opsional)"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>
          </StepContent>
        );

      case 3:
        return (
          <StepContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Konfirmasi Data Majelis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">
                    Data Majelis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nama Lengkap:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {watchedValues.namaLengkap}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tanggal Mulai:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{watchedValues.mulai}</span>
                    </div>
                    {watchedValues.selesai && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tanggal Selesai:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {watchedValues.selesai}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-3">Data Akun</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Username:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {watchedValues.username}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{watchedValues.email}</span>
                    </div>
                    {watchedValues.noWhatsapp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">WhatsApp:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {watchedValues.noWhatsapp}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors duration-300">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Catatan:</strong> Setelah data disimpan, akun majelis
                  akan otomatis dibuat dan dapat digunakan untuk login dengan
                  username dan password yang telah ditentukan.
                </p>
              </div>
            </div>
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tambah Majelis Baru
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Buat data majelis baru beserta akun login dalam satu proses
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* Form */}
      <HookForm methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-300">
          {renderStepContent()}

          <StepperNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            canGoNext={canProceed}
            nextButtonText="Lanjut"
            submitButtonText="Buat Majelis & Akun"
          />
        </div>
      </HookForm>
    </div>
  );
}
