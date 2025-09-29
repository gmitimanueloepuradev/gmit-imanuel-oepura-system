import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Calculator, Save } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import AutoCompleteInput from "@/components/ui/inputs/AutoCompleteInput";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import PageHeader from "@/components/ui/PageHeader";

export default function CreateRealisasiPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    itemKeuanganId: "",
    periodeId: "",
    tanggalRealisasi: "",
    totalRealisasi: "",
    keterangan: "",
  });

  // Query untuk get item keuangan (level 4 only)
  const { data: itemList, isLoading: itemLoading } = useQuery({
    queryKey: ["item-level-4"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/item", {
        params: { level: 4, limit: 200 },
      });

      return response.data.data.items;
    },
  });

  // Get selected item details
  const selectedItem = itemList?.find(
    (item) => item.id === formData.itemKeuanganId
  );

  // Query untuk get periode list
  const { data: periodeList } = useQuery({
    queryKey: ["periode-list"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/periode", {
        params: { limit: 50, isActive: true },
      });
      return response.data.data.items;
    },
  });

  // Mutation untuk create realisasi
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/keuangan/realisasi", data);

      return response.data;
    },
    onSuccess: () => {
      // Refetch all realisasi-related queries
      queryClient.invalidateQueries(["realisasi-summary"]);
      queryClient.invalidateQueries(["realisasi-list"]);
      queryClient.invalidateQueries(["realisasi-item-summary"]);
      queryClient.invalidateQueries(["realisasi-item-list"]);
      toast.success("Realisasi berhasil dibuat");
      router.push("/admin/keuangan/realisasi");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal membuat realisasi");
    },
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto set periode when item is selected
    if (name === "itemKeuanganId" && value) {
      const item = itemList?.find(item => item.id === value);
      if (item) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          periodeId: item.periodeId, // Auto set periode from selected item
        }));
      }
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.itemKeuanganId ||
      !formData.periodeId ||
      !formData.tanggalRealisasi ||
      !formData.totalRealisasi
    ) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    createMutation.mutate(formData);
  };

  // Format rupiah for display
  const formatRupiah = (amount) => {
    if (!amount || amount === 0) return "Rp 0";

    return `Rp ${parseFloat(amount).toLocaleString("id-ID")}`;
  };

  if (itemLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        breadcrumbs={[
          { label: "Keuangan", href: "/admin/keuangan" },
          { label: "Realisasi", href: "/admin/keuangan/realisasi" },
          { label: "Tambah" },
        ]}
        description="Tambah data realisasi untuk item keuangan"
        title="Tambah Realisasi Keuangan"
      />

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Realisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Item Keuangan */}
                <div>
                  <AutoCompleteInput
                    label="Item Keuangan"
                    placeholder="Cari dan pilih item keuangan..."
                    required
                    value={formData.itemKeuanganId}
                    options={Array.isArray(itemList) ? itemList.map(item => ({
                      value: item.id,
                      label: `${item.kode} - ${item.nama} (${item.kategori.nama})`
                    })) : []}
                    onChange={(value) => {
                      handleInputChange({ target: { name: 'itemKeuanganId', value } });
                    }}
                  />
                </div>

                {/* Periode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Periode <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    name="periodeId"
                    value={formData.periodeId}
                    onChange={handleInputChange}
                    disabled={formData.itemKeuanganId} // Auto-set from item selection
                  >
                    <option value="">Pilih Periode</option>
                    {Array.isArray(periodeList) &&
                      periodeList.map((periode) => (
                        <option key={periode.id} value={periode.id}>
                          {periode.nama} ({periode.tahun})
                        </option>
                      ))}
                  </select>
                  {formData.itemKeuanganId && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Periode otomatis dipilih berdasarkan item keuangan
                    </p>
                  )}
                </div>

                {/* Tanggal Realisasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Realisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    name="tanggalRealisasi"
                    type="date"
                    value={formData.tanggalRealisasi}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Total Realisasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Realisasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    min="0"
                    name="totalRealisasi"
                    placeholder="Contoh: 5500000"
                    step="0.01"
                    type="number"
                    value={formData.totalRealisasi}
                    onChange={handleInputChange}
                  />
                  {formData.totalRealisasi && (
                    <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      Format: {formatRupiah(formData.totalRealisasi)}
                    </div>
                  )}
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    name="keterangan"
                    placeholder="Catatan tambahan..."
                    rows="3"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    className="flex items-center gap-2"
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>

                  <Button
                    className="flex items-center gap-2"
                    disabled={createMutation.isPending}
                    type="submit"
                  >
                    <Save className="h-4 w-4" />
                    {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Selected Item Info */}
          {selectedItem && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Target Item
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Kode:</span>
                  <p className="font-mono font-medium">{selectedItem.kode}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Nama:</span>
                  <p className="font-medium">{selectedItem.nama}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Kategori:</span>
                  <p>{selectedItem.kategori.nama}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Target Frekuensi:
                  </span>
                  <p>
                    {selectedItem.targetFrekuensi || 0}x{" "}
                    {selectedItem.satuanFrekuensi}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Nominal Target:</span>
                  <p>{formatRupiah(selectedItem.nominalSatuan)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Target:</span>
                  <p className="text-lg font-bold text-blue-600">
                    {formatRupiah(selectedItem.totalTarget)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calculation Preview */}
          {formData.totalRealisasi && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Realisasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Tanggal:
                  </span>
                  <span>
                    {formData.tanggalRealisasi ?
                      new Date(formData.tanggalRealisasi).toLocaleDateString('id-ID')
                      : '-'}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Realisasi:</span>
                  <span className="text-green-600">
                    {formatRupiah(formData.totalRealisasi)}
                  </span>
                </div>

                {selectedItem && (
                  <>
                    <hr />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">vs Target Item:</span>
                      <span
                        className={
                          parseFloat(formData.totalRealisasi) >=
                          parseFloat(selectedItem.totalTarget || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {parseFloat(formData.totalRealisasi) >=
                        parseFloat(selectedItem.totalTarget || 0)
                          ? "✓ Melebihi target per satuan"
                          : "✗ Belum mencapai target per satuan"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Total target item: {formatRupiah(selectedItem.totalTarget)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
