import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Trash2,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CreateModal from "@/components/ui/CreateModal";
import EditModal from "@/components/ui/EditModal";
import ListGrid from "@/components/ui/ListGrid";
import PhoneInput from "@/components/ui/PhoneInput";
import ViewModal from "@/components/ui/ViewModal";
import axios from "@/lib/axios";
import jemaatService from "@/services/jemaatService";
import keluargaService from "@/services/keluargaService";
import rayonService from "@/services/rayonService";
import userService from "@/services/userService";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [jemaatOptions, setJemaatOptions] = useState([]);
  const [keluargaOptions, setKeluargaOptions] = useState([]);
  const [rayonOptions, setRayonOptions] = useState([]);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [selectedUserForInvitation, setSelectedUserForInvitation] =
    useState(null);
  const [showAccountDataModal, setShowAccountDataModal] = useState(false);
  const [selectedUserForAccountData, setSelectedUserForAccountData] =
    useState(null);
  const [pageSize, setPageSize] = useState(10);

  // Fetch users data
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // Fetch jemaat, keluarga, and rayon data for select options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch jemaat options
        const jemaatResponse = await jemaatService.getAll({ limit: 1000 });
        const jemaatOptions =
          jemaatResponse.data?.items?.map((jemaat) => ({
            value: jemaat.id,
            label: `${jemaat.nama} (${jemaat.keluarga?.noBagungan || "No Bangunan"})`,
          })) || [];

        setJemaatOptions(jemaatOptions);

        // Fetch keluarga options
        const keluargaResponse = await keluargaService.getAll({ limit: 1000 });
        const keluargaOptions =
          keluargaResponse.data?.items?.map((keluarga) => {
            const kepalaKeluarga = keluarga.jemaats?.find(
              (j) => j.statusDalamKeluarga?.status === "Kepala Keluarga"
            );
            const displayName =
              kepalaKeluarga?.nama || `Bangunan ${keluarga.noBagungan}`;

            return {
              value: keluarga.id,
              label: `${displayName} - ${keluarga.rayon?.namaRayon || "Rayon"}`,
            };
          }) || [];

        setKeluargaOptions(keluargaOptions);

        // Fetch rayon options
        const rayonResponse = await rayonService.getAll({ limit: 1000 });
        const rayonOptions =
          rayonResponse.data?.items?.map((rayon) => ({
            value: rayon.id,
            label: rayon.namaRayon,
          })) || [];

        setRayonOptions(rayonOptions);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      key: "username",
      label: "Username",
      type: "text",
      render: (value) => (
        <span className="flex items-center text-sm font-medium">
          <User className="w-4 h-4 mr-2 text-blue-500" />
          {value || "-"}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      render: (value) => (
        <span className="flex items-center text-sm">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          {value || "-"}
        </span>
      ),
    },
    {
      key: "noWhatsapp",
      label: "No. WhatsApp",
      type: "custom",
      component: PhoneInput,
      render: (value) => (
        <span className="flex items-center text-sm">
          <Phone className="w-4 h-4 mr-2 text-green-500" />
          {value || "-"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      type: "badge",
      render: (value) => {
        const badgeClass =
          value === "ADMIN"
            ? "bg-purple-100 text-purple-800"
            : value === "JEMAAT"
              ? "bg-green-100 text-green-800"
              : value === "PENDETA"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {value || "-"}
          </span>
        );
      },
    },
    {
      key: "jemaat",
      label: "Nama Jemaat",
      type: "text",
      render: (value) => value?.nama || "-",
    },
    {
      key: "jenisKelamin",
      label: "Jenis Kelamin",
      type: "text",
      render: (value, row) => {
        const gender = row.jemaat?.jenisKelamin;

        if (gender === null || gender === undefined) return "-";

        return (
          <span className="flex items-center text-sm">
            {gender ? (
              <>
                <UserCheck className="w-4 h-4 mr-1 text-blue-500" />
                Laki-laki
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 mr-1 text-pink-500" />
                Perempuan
              </>
            )}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Tgl Dibuat",
      type: "text",
      render: (value) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
  ];

  const viewFields = [
    { key: "id", label: "ID" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "noWhatsapp", label: "No. WhatsApp" },
    {
      key: "role",
      label: "Role",
      getValue: (item) => item?.role || "-",
    },
    {
      key: "jemaat",
      label: "Nama Jemaat",
      getValue: (item) => item?.jemaat?.nama || "-",
    },
    {
      key: "jenisKelamin",
      label: "Jenis Kelamin",
      getValue: (item) => {
        const gender = item?.jemaat?.jenisKelamin;

        if (gender === null || gender === undefined) return "-";

        return gender ? "Laki-laki" : "Perempuan";
      },
    },
    {
      key: "tanggalLahir",
      label: "Tanggal Lahir",
      getValue: (item) =>
        item?.jemaat?.tanggalLahir ? formatDate(item.jemaat.tanggalLahir) : "-",
    },
    {
      key: "rayon",
      label: "Rayon",
      getValue: (item) => item?.jemaat?.keluarga?.rayon?.namaRayon || "-",
    },
    {
      key: "createdAt",
      label: "Tanggal Dibuat",
      getValue: (item) => formatDate(item?.createdAt),
    },
  ];

  const formFields = [
    {
      key: "username",
      label: "Username",
      type: "text",
      required: true,
      placeholder: "Masukkan username (unik)",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "Masukkan email user",
    },
    {
      key: "noWhatsapp",
      label: "No. WhatsApp",
      type: "tel",
      required: false,
      placeholder: "Masukkan nomor WhatsApp (opsional)",
    },
    {
      key: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Masukkan password",
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: "ADMIN", label: "Admin" },
        { value: "JEMAAT", label: "Jemaat" },
        { value: "MAJELIS", label: "Majelis" },
        { value: "PENDETA", label: "Pendeta" },
        { value: "EMPLOYEE", label: "Pegawai" },
      ],
    },
    {
      key: "idJemaat",
      label: "Pilih Jemaat (Opsional)",
      type: "select",
      options: jemaatOptions,
      placeholder: "Pilih jemaat jika role = JEMAAT",
    },
  ];

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dihapus");
      setDeleteItem(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal menghapus user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil diperbarui");
      setEditItem(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      // Clean up the data before sending
      const cleanData = { ...data };

      // Convert empty strings to null or undefined for optional fields
      if (!cleanData.idJemaat || cleanData.idJemaat === "") {
        cleanData.idJemaat = null;
      }
      if (!cleanData.noWhatsapp || cleanData.noWhatsapp === "") {
        cleanData.noWhatsapp = null;
      }

      console.log("Sending user data:", cleanData);

      return userService.create(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil ditambahkan");
      setShowCreate(false);
    },
    onError: (error) => {
      console.error("Create user error:", error);
      toast.error(error?.response?.data?.message || "Gagal menambahkan user");
    },
  });

  const invitationMutation = useMutation({
    mutationFn: async ({ userId, keluargaId, whatsappNumber }) => {
      const response = await axios.post("/auth/generate-invitation", {
        userId,
        keluargaId,
        whatsappNumber,
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Undangan berhasil dibuat!");

      // Open WhatsApp URL
      if (data.data?.whatsappUrl) {
        window.open(data.data.whatsappUrl, "_blank");
      }

      setShowInvitationModal(false);
      setSelectedUserForInvitation(null);
    },
    onError: (error) => {
      console.error("Invitation error:", error);
      toast.error(error?.response?.data?.message || "Gagal membuat undangan");
    },
  });

  const accountDataMutation = useMutation({
    mutationFn: async ({ userId, whatsappNumber, tempPassword }) => {
      const response = await axios.post("/auth/send-account-data", {
        userId,
        whatsappNumber,
        tempPassword,
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data akun berhasil disiapkan!");

      // Open WhatsApp URL
      if (data.data?.whatsappUrl) {
        window.open(data.data.whatsappUrl, "_blank");
      }

      setShowAccountDataModal(false);
      setSelectedUserForAccountData(null);
    },
    onError: (error) => {
      console.error("Account data error:", error);
      toast.error(error?.response?.data?.message || "Gagal mengirim data akun");
    },
  });

  const handleSendInvitation = (user) => {
    if (user.role !== "JEMAAT") {
      toast.error("Hanya user dengan role JEMAAT yang dapat diundang");

      return;
    }

    if (user.idJemaat) {
      toast.error("User sudah memiliki profil lengkap");

      return;
    }

    if (!user.noWhatsapp) {
      toast.error("User belum memiliki nomor WhatsApp");

      return;
    }

    setSelectedUserForInvitation(user);
    setShowInvitationModal(true);
  };

  const handleSendAccountData = (user) => {
    if (!user.noWhatsapp) {
      toast.error("User belum memiliki nomor WhatsApp");

      return;
    }

    setSelectedUserForAccountData(user);
    setShowAccountDataModal(true);
  };

  // Enhanced search function
  const enhancedSearch = (item, searchTerm) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search in username, email, name, and phone
    return (
      (item.username || "").toLowerCase().includes(searchLower) ||
      (item.email || "").toLowerCase().includes(searchLower) ||
      (item.noWhatsapp || "").toLowerCase().includes(searchLower) ||
      (item.jemaat?.nama || "").toLowerCase().includes(searchLower) ||
      (item.role || "").toLowerCase().includes(searchLower) ||
      (item.jemaat?.keluarga?.rayon?.namaRayon || "").toLowerCase().includes(searchLower)
    );
  };

  // Create filter options based on available data
  const userFilters = [
    {
      key: "role",
      label: "Semua Role",
      options: [
        { value: "ADMIN", label: "Admin" },
        { value: "JEMAAT", label: "Jemaat" },
        { value: "MAJELIS", label: "Majelis" },
        { value: "PENDETA", label: "Pendeta" },
        { value: "EMPLOYEE", label: "Pegawai" },
      ],
    },
    {
      key: "hasJemaat",
      label: "Status Profil",
      options: [
        { value: "true", label: "Profil Lengkap" },
        { value: "false", label: "Belum Lengkap" },
      ],
    },
    {
      key: "hasWhatsapp",
      label: "Status WhatsApp",
      options: [
        { value: "true", label: "Ada WhatsApp" },
        { value: "false", label: "Belum Ada WhatsApp" },
      ],
    },
  ];

  // Add rayon filter if rayon options are available
  if (rayonOptions.length > 0) {
    userFilters.push({
      key: "rayonId",
      label: "Semua Rayon",
      options: rayonOptions,
    });
  }

  // Custom filter function
  const customFilterFunction = (item, filters) => {
    return Object.entries(filters).every(([filterKey, filterValue]) => {
      if (!filterValue || filterValue === "all") return true;

      switch (filterKey) {
        case "role":
          return item.role === filterValue;
        case "hasJemaat":
          const hasJemaat = !!item.idJemaat;
          return hasJemaat.toString() === filterValue;
        case "hasWhatsapp":
          const hasWhatsapp = !!item.noWhatsapp;
          return hasWhatsapp.toString() === filterValue;
        case "rayonId":
          return item.jemaat?.keluarga?.rayon?.id === filterValue;
        default:
          return item[filterKey] === filterValue;
      }
    });
  };

  return (
    <>
      <ListGrid
        breadcrumb={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users" },
        ]}
        columns={columns}
        data={data?.data?.items || []}
        description="Kelola data pengguna sistem"
        emptyStateProps={{
          title: "Belum Ada Data User",
          description: "Mulai dengan menambahkan user pertama",
          actionLabel: "Tambah User",
          onAction: () => setShowCreate(true),
        }}
        error={error}
        exportColumns={[
          {
            key: "username",
            label: "Username",
            type: "text",
          },
          {
            key: "email",
            label: "Email",
            type: "text",
          },
          {
            key: "noWhatsapp",
            label: "No WhatsApp",
            type: "text",
          },
          {
            key: "role",
            label: "Role",
            type: "text",
          },
          {
            key: "jemaat",
            label: "Nama Jemaat",
            render: (value) => value?.nama || "-",
          },
          {
            key: "jenisKelamin",
            label: "Jenis Kelamin",
            render: (value, row) => {
              const gender = row.jemaat?.jenisKelamin;

              if (gender === null || gender === undefined) return "-";

              return gender ? "Laki-laki" : "Perempuan";
            },
          },
          {
            key: "createdAt",
            label: "Tgl Dibuat",
            type: "datetime",
          },
        ]}
        exportFilename="users"
        exportable={true}
        filters={userFilters}
        customFilterFunction={customFilterFunction}
        customSearchFunction={enhancedSearch}
        isLoading={isLoading}
        itemsPerPage={pageSize}
        showPageSizeSelector={true}
        pageSizeOptions={[10, 25, 50, 100]}
        rowActionType="horizontal"
        rowActions={[
          {
            icon: Eye,
            onClick: (item) => setViewItem(item),
            variant: "outline",
            tooltip: "Lihat detail",
          },
          {
            icon: Edit,
            onClick: (item) => setEditItem(item),
            variant: "outline",
            tooltip: "Edit user",
          },
          {
            label: "Kirim Undangan WA",
            icon: MessageCircle,
            onClick: (item) => handleSendInvitation(item),
            variant: "outline",
            tooltip: "Kirim Undangan WhatsApp",
            condition: (item) =>
              item.role === "JEMAAT" && !item.idJemaat && item.noWhatsapp,
          },
          {
            label: "Kirim Data Akun WA",
            icon: Send,
            onClick: (item) => handleSendAccountData(item),
            variant: "outline",
            tooltip: "Kirim Data Akun via WhatsApp",
            condition: (item) => item.noWhatsapp,
          },
          {
            label: "Hapus",
            icon: Trash2,
            onClick: (item) => setDeleteItem(item),
            variant: "outline",
            tooltip: "Hapus user",
          },
        ]}
        searchPlaceholder="Cari username, email, nama jemaat, role, rayon..."
        searchable={true}
        title="Manajemen Users"
        onAdd={() => setShowCreate(true)}
      />

      <ConfirmDialog
        isLoading={deleteMutation.isPending}
        isOpen={!!deleteItem}
        message={`Apakah Anda yakin ingin menghapus user "${deleteItem?.username}" (${deleteItem?.email})? Data yang sudah dihapus tidak dapat dikembalikan.`}
        title="Hapus User"
        variant="danger"
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteMutation.mutate(deleteItem.id)}
      />

      <ViewModal
        data={
          viewItem && Array.isArray(viewFields)
            ? viewFields.map((field) => ({
                label: field.label,
                value: field.getValue
                  ? field.getValue(viewItem)
                  : viewItem?.[field.key],
              }))
            : []
        }
        isOpen={!!viewItem}
        title="Detail User"
        onClose={() => setViewItem(null)}
      />

      <EditModal
        fields={formFields.filter((field) => field.key !== "password")} // Don't show password field in edit
        initialData={editItem}
        isLoading={updateMutation.isPending}
        isOpen={!!editItem}
        title="Edit User"
        onClose={() => setEditItem(null)}
        onSubmit={(formData) =>
          updateMutation.mutate({ id: editItem.id, data: formData })
        }
      />

      <CreateModal
        fields={formFields}
        isLoading={createMutation.isPending}
        isOpen={showCreate}
        title="Tambah User"
        onClose={() => setShowCreate(false)}
        onSubmit={(formData) => createMutation.mutate(formData)}
      />

      {/* Invitation Modal */}
      <CreateModal
        description="Undangan akan dikirim melalui WhatsApp dengan link onboarding yang berlaku selama 7 hari."
        fields={[
          {
            key: "userInfo",
            label: "Informasi User",
            type: "display",
            value: selectedUserForInvitation
              ? `${selectedUserForInvitation.username} (${selectedUserForInvitation.email})`
              : "-",
          },
          {
            key: "whatsappNumber",
            label: "No. WhatsApp",
            type: "custom",
            component: PhoneInput,
            value: selectedUserForInvitation?.noWhatsapp || "",
            placeholder: "Masukkan nomor WhatsApp jika kosong",
          },
          {
            key: "keluargaId",
            label: "Pilih Keluarga",
            type: "select",
            required: true,
            options: keluargaOptions,
            placeholder: "Pilih keluarga untuk user ini",
          },
        ]}
        isLoading={invitationMutation.isPending}
        isOpen={showInvitationModal}
        submitLabel="Kirim Undangan"
        title="Kirim Undangan WhatsApp"
        onClose={() => {
          setShowInvitationModal(false);
          setSelectedUserForInvitation(null);
        }}
        onSubmit={(formData) =>
          invitationMutation.mutate({
            userId: selectedUserForInvitation?.id,
            keluargaId: formData.keluargaId,
            whatsappNumber:
              selectedUserForInvitation?.noWhatsapp || formData.whatsappNumber,
          })
        }
      />

      {/* Account Data Modal */}
      <CreateModal
        description={
          selectedUserForAccountData?.role === "JEMAAT"
            ? "Data akun akan dikirim bersama informasi kepala keluarga. User akan diminta memilih kepala keluarga saat pertama login dan melengkapi profil."
            : "Data akun (username, email, password, role) akan dikirim melalui WhatsApp. Pastikan user segera mengganti password setelah login pertama."
        }
        fields={[
          {
            key: "userInfo",
            label: "Informasi User",
            type: "display",
            value: selectedUserForAccountData
              ? `${selectedUserForAccountData.username} (${selectedUserForAccountData.email}) - ${selectedUserForAccountData.role}`
              : "-",
          },
          {
            key: "whatsappNumber",
            label: "No. WhatsApp",
            type: "custom",
            component: PhoneInput,
            value: selectedUserForAccountData?.noWhatsapp || "",
            placeholder: "Masukkan nomor WhatsApp jika kosong",
            required: true,
          },
          {
            key: "tempPassword",
            label: "Password Sementara",
            type: "text",
            placeholder: "Kosongkan untuk menggunakan 'Password123'",
            description:
              "Password yang akan dikirim ke user (default: Password123)",
          },
          {
            key: "keluargaId",
            label: "Pilih Kepala Keluarga",
            type: "select",
            required: selectedUserForAccountData?.role === "JEMAAT",
            options: keluargaOptions,
            placeholder: "Pilih kepala keluarga untuk jemaat ini",
            condition: selectedUserForAccountData?.role === "JEMAAT",
          },
        ]}
        isLoading={accountDataMutation.isPending}
        isOpen={showAccountDataModal}
        submitLabel="Kirim Data Akun"
        title="Kirim Data Akun via WhatsApp"
        onClose={() => {
          setShowAccountDataModal(false);
          setSelectedUserForAccountData(null);
        }}
        onSubmit={(formData) =>
          accountDataMutation.mutate({
            userId: selectedUserForAccountData?.id,
            whatsappNumber:
              selectedUserForAccountData?.noWhatsapp || formData.whatsappNumber,
            tempPassword: formData.tempPassword,
            keluargaId: formData.keluargaId,
          })
        }
      />
    </>
  );
}
