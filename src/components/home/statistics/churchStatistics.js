import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import publicStatisticsService from "../../../services/publicStatisticsService";
import StatPieChart from "./statPieChart";

export default function ChurchStatistics() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Replace useEffect with TanStack Query
  const {
    data: chartData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["churchStatistics"],
    queryFn: async () => {
      const response = await publicStatisticsService.getChurchStatistics();
      return publicStatisticsService.formatChartData(response);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Calculate how many slides we have (showing 1 chart per slide)
  const chartsPerSlide = 1;
  const totalSlides = Math.ceil(chartData.length / chartsPerSlide);

  // Auto-rotation effect (only create interval when we have data)
  useState(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 10000);
      return () => clearInterval(interval);
    }
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={`hidden lg:block bg-slate-800 lg:sticky lg:top-0 lg:h-screen overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-full lg:w-1/5'
      }`}>
        {/* Collapse/Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-1/2 -translate-y-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 ${
            isCollapsed ? 'right-2' : 'right-4'
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className={`transition-all duration-300 ease-in-out h-full ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="p-4 lg:p-6 lg:py-8 h-full">
            <div className="flex flex-col h-full w-full items-center justify-center min-h-[300px] lg:min-h-full">
              <div className="loading loading-spinner loading-lg text-blue-400"></div>
              <p className="mt-4 text-sm text-gray-300">Memuat statistik...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`hidden lg:block bg-slate-800 lg:sticky lg:top-0 lg:h-screen overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-full lg:w-1/5'
      }`}>
        {/* Collapse/Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-1/2 -translate-y-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 ${
            isCollapsed ? 'right-2' : 'right-4'
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className={`transition-all duration-300 ease-in-out h-full ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="p-4 lg:p-6 lg:py-8 h-full">
            <div className="flex flex-col h-full w-full items-center justify-center min-h-[300px] lg:min-h-full">
              <div className="text-red-400 text-center">
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
                <p className="text-sm text-gray-300">Gagal memuat statistik gereja</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no data
  if (!chartData.length) {
    return null;
  }

  return (
    <div
      className={`hidden lg:block bg-base-300 lg:sticky lg:top-0 lg:h-screen overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-full lg:w-1/5'
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 z-10 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 ${
          isCollapsed ? 'right-2' : 'right-4'
        }`}
        aria-label={isCollapsed ? "Expand statistics" : "Collapse statistics"}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Content */}
      <div className={`transition-all duration-300 ease-in-out h-full ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="p-4 lg:p-6 lg:py-16 h-full">
          <div className="flex flex-col h-full w-full">
            {/* Chart container */}
            <div className="flex-1 relative overflow-hidden min-h-[300px] lg:min-h-0">
              <div
                className="transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateY(-${currentIndex * 100}%)`,
                }}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => {
                  const startIdx = slideIndex * chartsPerSlide;
                  const endIdx = startIdx + chartsPerSlide;
                  const slideCharts = chartData.slice(startIdx, endIdx);

                  return (
                    <div
                      key={slideIndex}
                      className="h-full w-full flex flex-col gap-4 lg:gap-6 py-2 lg:py-4"
                    >
                      {slideCharts.map((chart, chartIndex) => (
                        <div
                          key={`${slideIndex}-${chartIndex}`}
                          className="flex-1 min-h-0"
                        >
                          <StatPieChart
                            title={chart.title}
                            data={chart.data}
                            size="small"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Indicators at bottom */}
            {totalSlides > 1 && (
              <div className="flex justify-center space-x-2 py-4">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                      index === currentIndex ? "bg-primary" : "bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
