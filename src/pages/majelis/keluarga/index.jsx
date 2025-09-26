import { Button } from "@/components/ui/Button";
import ButtonActions from "@/components/ui/ButtonActions";
import { Card, CardContent } from "@/components/ui/Card";
import PageTitle from "@/components/ui/PageTitle";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import keluargaService from "@/services/keluargaService";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Eye,
  Home,
  MapPin,
  Search,
  Users,
  Plus,
  UserPlus
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";

// Page Header Component
function PageHeader({ title, description, breadcrumb, onAdd }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        {breadcrumb && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {breadcrumb.map((item, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex space-x-3 lg:mt-0 lg:ml-4">
            <Button onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Keluarga
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="h-5 w-5 bg-gray-300 rounded mr-2"></div>
                <div className="h-5 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-6 bg-gray-300 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
              <div className="h-8 w-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function MajelisKeluargaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch keluarga data from API - only for majelis's rayon
  const {
    data: keluargaData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["keluarga-majelis", pagination, searchTerm, user?.majelis?.idRayon],
    queryFn: () =>
      keluargaService.getAll({
        ...pagination,
        search: searchTerm,
        idRayon: user?.majelis?.idRayon // Filter by majelis's rayon
      }),
    keepPreviousData: true,
    enabled: !!user?.majelis?.idRayon, // Only fetch if majelis has rayon
  });

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const actions = [
    {
      icon: Eye,
      label: "Detail",
      onClick: (item) => router.push(`/majelis/keluarga/${item.id}`),
      variant: "outline",
    },
    {
      icon: UserPlus,
      label: "Tambah Jemaat",
      onClick: (item) => router.push(`/majelis/jemaat/create?keluargaId=${item.id}`),
      variant: "default",
    },
  ];

  const items = keluargaData?.data?.items || [];
  const paginationInfo = keluargaData?.data?.pagination || {};

  return (
    <ProtectedRoute allowedRoles="MAJELIS">
      <PageTitle
        title="Data Keluarga"
        description={`Kelola data keluarga di ${user?.majelis?.rayon?.namaRayon || 'rayon Anda'} - GMIT Imanuel Oepura`}
      />

      <div className="space-y-6 p-4">
        {/* Page Header */}
        <PageHeader
          title="Data Keluarga"
          description={`Kelola data keluarga di ${user?.majelis?.rayon?.namaRayon || 'rayon Anda'}`}
          breadcrumb={[
            { label: "Majelis", href: "/majelis" },
            { label: "Data Keluarga" },
          ]}
          onAdd={() => router.push("/majelis/keluarga/create")}
        />

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 items-center flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Cari kepala keluarga atau alamat..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <TableSkeleton />
          ) : items.length > 0 ? (
            items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center mb-3">
                        <Home className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          Bangunan {item.noBagungan}
                        </h3>
                        <span className="ml-2 text-sm text-gray-500">
                          • {item.rayon?.namaRayon}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Kepala Keluarga
                          </label>
                          <p className="text-sm text-gray-900">
                            {item.jemaats?.[0]?.nama || "-"}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Total Jemaat
                          </label>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {item.totalJemaat || item.jemaats?.length || 0}{" "}
                              orang
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Alamat
                          </label>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5" />
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {typeof item.alamat === "string"
                                ? item.alamat
                                : item.alamat
                                  ? `${item.alamat.jalan || ""} RT ${item.alamat.rt || ""} RW ${item.alamat.rw || ""}, ${item.alamat.kelurahan?.nama || ""}`
                                  : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activities */}
                      {item.recentIbadah && item.recentIbadah.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <label className="text-sm font-medium text-gray-500 block mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Ibadah Terakhir
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {item.recentIbadah.slice(0, 2).map((ibadah) => (
                              <span
                                key={ibadah.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {ibadah.judul}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="ml-6">
                      <ButtonActions
                        actions={actions}
                        item={item}
                        type="horizontal"
                        maxVisible={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Tidak ada data keluarga
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Belum ada data keluarga yang tersedia.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && paginationInfo.totalPages > 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan{" "}
                  {(paginationInfo.page - 1) * paginationInfo.limit + 1} hingga{" "}
                  {Math.min(
                    paginationInfo.page * paginationInfo.limit,
                    paginationInfo.total
                  )}{" "}
                  dari {paginationInfo.total} data
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(paginationInfo.page - 1)}
                    disabled={!paginationInfo.hasPrev}
                  >
                    Sebelumnya
                  </Button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: paginationInfo.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === paginationInfo.totalPages ||
                        Math.abs(page - paginationInfo.page) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-1 text-gray-500">...</span>
                        )}
                        <Button
                          variant={
                            paginationInfo.page === page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(paginationInfo.page + 1)}
                    disabled={!paginationInfo.hasNext}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
