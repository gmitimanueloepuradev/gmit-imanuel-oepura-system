import usePengumuman from "@/hooks/usePengumuman";
import UppCard from "./uppCard";

export default function UppCardContainer({ jenisId = null, kategoriId = null, limit = 6 }) {
  // Fetch pengumuman data with filters
  const { pengumumanData, loading, error } = usePengumuman({
    jenisId,
    kategoriId,
    status: "PUBLISHED", // Only show published announcements
    limit,
    sortBy: "tanggalPengumuman",
    sortOrder: "desc",
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading announcements</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!pengumumanData || pengumumanData.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No announcements available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-screen bg-gray-100 p-8">
      {pengumumanData.map((pengumuman) => (
        <UppCard
          key={pengumuman.id}
          pengumuman={pengumuman}
        />
      ))}
    </div>
  );
}
