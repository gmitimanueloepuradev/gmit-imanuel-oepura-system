import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import publicJadwalService from "../../../services/publicJadwalService";
import ScheduleCard from "./scheduleCard";

export default function ScheduleRow({ jenisIbadah = null, kategori = null, title = "Schedule", limit = 6 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedule data from API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        console.log(`Fetching schedules for: ${title}`, { jenisIbadah, kategori, limit });

        const response = await publicJadwalService.getJadwalIbadah({
          jenisIbadah,
          kategori,
          limit,
          upcoming: true,
        });

        console.log(`Response for ${title}:`, response);

        const formattedSchedules = publicJadwalService.formatForScheduleRow(response);
        console.log(`Formatted schedules for ${title}:`, formattedSchedules);

        setSchedules(formattedSchedules);
      } catch (err) {
        console.error(`Failed to fetch schedules for ${title}:`, err);
        setError("Gagal memuat jadwal ibadah");
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [jenisIbadah, kategori, limit, title]);

  const nextSlide = () => {
    if (schedules.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % schedules.length);
    }
  };

  const prevSlide = () => {
    if (schedules.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + schedules.length) % schedules.length);
    }
  };

  const getSlidePosition = (index) => {
    const position = (index - currentIndex + schedules.length) % schedules.length;

    switch (position) {
      case 0:
        return "left-1/2 -translate-x-[160%] opacity-70 scale-90 lg:block hidden";
      case 1:
        return "left-1/2 -translate-x-1/2 opacity-100 scale-100 z-10";
      case 2:
        return "left-1/2 translate-x-[60%] opacity-70 scale-90 lg:block hidden";
      default:
        return "left-1/2 translate-x-[250%] opacity-0";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-black/20 py-2 overflow-hidden">
        <div className="divider text-3xl font-bold text-white">{title}</div>
        <div className="flex items-center justify-center h-80">
          <div className="loading loading-spinner loading-lg text-white"></div>
          <p className="ml-4 text-white">Memuat jadwal...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-black/20 py-2 overflow-hidden">
        <div className="divider text-3xl font-bold text-white">{title}</div>
        <div className="flex items-center justify-center h-80">
          <div className="text-red-300 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no schedules
  if (!schedules.length) {
    return (
      <div className="bg-black/20 py-2 overflow-hidden">
        <div className="divider text-3xl font-bold text-white">{title}</div>
        <div className="flex items-center justify-center h-80">
          <div className="text-white text-center">
            <p className="text-lg">
              Tidak ada jadwal {jenisIbadah ? jenisIbadah.toLowerCase() : "ibadah"} yang akan datang
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 py-2 overflow-hidden">
      {/* Row title */}
      <div className="divider text-3xl font-bold text-white">{title}</div>

      {/* Slider Container */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="relative h-80 flex items-center justify-center overflow-hidden">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.id}
              className={`
                absolute h-72
                w-4/5 lg:w-1/3 max-w-sm
                transition-all duration-700 ease-in-out
                ${getSlidePosition(index)}
              `}
            >
              <ScheduleCard
                title={schedule.title}
                date={schedule.date}
                time={schedule.time}
                location={schedule.location}
                speaker={schedule.speaker}
                tema={schedule.tema}
                firman={schedule.firman}
                jenisIbadah={schedule.jenisIbadah}
                rayon={schedule.rayon}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-2 gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-gray-300 bg-white transition-colors duration-500 hover:bg-success inline-flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-gray-300 bg-white transition-colors duration-500 hover:bg-success inline-flex items-center justify-center shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
