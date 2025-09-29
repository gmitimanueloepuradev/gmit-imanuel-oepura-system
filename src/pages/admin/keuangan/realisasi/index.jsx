import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart3,
  Edit,
  Filter,
  Plus,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import PageHeader from "@/components/ui/PageHeader";
import PageTitle from "@/components/ui/PageTitle";

export default function RealisasiKeuanganPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [realisasiToDelete, setRealisasiToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Query untuk get periode list
  const { data: periodeList } = useQuery({
    queryKey: ["periode-list"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/periode", {
        params: { limit: 50, isActive: true },
      });

      return response.data.data.items;
    },
    onSuccess: (data) => {
      // Set default to "Periode I" if not already selected
      if (!selectedPeriode && data && data.length > 0) {
        const periodeI = data.find((periode) => periode.nama === "Periode I");

        if (periodeI) {
          setSelectedPeriode(periodeI.id);
        } else {
          // If "Periode I" not found, use the first periode
          setSelectedPeriode(data[0].id);
        }
      }
    },
  });

  // Query untuk get kategori list
  const { data: kategoriList } = useQuery({
    queryKey: ["kategori-list"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/kategori");

      return response.data.data.items;
    },
  });

  // Query untuk get item keuangan
  const { data: itemList } = useQuery({
    queryKey: ["item-keuangan-list", selectedPeriode, selectedKategori],
    queryFn: async () => {
      const params = { level: 4 }; // Only level 4 items can have realization

      if (selectedPeriode) params.periodeId = selectedPeriode;
      if (selectedKategori) params.kategoriId = selectedKategori;

      const response = await axios.get("/api/keuangan/item", { params });

      return response.data.data.items;
    },
    enabled: !!selectedPeriode,
  });

  // Query untuk get realisasi summary
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: [
      "realisasi-summary",
      selectedPeriode,
      selectedKategori,
      selectedItem,
    ],
    queryFn: async () => {
      const params = {};

      if (selectedPeriode) params.periodeId = selectedPeriode;
      if (selectedKategori) params.kategoriId = selectedKategori;
      if (selectedItem) params.itemKeuanganId = selectedItem;

      const response = await axios.get("/api/keuangan/realisasi/summary", {
        params,
      });

      return response.data.data;
    },
    enabled: !!selectedPeriode,
  });

  // Query untuk get realisasi detail
  const { data: realisasiData, isLoading: realisasiLoading } = useQuery({
    queryKey: [
      "realisasi-list",
      selectedPeriode,
      selectedKategori,
      selectedItem,
    ],
    queryFn: async () => {
      const params = {};

      if (selectedPeriode) params.periodeId = selectedPeriode;
      if (selectedKategori) params.kategoriId = selectedKategori;
      if (selectedItem) params.itemKeuanganId = selectedItem;

      const response = await axios.get("/api/keuangan/realisasi", { params });

      return response.data.data;
    },
    enabled: !!selectedPeriode,
  });

  // Mutation untuk delete realisasi
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/keuangan/realisasi/${id}`);
    },
    onSuccess: () => {
      // Refetch all realisasi-related queries
      queryClient.invalidateQueries(["realisasi-summary"]);
      queryClient.invalidateQueries(["realisasi-list"]);
      queryClient.invalidateQueries(["realisasi-item-summary"]);
      queryClient.invalidateQueries(["realisasi-item-list"]);
      toast.success("Realisasi berhasil dihapus");
      setRealisasiToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus realisasi");
    },
  });

  // Format rupiah
  const formatRupiah = (amount) => {
    if (!amount || amount === 0) return "Rp 0";

    return `Rp ${parseFloat(amount).toLocaleString("id-ID")}`;
  };

  // Format persentase
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        description="Kelola dan pantau realisasi vs target anggaran"
        title="Manajemen Realisasi Keuangan"
      />

      <PageTitle title={"Manajemen Realisasi Keuangan"} />

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Periode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Periode
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
              >
                <option value="">Pilih Periode</option>
                {Array.isArray(periodeList) &&
                  periodeList.map((periode) => (
                    <option key={periode.id} value={periode.id}>
                      {periode.nama} ({periode.tahun})
                    </option>
                  ))}
              </select>
            </div>

            {/* Kategori Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {Array.isArray(kategoriList) &&
                  kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama}
                    </option>
                  ))}
              </select>
            </div>

            {/* Item Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Item Keuangan
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                disabled={!itemList}
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">Semua Item</option>
                {Array.isArray(itemList) &&
                  itemList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kode} - {item.nama}
                    </option>
                  ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <Button
                className="flex items-center gap-2"
                disabled={!selectedPeriode}
                onClick={() => router.push("/admin/keuangan/realisasi/create")}
              >
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Target
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatRupiah(summaryData.summary?.totalTargetAmount || 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Realisasi
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatRupiah(
                      summaryData.summary?.totalRealisasiAmount || 0
                    )}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selisih</p>
                  <p
                    className={`text-2xl font-bold ${
                      parseFloat(
                        summaryData.summary?.totalVarianceAmount || 0
                      ) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatRupiah(
                      summaryData.summary?.totalVarianceAmount || 0
                    )}
                  </p>
                </div>
                {parseFloat(summaryData.summary?.totalVarianceAmount || 0) >=
                0 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Target Tercapai
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {summaryData.summary?.itemsTargetAchieved || 0}/
                    {summaryData.summary?.totalItems || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Item Summary Table */}
      {summaryData?.items && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Realisasi per Item</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Kode
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Nama Item
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Target
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Realisasi
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Selisih
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        % Capaian
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                          {item.kode}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.nama}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatRupiah(item.totalTarget)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {formatRupiah(item.totalRealisasiAmount)}
                        </td>
                        <td
                          className={`border border-gray-300 px-4 py-2 text-right ${
                            parseFloat(item.varianceAmount) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatRupiah(item.varianceAmount)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge
                            variant={
                              item.achievementPercentage >= 100
                                ? "success"
                                : "warning"
                            }
                          >
                            {formatPercentage(item.achievementPercentage)}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Badge
                            variant={
                              item.isTargetAchieved ? "success" : "secondary"
                            }
                          >
                            {item.isTargetAchieved ? "Tercapai" : "Belum"}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/admin/keuangan/realisasi/${item.id}`
                              )
                            }
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Realisasi Table */}
      {realisasiData?.realisasi && (
        <Card>
          <CardHeader>
            <CardTitle>Data Realisasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {realisasiLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Item
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Periode
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Total Realisasi
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Tanggal
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Keterangan
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {realisasiData.realisasi.map((realisasi) => (
                      <tr key={realisasi.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            <div className="font-mono text-sm text-gray-500">
                              {realisasi.itemKeuangan.kode}
                            </div>
                            <div className="font-medium">
                              {realisasi.itemKeuangan.nama}
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {realisasi.periode?.nama || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                          {formatRupiah(realisasi.totalRealisasi)}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                          {new Date(
                            realisasi.tanggalRealisasi
                          ).toLocaleDateString("id-ID")}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {realisasi.keterangan || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(
                                  `/admin/keuangan/realisasi/edit/${realisasi.id}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRealisasiToDelete(realisasi)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        description={`Apakah Anda yakin ingin menghapus realisasi untuk item "${realisasiToDelete?.itemKeuangan?.nama}" tanggal ${realisasiToDelete?.tanggalRealisasi ? new Date(realisasiToDelete.tanggalRealisasi).toLocaleDateString("id-ID") : ""}? Tindakan ini tidak dapat dibatalkan.`}
        isLoading={deleteMutation.isPending}
        isOpen={!!realisasiToDelete}
        title="Hapus Realisasi"
        onClose={() => setRealisasiToDelete(null)}
        onConfirm={() => deleteMutation.mutate(realisasiToDelete.id)}
      />
    </div>
  );
}
