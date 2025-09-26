import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import masterService from '@/services/masterService';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const JemaatFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch master data for filter options
  const { data: sukuData } = useQuery({
    queryKey: ['suku'],
    queryFn: () => masterService.getSuku(),
  });

  const { data: pendidikanData } = useQuery({
    queryKey: ['pendidikan'],
    queryFn: () => masterService.getPendidikan(),
  });

  const { data: pekerjaanData } = useQuery({
    queryKey: ['pekerjaan'],
    queryFn: () => masterService.getPekerjaan(),
  });

  const { data: pendapatanData } = useQuery({
    queryKey: ['pendapatan'],
    queryFn: () => masterService.getPendapatan(),
  });

  const { data: jaminanKesehatanData } = useQuery({
    queryKey: ['jaminan-kesehatan'],
    queryFn: () => masterService.getJaminanKesehatan(),
  });

  const { data: statusDalamKeluargaData } = useQuery({
    queryKey: ['status-dalam-keluarga'],
    queryFn: () => masterService.getStatusDalamKeluarga(),
  });

  const { data: rayonData } = useQuery({
    queryKey: ['rayon'],
    queryFn: () => masterService.getRayon(),
  });

  const { data: statusKeluargaData } = useQuery({
    queryKey: ['status-keluarga'],
    queryFn: () => masterService.getStatusKeluarga(),
  });

  const { data: keadaanRumahData } = useQuery({
    queryKey: ['keadaan-rumah'],
    queryFn: () => masterService.getKeadaanRumah(),
  });

  const { data: statusKepemilikanRumahData } = useQuery({
    queryKey: ['status-kepemilikan-rumah'],
    queryFn: () => masterService.getStatusKepemilikanRumah(),
  });

  const { data: kelurahanData } = useQuery({
    queryKey: ['kelurahan'],
    queryFn: () => masterService.getKelurahan(),
  });

  // Transform data for options - handle new API response structure
  const sukuOptions = sukuData?.data?.map(item => ({
    value: item.id,
    label: item.namaSuku
  })) || [];

  const pendidikanOptions = pendidikanData?.data?.items?.map(item => ({
    value: item.id,
    label: item.jenjang
  })) || [];

  const pekerjaanOptions = pekerjaanData?.data?.items?.map(item => ({
    value: item.id,
    label: item.namaPekerjaan
  })) || [];

  const pendapatanOptions = pendapatanData?.data?.items?.map(item => ({
    value: item.id,
    label: item.label
  })) || [];

  const jaminanKesehatanOptions = jaminanKesehatanData?.data?.items?.map(item => ({
    value: item.id,
    label: item.jenisJaminan
  })) || [];

  const statusDalamKeluargaOptions = statusDalamKeluargaData?.data?.items?.map(item => ({
    value: item.id,
    label: item.status
  })) || [];

  const rayonOptions = rayonData?.data?.items?.map(item => ({
    value: item.id,
    label: item.namaRayon
  })) || [];

  const statusKeluargaOptions = statusKeluargaData?.data?.items?.map(item => ({
    value: item.id,
    label: item.status
  })) || [];

  const keadaanRumahOptions = keadaanRumahData?.data?.items?.map(item => ({
    value: item.id,
    label: item.keadaan
  })) || [];

  const statusKepemilikanRumahOptions = statusKepemilikanRumahData?.data?.items?.map(item => ({
    value: item.id,
    label: item.status
  })) || [];

  const kelurahanOptions = kelurahanData?.data?.items?.map(item => ({
    value: item.id,
    label: `${item.nama} - ${item.kodepos}`
  })) || [];

  // Static options
  const jenisKelaminOptions = [
    { value: 'true', label: 'Laki-laki' },
    { value: 'false', label: 'Perempuan' }
  ];

  const statusJemaatOptions = [
    { value: 'AKTIF', label: 'Aktif' },
    { value: 'TIDAK_AKTIF', label: 'Tidak Aktif' },
    { value: 'KELUAR', label: 'Keluar' }
  ];

  const golonganDarahOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'AB', label: 'AB' },
    { value: 'O', label: 'O' }
  ];

  const hasUserAccountOptions = [
    { value: 'true', label: 'Memiliki Akun' },
    { value: 'false', label: 'Tidak Ada Akun' }
  ];

  const userRoleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'JEMAAT', label: 'Jemaat' },
    { value: 'MAJELIS', label: 'Majelis' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'PENDETA', label: 'Pendeta' }
  ];

  // Update active filters count
  useEffect(() => {
    const count = Object.values(filters).filter(value =>
      value && value !== '' && value !== 'all'
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' || value === '' ? undefined : value
    };

    // Remove undefined values
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] === undefined) {
        delete newFilters[key];
      }
    });

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  // Filter sections configuration
  const filterSections = [
    {
      title: 'Data Pribadi',
      filters: [
        {
          key: 'jenisKelamin',
          label: 'Jenis Kelamin',
          options: jenisKelaminOptions,
          type: 'select'
        },
        {
          key: 'status',
          label: 'Status Jemaat',
          options: statusJemaatOptions,
          type: 'select'
        },
        {
          key: 'golonganDarah',
          label: 'Golongan Darah',
          options: golonganDarahOptions,
          type: 'select'
        },
        {
          key: 'ageMin',
          label: 'Umur Minimal',
          type: 'number',
          placeholder: 'Contoh: 18'
        },
        {
          key: 'ageMax',
          label: 'Umur Maksimal',
          type: 'number',
          placeholder: 'Contoh: 65'
        }
      ]
    },
    {
      title: 'Data Keluarga & Status',
      filters: [
        {
          key: 'idStatusDalamKeluarga',
          label: 'Status Dalam Keluarga',
          options: statusDalamKeluargaOptions,
          type: 'select'
        },
        {
          key: 'idRayon',
          label: 'Rayon',
          options: rayonOptions,
          type: 'select'
        },
        {
          key: 'idStatusKeluarga',
          label: 'Status Keluarga',
          options: statusKeluargaOptions,
          type: 'select'
        },
        {
          key: 'idKeadaanRumah',
          label: 'Keadaan Rumah',
          options: keadaanRumahOptions,
          type: 'select'
        },
        {
          key: 'idStatusKepemilikanRumah',
          label: 'Status Kepemilikan Rumah',
          options: statusKepemilikanRumahOptions,
          type: 'select'
        }
      ]
    },
    {
      title: 'Pendidikan & Pekerjaan',
      filters: [
        {
          key: 'idSuku',
          label: 'Suku',
          options: sukuOptions,
          type: 'select'
        },
        {
          key: 'idPendidikan',
          label: 'Pendidikan',
          options: pendidikanOptions,
          type: 'select'
        },
        {
          key: 'idPekerjaan',
          label: 'Pekerjaan',
          options: pekerjaanOptions,
          type: 'select'
        },
        {
          key: 'idPendapatan',
          label: 'Pendapatan',
          options: pendapatanOptions,
          type: 'select'
        },
        {
          key: 'idJaminanKesehatan',
          label: 'Jaminan Kesehatan',
          options: jaminanKesehatanOptions,
          type: 'select'
        }
      ]
    },
    {
      title: 'Alamat',
      filters: [
        {
          key: 'idKelurahan',
          label: 'Kelurahan',
          options: kelurahanOptions,
          type: 'select'
        },
        {
          key: 'rt',
          label: 'RT',
          type: 'number',
          placeholder: 'Contoh: 001'
        },
        {
          key: 'rw',
          label: 'RW',
          type: 'number',
          placeholder: 'Contoh: 001'
        }
      ]
    },
    {
      title: 'Akun User',
      filters: [
        {
          key: 'hasUserAccount',
          label: 'Status Akun',
          options: hasUserAccountOptions,
          type: 'select'
        },
        {
          key: 'userRole',
          label: 'Role User',
          options: userRoleOptions,
          type: 'select'
        }
      ]
    }
  ];

  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            value={filters[filter.key] || 'all'}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          >
            <option value="all">Semua {filter.label}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            placeholder={filter.placeholder}
            value={filters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            placeholder={filter.placeholder}
            value={filters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Filter Jemaat
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {activeFiltersCount} aktif
                </span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Tutup
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Tampilkan Filter
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Filters (always visible) - Full width layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jenis Kelamin
            </label>
            {renderFilterInput({ key: 'jenisKelamin', type: 'select', options: jenisKelaminOptions })}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Akun
            </label>
            {renderFilterInput({ key: 'hasUserAccount', type: 'select', options: hasUserAccountOptions })}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rayon
            </label>
            {renderFilterInput({ key: 'idRayon', type: 'select', options: rayonOptions })}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Keluarga
            </label>
            {renderFilterInput({ key: 'idStatusDalamKeluarga', type: 'select', options: statusDalamKeluargaOptions })}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Suku
            </label>
            {renderFilterInput({ key: 'idSuku', type: 'select', options: sukuOptions })}
          </div>
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Jemaat
            </label>
            {renderFilterInput({ key: 'status', type: 'select', options: statusJemaatOptions })}
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="space-y-6">
              {filterSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {section.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {section.filters.map((filter) => (
                      <div key={filter.key} className="min-w-0">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {filter.label}
                        </label>
                        {renderFilterInput(filter)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JemaatFilters;