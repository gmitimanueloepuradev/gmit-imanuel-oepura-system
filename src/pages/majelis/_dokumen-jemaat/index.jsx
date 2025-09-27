import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Home,
  MessageSquare,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageTitle from "@/components/ui/PageTitle";
import { useAuth } from "@/contexts/AuthContext";

const DokumenJemaatMajelis = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [rayonData, setRayonData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    document: null,
  });
  const [rejectNote, setRejectNote] = useState("");

  const documentTypeLabels = {
    BAPTIS: "Surat Baptis",
    SIDI: "Surat Sidi",
    NIKAH: "Surat Nikah",
  };

  const statusConfig = {
    PENDING: {
      label: "Menunggu Verifikasi",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    APPROVED: {
      label: "Disetujui",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Ditolak",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem("token");
      const response = await fetch("/api/dokumen/majelis/rayon", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRayonData(data.data.rayon);
        setDocuments(data.data.dokumen);
      } else {
        setError(data.message || "Gagal mengambil data dokumen");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (dokumenId, status, catatan = "") => {
    try {
      setVerifyingId(dokumenId);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/dokumen/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dokumenId,
          status,
          catatan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchDocuments(); // Refresh the list
        if (status === "REJECTED") {
          setRejectModal({ isOpen: false, document: null });
          setRejectNote("");
        }
      } else {
        setError(data.message || "Gagal verifikasi dokumen");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat verifikasi dokumen");
    } finally {
      setVerifyingId(null);
    }
  };

  const openRejectModal = (document) => {
    setRejectModal({ isOpen: true, document });
    setRejectNote("");
  };

  const confirmReject = () => {
    if (!rejectNote.trim()) {
      alert("Harap masukkan alasan penolakan");

      return;
    }
    handleVerification(rejectModal.document.id, "REJECTED", rejectNote);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatistics = () => {
    const total = documents.length;
    const pending = documents.filter(
      (doc) => doc.statusDokumen === "PENDING"
    ).length;
    const approved = documents.filter(
      (doc) => doc.statusDokumen === "APPROVED"
    ).length;
    const rejected = documents.filter(
      (doc) => doc.statusDokumen === "REJECTED"
    ).length;

    return { total, pending, approved, rejected };
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles="MAJELIS">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </ProtectedRoute>
    );
  }

  const stats = getStatistics();

  return (
    <ProtectedRoute allowedRoles="MAJELIS">
      <PageTitle title="Verifikasi Dokumen Jemaat" />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verifikasi Dokumen Jemaat
          </h1>
          <div className="flex items-center text-gray-600">
            <Home className="w-4 h-4 mr-2" />
            <span>Rayon: {rayonData?.namaRayon || "Tidak ada rayon"}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Dokumen
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disetujui</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ditolak</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
              onClick={fetchDocuments}
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Dokumen Jemaat di Rayon {rayonData?.namaRayon}</span>
            </h2>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">
                Belum ada dokumen dari jemaat di rayon ini
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => {
                const status = statusConfig[doc.statusDokumen];
                const StatusIcon = status.icon;

                return (
                  <div key={doc.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {documentTypeLabels[doc.tipeDokumen]}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {doc.namaFile}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>
                            Jemaat: <strong>{doc.jemaat.nama}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            No. Bangunan: {doc.jemaat.keluarga.noBagungan}
                          </span>
                          <span>•</span>
                          <span>Upload: {formatDate(doc.createdAt)}</span>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}
                          >
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {status.label}
                          </span>
                        </div>

                        {doc.catatan && (
                          <div className="p-3 bg-gray-100 rounded-lg text-sm mb-3">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong>Catatan:</strong> {doc.catatan}
                              </div>
                            </div>
                          </div>
                        )}

                        {doc.verifiedAt && (
                          <p className="text-xs text-gray-500">
                            Diverifikasi pada: {formatDate(doc.verifiedAt)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat dokumen"
                          onClick={() => window.open(doc.urlFile, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <a
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          download={doc.namaFile}
                          href={doc.urlFile}
                          title="Download dokumen"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {doc.statusDokumen === "PENDING" && (
                          <>
                            <button
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                              disabled={verifyingId === doc.id}
                              onClick={() =>
                                handleVerification(doc.id, "APPROVED")
                              }
                            >
                              {verifyingId === doc.id
                                ? "Memproses..."
                                : "Setujui"}
                            </button>
                            <button
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 transition-colors"
                              disabled={verifyingId === doc.id}
                              onClick={() => openRejectModal(doc)}
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reject Modal */}
        {rejectModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tolak Dokumen
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Dokumen:{" "}
                  <strong>
                    {documentTypeLabels[rejectModal.document?.tipeDokumen]}
                  </strong>
                  <br />
                  Jemaat: <strong>{rejectModal.document?.jemaat.nama}</strong>
                </p>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan alasan penolakan..."
                  rows={4}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() =>
                    setRejectModal({ isOpen: false, document: null })
                  }
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  onClick={confirmReject}
                >
                  Tolak Dokumen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DokumenJemaatMajelis;
