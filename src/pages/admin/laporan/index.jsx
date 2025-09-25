import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Heart,
  Baby,
  GraduationCap,
  Building2,
  MapPin,
  FileText,
  Table,
} from "lucide-react";

import statisticsService from "@/services/statisticsService";
import { showToast } from "@/utils/showToast";

export default function LaporanPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Queries
  const { data: overview, isLoading: overviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["statistics-overview"],
    queryFn: () => statisticsService.getOverview(),
  });

  const { data: growth, isLoading: growthLoading } = useQuery({
    queryKey: ["statistics-growth", selectedPeriod, selectedYear],
    queryFn: () => statisticsService.getGrowth({ 
      period: selectedPeriod, 
      year: selectedYear 
    }),
  });

  const { data: demographics, isLoading: demographicsLoading } = useQuery({
    queryKey: ["statistics-demographics"],
    queryFn: () => statisticsService.getDemographics(),
  });

  const overviewData = overview?.data;
  const growthData = growth?.data;
  const demographicsData = demographics?.data;

  const StatCard = ({ title, value, subtitle, icon: Icon, color, change }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color} mr-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-green-500 dark:text-green-400 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-400">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Ringkasan", icon: Eye },
    { id: "growth", label: "Pertumbuhan", icon: TrendingUp },
    { id: "demographics", label: "Demografi", icon: Users },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Handle export functionality
  const handleExport = async (format = 'pdf', type = null) => {
    setIsExporting(true);

    try {
      const exportType = type || activeTab;

      // Try API export first
      try {
        await statisticsService.exportReport({
          format,
          type: exportType,
          period: selectedPeriod,
          year: selectedYear,
          includeCharts: true
        });

        showToast({
          title: "Berhasil",
          description: `Laporan ${exportType} berhasil diunduh`,
          color: "success",
        });
      } catch (apiError) {
        console.log('API export failed, using fallback:', apiError);

        // Fallback: Generate and download report data
        const reportData = await statisticsService.generateReportData(exportType);

        // Create CSV format as fallback
        if (format === 'csv' || format === 'excel') {
          downloadCSVReport(reportData.data, exportType);
        } else {
          // For PDF, show a message that it's not available
          showToast({
            title: "Info",
            description: "Export PDF tidak tersedia saat ini. Data akan diunduh dalam format CSV.",
            color: "warning",
          });
          downloadCSVReport(reportData.data, exportType);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast({
        title: "Gagal",
        description: "Gagal mengekspor laporan. Silakan coba lagi.",
        color: "error",
      });
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  // Fallback CSV download function
  const downloadCSVReport = (data, type) => {
    let csvContent = "";
    const timestamp = new Date().toISOString().split('T')[0];

    if (type === 'overview' && data.overview) {
      csvContent = generateOverviewCSV(data.overview);
    } else if (type === 'demographics' && data.demographics) {
      csvContent = generateDemographicsCSV(data.demographics);
    } else if (type === 'growth' && data.growth) {
      csvContent = generateGrowthCSV(data.growth);
    } else if (type === 'all') {
      csvContent = generateFullReportCSV(data);
    }

    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-${type}-${timestamp}.csv`;
    link.click();
  };

  // CSV generation functions
  const generateOverviewCSV = (data) => {
    let csv = "LAPORAN RINGKASAN JEMAAT\n\n";
    csv += "Statistik Utama\n";
    csv += "Total Jemaat," + (data?.totalMembers || 0) + "\n";
    csv += "Total Keluarga," + (data?.totalFamilies || 0) + "\n";
    csv += "Laki-laki," + (data?.membersByGender?.male || 0) + "\n";
    csv += "Perempuan," + (data?.membersByGender?.female || 0) + "\n\n";

    csv += "Sakramen\n";
    csv += "Baptis (Total)," + (data?.sacraments?.baptis?.total || 0) + "\n";
    csv += "Baptis (Tahun Ini)," + (data?.sacraments?.baptis?.thisYear || 0) + "\n";
    csv += "Sidi (Total)," + (data?.sacraments?.sidi?.total || 0) + "\n";
    csv += "Sidi (Tahun Ini)," + (data?.sacraments?.sidi?.thisYear || 0) + "\n";
    csv += "Pernikahan (Total)," + (data?.sacraments?.pernikahan?.total || 0) + "\n";
    csv += "Pernikahan (Tahun Ini)," + (data?.sacraments?.pernikahan?.thisYear || 0) + "\n\n";

    if (data?.rayonDistribution) {
      csv += "Distribusi per Rayon\n";
      csv += "Rayon,Keluarga,Jemaat\n";
      data.rayonDistribution.forEach(rayon => {
        csv += `"${rayon.rayon}",${rayon.families},${rayon.members}\n`;
      });
    }

    return csv;
  };

  const generateDemographicsCSV = (data) => {
    let csv = "LAPORAN DEMOGRAFI JEMAAT\n\n";
    csv += "Ringkasan\n";
    csv += "Total Anggota," + (data?.summary?.totalMembers || 0) + "\n";
    csv += "Total Keluarga," + (data?.summary?.totalFamilies || 0) + "\n";
    csv += "Rata-rata Umur," + (data?.summary?.averageAge || 0) + " tahun\n\n";

    if (data?.education) {
      csv += "Distribusi Pendidikan\n";
      csv += "Tingkat Pendidikan,Jumlah,Persentase\n";
      data.education.forEach(item => {
        csv += `"${item.label}",${item.count},${item.percentage}%\n`;
      });
      csv += "\n";
    }

    if (data?.jobs) {
      csv += "Pekerjaan Teratas\n";
      csv += "Pekerjaan,Jumlah,Persentase\n";
      data.jobs.slice(0, 10).forEach(item => {
        csv += `"${item.label}",${item.count},${item.percentage}%\n`;
      });
    }

    return csv;
  };

  const generateGrowthCSV = (data) => {
    let csv = "LAPORAN PERTUMBUHAN JEMAAT\n\n";
    csv += "Ringkasan\n";
    csv += "Anggota Baru," + (data?.summary?.totalNewMembers || 0) + "\n";
    csv += "Rata-rata Pertumbuhan," + (data?.summary?.averageGrowth || 0) + "\n\n";

    if (data?.sacramentTrends) {
      csv += "Tren Sakramen\n";
      csv += "Periode,Baptis,Sidi,Pernikahan,Total\n";
      data.sacramentTrends.forEach(trend => {
        const total = trend.baptis + trend.sidi + trend.pernikahan;
        csv += `"${trend.period}",${trend.baptis},${trend.sidi},${trend.pernikahan},${total}\n`;
      });
    }

    return csv;
  };

  const generateFullReportCSV = (data) => {
    let csv = "LAPORAN LENGKAP GMIT IMANUEL OEPURA\n\n";

    if (data.overview) {
      csv += generateOverviewCSV(data.overview) + "\n\n";
    }

    if (data.demographics) {
      csv += generateDemographicsCSV(data.demographics) + "\n\n";
    }

    if (data.growth) {
      csv += generateGrowthCSV(data.growth);
    }

    return csv;
  };

  // Export Modal Component
  const ExportModal = () => {
    if (!showExportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Export Laporan
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Format:
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <FileText className="w-5 h-5 mr-3 text-red-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">PDF Document</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cocok untuk cetak dan arsip</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Table className="w-5 h-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">CSV File</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cocok untuk analisis data</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Data:
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleExport('csv', activeTab)}
                  disabled={isExporting}
                  className="w-full p-2 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Tab Saat Ini ({activeTab === 'overview' ? 'Ringkasan' : activeTab === 'growth' ? 'Pertumbuhan' : 'Demografi'})
                </button>
                <button
                  onClick={() => handleExport('csv', 'all')}
                  disabled={isExporting}
                  className="w-full p-2 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Semua Data Lengkap
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowExportModal(false)}
              disabled={isExporting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-2 px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                Laporan & Statistik
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Dashboard statistik dan laporan komprehensif GMIT Imanuel Oepura
              </p>
            </div>
            <div className="mt-4 flex space-x-3 lg:mt-0 lg:ml-4">
              <button
                onClick={() => {
                  refetchOverview();
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-50 dark:hover:bg-gray-600 h-9 px-4 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Perbarui
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-50 dark:hover:bg-gray-600 h-9 px-4 py-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Mengekspor...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-600">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-2">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {overviewLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Main Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Jemaat"
                    value={overviewData?.totalMembers?.toLocaleString() || "0"}
                    subtitle="Anggota terdaftar"
                    icon={Users}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Keluarga"
                    value={overviewData?.totalFamilies?.toLocaleString() || "0"}
                    subtitle="Kepala keluarga"
                    icon={Building2}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Laki-laki"
                    value={overviewData?.membersByGender?.male?.toLocaleString() || "0"}
                    subtitle={`${Math.round(((overviewData?.membersByGender?.male || 0) / (overviewData?.totalMembers || 1)) * 100)}% dari total`}
                    icon={Users}
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Perempuan"
                    value={overviewData?.membersByGender?.female?.toLocaleString() || "0"}
                    subtitle={`${Math.round(((overviewData?.membersByGender?.female || 0) / (overviewData?.totalMembers || 1)) * 100)}% dari total`}
                    icon={Users}
                    color="bg-pink-500"
                  />
                </div>

                {/* Sacraments Statistics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Statistik Sakramen
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-300">
                      <div className="flex items-center justify-center mb-2">
                        <Baby className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {overviewData?.sacraments?.baptis?.total || 0}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Total Baptis</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {overviewData?.sacraments?.baptis?.thisYear || 0} tahun ini
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors duration-300">
                      <div className="flex items-center justify-center mb-2">
                        <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-xl font-bold text-green-700 dark:text-green-300">
                        {overviewData?.sacraments?.sidi?.total || 0}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Total Sidi</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {overviewData?.sacraments?.sidi?.thisYear || 0} tahun ini
                      </p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg transition-colors duration-300">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                      </div>
                      <h4 className="text-xl font-bold text-pink-700 dark:text-pink-300">
                        {overviewData?.sacraments?.pernikahan?.total || 0}
                      </h4>
                      <p className="text-sm text-pink-600 dark:text-pink-400">Total Pernikahan</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {overviewData?.sacraments?.pernikahan?.thisYear || 0} tahun ini
                      </p>
                    </div>
                  </div>
                </div>

                {/* Age Groups */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Distribusi Kelompok Umur
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors duration-300">
                      <h4 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {overviewData?.ageGroups?.children || 0}
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Anak-anak (0-12)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors duration-300">
                      <h4 className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {overviewData?.ageGroups?.youth || 0}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Remaja (13-25)</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors duration-300">
                      <h4 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {overviewData?.ageGroups?.adults || 0}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Dewasa (26-59)</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors duration-300">
                      <h4 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                        {overviewData?.ageGroups?.elderly || 0}
                      </h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Lansia (60+)</p>
                    </div>
                  </div>
                </div>

                {/* Rayon Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Distribusi per Rayon
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Rayon</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Keluarga</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Jemaat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overviewData?.rayonDistribution?.map((rayon, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{rayon.rayon}</td>
                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300 text-right">{rayon.families}</td>
                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300 text-right">{rayon.members}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "growth" && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Periode:</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tahun:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {growthLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-1/3"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Anggota Baru"
                    value={growthData?.summary?.totalNewMembers?.toString() || "0"}
                    subtitle={`Periode ${selectedPeriod === 'monthly' ? 'tahun' : '5 tahun'} terakhir`}
                    icon={Users}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Rata-rata Pertumbuhan"
                    value={growthData?.summary?.averageGrowth?.toString() || "0"}
                    subtitle={`Per ${selectedPeriod === 'monthly' ? 'bulan' : 'tahun'}`}
                    icon={TrendingUp}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Sakramen"
                    value={((growthData?.summary?.totalSacraments?.baptis || 0) + 
                            (growthData?.summary?.totalSacraments?.sidi || 0) + 
                            (growthData?.summary?.totalSacraments?.pernikahan || 0)).toString()}
                    subtitle="Baptis, Sidi, Pernikahan"
                    icon={Calendar}
                    color="bg-purple-500"
                  />
                </div>

                {/* Growth Chart Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Grafik Pertumbuhan Anggota ({selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'})
                  </h3>
                  <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">Grafik akan ditampilkan di sini</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Data: {growthData?.memberGrowth?.length || 0} periode
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sacrament Trends */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tren Sakramen ({selectedPeriod === 'monthly' ? 'Bulanan' : 'Tahunan'})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Periode</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Baptis</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Sidi</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Pernikahan</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {growthData?.sacramentTrends?.map((trend, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{trend.period}</td>
                            <td className="py-3 text-sm text-center text-blue-600 dark:text-blue-400">{trend.baptis}</td>
                            <td className="py-3 text-sm text-center text-green-600 dark:text-green-400">{trend.sidi}</td>
                            <td className="py-3 text-sm text-center text-pink-600 dark:text-pink-400">{trend.pernikahan}</td>
                            <td className="py-3 text-sm text-center font-medium text-gray-900 dark:text-white">
                              {trend.baptis + trend.sidi + trend.pernikahan}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "demographics" && (
          <div className="space-y-6">
            {demographicsLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-1/3"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Anggota"
                    value={demographicsData?.summary?.totalMembers?.toLocaleString() || "0"}
                    subtitle="Jemaat terdaftar"
                    icon={Users}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Total Keluarga"
                    value={demographicsData?.summary?.totalFamilies?.toLocaleString() || "0"}
                    subtitle="Kepala keluarga"
                    icon={Building2}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Rata-rata Umur"
                    value={`${demographicsData?.summary?.averageAge || 0} tahun`}
                    subtitle="Seluruh jemaat"
                    icon={Calendar}
                    color="bg-purple-500"
                  />
                </div>

                {/* Age Distribution Detail */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Distribusi Umur Detail
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-600">
                          <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Kelompok Umur</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Laki-laki</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Perempuan</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demographicsData?.ageDistribution && Object.entries(demographicsData.ageDistribution).map(([ageGroup, data]) => (
                          <tr key={ageGroup} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{ageGroup} tahun</td>
                            <td className="py-3 text-sm text-center text-blue-600 dark:text-blue-400">{data.male}</td>
                            <td className="py-3 text-sm text-center text-pink-600 dark:text-pink-400">{data.female}</td>
                            <td className="py-3 text-sm text-center font-medium text-gray-900 dark:text-white">{data.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Education Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Distribusi Pendidikan
                  </h3>
                  <div className="space-y-3">
                    {demographicsData?.education?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item.count} orang</span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full transition-colors duration-300">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Jobs */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Pekerjaan Teratas
                  </h3>
                  <div className="space-y-3">
                    {demographicsData?.jobs?.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item.count} orang</span>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full transition-colors duration-300">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal />
    </div>
  );
}