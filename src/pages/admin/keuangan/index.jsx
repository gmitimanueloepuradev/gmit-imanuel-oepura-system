import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Activity,
  BarChart3,
  Building,
  Calculator,
  Calendar,
  Eye,
  Filter,
  PieChart,
  Settings,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import PageHeader from "@/components/ui/PageHeader";
import PageTitle from "@/components/ui/PageTitle";

export default function KeuanganDashboard() {
  const router = useRouter();
  const [selectedPeriode, setSelectedPeriode] = useState("");

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

  // Query untuk get kategori list
  const { data: kategoriList } = useQuery({
    queryKey: ["kategori-list"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/kategori");

      return response.data.data;
    },
  });

  // Query untuk get item keuangan berdasarkan periode
  const { data: itemData, isLoading } = useQuery({
    queryKey: ["dashboard-item-keuangan", selectedPeriode],
    queryFn: async () => {
      const params = {};

      if (selectedPeriode) params.periodeId = selectedPeriode;

      const response = await axios.get("/api/keuangan/item", { params });

      return response.data.data;
    },
    enabled: !!selectedPeriode,
  });

  // Format rupiah
  const formatRupiah = (amount) => {
    if (!amount || amount === 0) return "Rp 0";

    return `Rp ${parseFloat(amount).toLocaleString("id-ID")}`;
  };

  // Calculate statistics from real data
  const statistics = useMemo(() => {
    if (!itemData || !kategoriList) return null;

    // Debug log untuk melihat struktur data (optional)
    // console.log("itemData structure:", itemData);
    // console.log("kategoriList structure:", kategoriList);

    // Ambil items dari struktur API response yang sebenarnya
    let items = [];

    if (itemData && itemData.items && Array.isArray(itemData.items)) {
      items = itemData.items;
    } else if (Array.isArray(itemData)) {
      items = itemData;
    } else if (itemData && Array.isArray(itemData.data)) {
      items = itemData.data;
    } else if (
      itemData &&
      itemData.data &&
      Array.isArray(itemData.data.items)
    ) {
      items = itemData.data.items;
    }

    // Pastikan kategoriList adalah array atau ambil dari nested property
    let kategoris = [];

    if (Array.isArray(kategoriList)) {
      kategoris = kategoriList;
    } else if (kategoriList && Array.isArray(kategoriList.items)) {
      kategoris = kategoriList.items;
    } else if (kategoriList && Array.isArray(kategoriList.data)) {
      kategoris = kategoriList.data;
    } else if (
      kategoriList &&
      kategoriList.data &&
      Array.isArray(kategoriList.data.items)
    ) {
      kategoris = kategoriList.data.items;
    }

    // console.log("Processed items:", items);
    // console.log("Processed kategoris:", kategoris);

    if (items.length === 0 || kategoris.length === 0) {
      return null;
    }

    // Pisahkan berdasarkan kategori
    const penerimaan = items.filter((item) => {
      const kategori = kategoris.find((k) => k.id === item.kategoriId);

      return kategori?.nama?.toLowerCase().includes("penerimaan");
    });
    const pengeluaran = items.filter((item) => {
      const kategori = kategoris.find((k) => k.id === item.kategoriId);

      return kategori?.nama?.toLowerCase().includes("pengeluaran");
    });

    // Hitung total target dan actual untuk penerimaan
    const totalPenerimaanTarget = penerimaan.reduce(
      (sum, item) => sum + (parseFloat(item.totalTarget) || 0),
      0
    );
    const totalPenerimaanActual = penerimaan.reduce(
      (sum, item) => sum + (parseFloat(item.nominalActual) || 0),
      0
    );

    // Hitung total target dan actual untuk pengeluaran
    const totalPengeluaranTarget = pengeluaran.reduce(
      (sum, item) => sum + (parseFloat(item.totalTarget) || 0),
      0
    );
    const totalPengeluaranActual = pengeluaran.reduce(
      (sum, item) => sum + (parseFloat(item.nominalActual) || 0),
      0
    );

    // Hitung total keseluruhan dari semua item (tanpa melihat kategori)
    const grandTotalTarget = items.reduce(
      (sum, item) => sum + (parseFloat(item.totalTarget) || 0),
      0
    );
    const grandTotalActual = items.reduce(
      (sum, item) => sum + (parseFloat(item.nominalActual) || 0),
      0
    );

    // Saldo dan persentase pencapaian
    const saldoTarget = totalPenerimaanTarget - totalPengeluaranTarget;
    const saldoActual = totalPenerimaanActual - totalPengeluaranActual;
    const achievementPercentage =
      grandTotalTarget > 0 ? (grandTotalActual / grandTotalTarget) * 100 : 0;

    // Group by level untuk analisis hierarchy
    const itemsByLevel = items.reduce((acc, item) => {
      const level = item.level || 1;

      if (!acc[level]) acc[level] = [];
      acc[level].push(item);

      return acc;
    }, {});

    // Calculate max level safely
    const levels = items.map((item) => item.level || 1);
    const maxLevel = levels.length > 0 ? Math.max(...levels) : 0;

    return {
      totalPenerimaanTarget,
      totalPengeluaranTarget,
      totalPenerimaanActual,
      totalPengeluaranActual,
      saldoTarget,
      saldoActual,
      grandTotalTarget,
      grandTotalActual,
      achievementPercentage,
      totalItems: items.length,
      totalPenerimaan: penerimaan.length,
      totalPengeluaran: pengeluaran.length,
      itemsByLevel,
      maxLevel,
    };
  }, [itemData, kategoriList]);

  const selectedPeriodeData = periodeList?.find(
    (p) => p.id === selectedPeriode
  );

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 50) return "text-yellow-600 dark:text-yellow-400";

    return "text-red-600 dark:text-red-400";
  };

  const getBudgetStatus = (actual, target) => {
    if (!target || target === 0) return { status: "no-target", color: "gray" };
    const percentage = (actual / target) * 100;

    if (percentage >= 90) return { status: "excellent", color: "green" };
    if (percentage >= 70) return { status: "good", color: "blue" };
    if (percentage >= 50) return { status: "moderate", color: "yellow" };

    return { status: "poor", color: "red" };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      <PageTitle title="Dashboard Keuangan" />
      <PageHeader
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Dashboard Keuangan" },
        ]}
        description="Dashboard rencana anggaran dan monitoring keuangan GMIT Imanuel Oepura"
        title="Dashboard Keuangan"
      />

      <div className="max-w-7xl mx-auto p-6">
        {/* Period Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Periode Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Periode Anggaran
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                >
                  <option value="">Pilih Periode</option>
                  {periodeList?.map((periode) => (
                    <option key={periode.id} value={periode.id}>
                      {periode.nama} ({periode.tahun})
                    </option>
                  ))}
                </select>
              </div>
              {selectedPeriodeData && (
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedPeriodeData.nama}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(
                        selectedPeriodeData.tanggalMulai
                      ).toLocaleDateString("id-ID")}{" "}
                      -{" "}
                      {new Date(
                        selectedPeriodeData.tanggalAkhir
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!selectedPeriode ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Pilih Periode Anggaran
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Silakan pilih periode anggaran untuk melihat dashboard
                  keuangan yang detail
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Master Data
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Kelola kategori & item keuangan
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Anggaran
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Rencana anggaran per periode
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Monitoring
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Pantau realisasi anggaran
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Financial Overview Stats */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Grand Total - Card Utama */}
                <Card className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Grand Total Anggaran
                    </CardTitle>
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                      {formatRupiah(statistics.grandTotalTarget)}
                    </div>
                    <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-2">
                      <span className="mr-1">
                        Actual: {formatRupiah(statistics.grandTotalActual)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {statistics.totalItems} item anggaran
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Target Penerimaan
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(statistics.totalPenerimaanTarget)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400 mr-1">
                        Actual: {formatRupiah(statistics.totalPenerimaanActual)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Target Pengeluaran
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(statistics.totalPengeluaranTarget)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="text-red-600 dark:text-red-400 mr-1">
                        Actual:{" "}
                        {formatRupiah(statistics.totalPengeluaranActual)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Proyeksi Saldo
                    </CardTitle>
                    <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatRupiah(statistics.saldoTarget)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span
                        className={`mr-1 ${
                          statistics.saldoActual >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Actual: {formatRupiah(statistics.saldoActual)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pencapaian Target
                    </CardTitle>
                    <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {statistics.achievementPercentage.toFixed(1)}%
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span
                        className={`mr-1 ${getPercentageColor(statistics.achievementPercentage)}`}
                      >
                        dari total target
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Budget Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Komposisi Anggaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              Penerimaan
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {statistics.totalPenerimaan} item
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600 dark:text-green-400">
                            {formatRupiah(statistics.totalPenerimaanTarget)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Target
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              Pengeluaran
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {statistics.totalPengeluaran} item
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600 dark:text-red-400">
                            {formatRupiah(statistics.totalPengeluaranTarget)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Target
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hierarchy Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Analisis Hierarki
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics && (
                    <div className="space-y-3">
                      {Object.entries(statistics.itemsByLevel).map(
                        ([level, items]) => (
                          <div
                            key={level}
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                  level === "1"
                                    ? "bg-blue-500"
                                    : level === "2"
                                      ? "bg-green-500"
                                      : level === "3"
                                        ? "bg-yellow-500"
                                        : "bg-purple-500"
                                }`}
                              >
                                L{level}
                              </div>
                              <div className="ml-3">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Level {level}
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {items.length} item
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatRupiah(
                                  items.reduce(
                                    (sum, item) =>
                                      sum +
                                      (parseFloat(item.nominalTarget) || 0),
                                    0
                                  )
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Total Target
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detail Item Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Detail Item Anggaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itemData &&
                    itemData.items &&
                    itemData.items.length > 0 &&
                    itemData.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                              item.level === 1
                                ? "bg-blue-500"
                                : item.level === 2
                                  ? "bg-green-500"
                                  : item.level === 3
                                    ? "bg-yellow-500"
                                    : "bg-purple-500"
                            }`}
                          >
                            {item.kode}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.nama}
                            </h4>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>Level {item.level}</span>
                              <span>•</span>
                              <span>{item.kategori?.nama || "Unknown"}</span>
                              {item.parent && (
                                <>
                                  <span>•</span>
                                  <span>Parent: {item.parent.nama}</span>
                                </>
                              )}
                            </div>
                            {item.deskripsi && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {item.deskripsi}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">
                            {formatRupiah(item.totalTarget)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Target
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            Actual: {formatRupiah(item.nominalActual)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.targetFrekuensi} {item.satuanFrekuensi} ×{" "}
                            {formatRupiah(item.nominalSatuan)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Status & Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Status Periode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Item Anggaran:
                      </span>
                      <Badge variant="outline">
                        {statistics?.totalItems || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status Periode:
                      </span>
                      <Badge
                        variant={
                          selectedPeriodeData?.status === "AKTIF"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {selectedPeriodeData?.status || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Max Level Hierarki:
                      </span>
                      <Badge variant="outline">
                        Level {statistics?.maxLevel || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Target Achievement:
                      </span>
                      <Badge
                        variant={
                          statistics?.achievementPercentage >= 80
                            ? "success"
                            : statistics?.achievementPercentage >= 50
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {statistics?.achievementPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Management Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Kelola Data Keuangan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/admin/keuangan/item?periodeId=${selectedPeriode}`
                        )
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail Item Periode Ini
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() =>
                        router.push("/admin/data-master/keuangan/kategori")
                      }
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Kelola Kategori Keuangan
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() =>
                        router.push("/admin/data-master/keuangan/periode")
                      }
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Kelola Periode Anggaran
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

KeuanganDashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
