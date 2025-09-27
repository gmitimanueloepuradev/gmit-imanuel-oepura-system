import { useState, useEffect } from "react";
import {
  User,
  Home,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Upload,
  Bell,
  FileText,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import OnboardingDialog from "@/components/onboarding/OnboardingDialog";
import api from "@/lib/axios";
import DailyVerse from "@/components/dashboard/DailyVerse";
import DocumentProgressBar from "@/components/ui/DocumentProgressBar";
import DocumentUploadModal from "@/components/modal/DocumentUploadModal";

function JemaatDashboard() {
  const { user, refreshUser } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rejectedDocuments, setRejectedDocuments] = useState([]);

  // Check if user profile is incomplete (no idJemaat)
  const isProfileIncomplete = !user?.idJemaat;

  // Fetch upcoming worship schedules
  const { data: upcomingJadwal } = useQuery({
    queryKey: ["upcoming-jadwal", user?.jemaat?.keluarga?.rayon?.id],
    queryFn: async () => {
      if (!user?.jemaat?.keluarga?.rayon?.id) return [];

      const currentDate = new Date();
      const params = new URLSearchParams({
        rayon: user.jemaat.keluarga.rayon.id,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });

      const response = await api.get(`/jadwal-ibadah?${params}`);
      const schedules = response.data.data || [];

      // Filter upcoming schedules (today and future)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return schedules
        .filter((jadwal) => new Date(jadwal.tanggal) >= today)
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
        .slice(0, 3); // Get next 3 upcoming schedules
    },
    enabled: !!user?.jemaat?.keluarga?.rayon?.id,
  });

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
    if (user?.idJemaat) {
      fetchRejectedDocuments(user.idJemaat);
    }
  };

  const fetchRejectedDocuments = async (jemaatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/dokumen/jemaat/${jemaatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        const rejected = data.data.filter(doc => doc.statusDokumen === 'REJECTED');
        setRejectedDocuments(rejected);
      }
    } catch (error) {
      console.error('Error fetching rejected documents:', error);
    }
  };

  // Fetch rejected documents when user data is available
  useEffect(() => {
    if (user?.idJemaat) {
      fetchRejectedDocuments(user.idJemaat);
    }
  }, [user?.idJemaat, refreshKey]);

  return (
    <ProtectedRoute allowedRoles="JEMAAT">
      {/* Show onboarding dialog if profile is incomplete */}
      {isProfileIncomplete && (
        <OnboardingDialog user={user} onComplete={refreshUser} />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Jemaat
                  </h1>
                  <p className="text-sm text-gray-600">GMIT Imanuel Oepura</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-12 w-12 text-green-600" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selamat datang, {user?.jemaat?.nama || user?.username}!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Anda masuk sebagai Jemaat. Berikut adalah informasi akun
                    Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Anggota Keluarga
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.jemaat?.keluarga?.jemaats?.length || "4"} Orang
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rayon
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.jemaat?.keluarga?.rayon?.namaRayon || "-"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        No. Bangunan
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {user?.jemaat?.keluarga?.noBagungan || "-"}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Jadwal Mendatang
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {upcomingJadwal?.length || 0} Event
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Verse */}
          <div className="mb-6">
            <DailyVerse />
          </div>

          {/* Document Upload Section */}
          {user?.idJemaat && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <DocumentProgressBar key={refreshKey} jemaatId={user.idJemaat} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Dokumen Pribadi</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload dan kelola dokumen baptis, sidi, dan nikah Anda untuk melengkapi data gereja.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Dokumen</span>
                </button>
              </div>
            </div>
          )}

          {/* Rejected Documents Alert */}
          {rejectedDocuments.length > 0 && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Dokumen Ditolak
                    </h3>
                    <p className="text-red-700 mb-4">
                      {rejectedDocuments.length} dokumen Anda telah ditolak dan perlu diperbaiki.
                      Silakan periksa alasan penolakan dan upload ulang dokumen yang benar.
                    </p>
                    <div className="space-y-3">
                      {rejectedDocuments.map((doc) => (
                        <div key={doc.id} className="bg-white border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-red-900">
                              {doc.tipeDokumen === 'BAPTIS' ? 'Surat Baptis' :
                               doc.tipeDokumen === 'SIDI' ? 'Surat Sidi' : 'Surat Nikah'}
                            </h4>
                            <span className="text-xs text-red-600">
                              Ditolak pada {new Date(doc.verifiedAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          {doc.catatan && (
                            <div className="bg-red-100 border border-red-200 rounded p-3 text-sm">
                              <strong className="text-red-800">Alasan Penolakan:</strong>
                              <p className="text-red-700 mt-1">{doc.catatan}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Upload Ulang Dokumen
                      </button>
                      <button
                        onClick={() => setRejectedDocuments([])}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        Tutup Notifikasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Worship Schedules */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Jadwal Ibadah Mendatang
                </h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  onClick={() =>
                    (window.location.href = "/jemaat/jadwal-ibadah")
                  }
                >
                  Lihat Semua
                </button>
              </div>

              {upcomingJadwal && upcomingJadwal.length > 0 ? (
                <div className="space-y-4">
                  {upcomingJadwal.map((jadwal) => (
                    <div
                      key={jadwal.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {jadwal.judul}
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {jadwal.jenisIbadah?.namaIbadah || "Ibadah"}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {jadwal.kategori?.namaKategori || "Umum"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(jadwal.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </div>
                          {jadwal.waktuMulai && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(
                                  `1970-01-01T${jadwal.waktuMulai}`
                                ).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {jadwal.lokasi && (
                        <div className="flex items-center mt-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{jadwal.lokasi}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada jadwal ibadah mendatang</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div
                className="p-5"
                onClick={() => (window.location.href = "/jemaat/jadwal-ibadah")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Jadwal Ibadah
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Lihat jadwal rayon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div
                className="p-5"
                onClick={() => (window.location.href = "/jemaat/keluarga")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Keluarga
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Anggota keluarga
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div
                className="p-5"
                onClick={() => (window.location.href = "/jemaat/profile")}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Profil
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Edit profil
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Document Upload Modal */}
        {user?.idJemaat && (
          <DocumentUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            jemaatId={user.idJemaat}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default JemaatDashboard;
