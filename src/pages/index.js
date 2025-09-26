import AboutSection from "@/components/home/aboutSection";
import DailyVerse from "@/components/home/cta/dailyVerse";
import JoinUs from "@/components/home/cta/joinUs";
import NewsRow from "@/components/home/newsRow";
import OurLocation from "@/components/home/ourLocation";
import ScheduleRow from "@/components/home/schedule/scheduleRow";
import ChurchStatistics from "@/components/home/statistics/churchStatistics";
import ChurchStatisticsHorizontal from "@/components/home/statistics/churchStatisticsHorizontal";
import PageTitle from "@/components/ui/PageTitle";

export default function Home() {
  return (
    <>
      <PageTitle
        description="GMIT Jemaat Imanuel Oepura (JIO) - Gereja Masehi Injili di Timor yang melayani jemaat dengan penuh kasih dan dedikasi. Bergabunglah bersama kami dalam ibadah, persekutuan, dan pelayanan."
        title="Beranda"
      />
      <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {/* Mobile Layout - Vertical Stack */}
        <div className="lg:hidden">
          {/* Hero Section */}
          <div className="relative flex justify-start items-center h-screen">
            <img
              alt="Home Head"
              className="object-cover w-full h-full"
              src="/header/f92411b3.webp"
            />
            <div className="absolute flex flex-col p-8">
              <p className="text-white text-2xl font-bold">Welcome to</p>
              <h1 className="text-white text-4xl font-bold">
                GMIT Imanuel Oepura
              </h1>
              <p className="text-white text-base">
                Together in love, growing in faith, serving in hope.
              </p>
            </div>
          </div>

          {/* Mobile Statistics - Vertical */}
          <ChurchStatistics />

          {/* Rest of content */}
          <ChurchStatisticsHorizontal />

          {/* About Section */}
          <AboutSection />

          <NewsRow />

          <div className="p-4 min-h-screen flex flex-col gap-4 bg-gray-100 dark:bg-gray-900 items-center justify-center">
            <JoinUs />
            <DailyVerse />
          </div>

          <div className="relative min-h-fit">
            <img
              alt="Home Head"
              className="absolute inset-0 object-cover w-full h-full"
              src="/header/f92411b3.webp"
            />
            <div className="relative z-10 flex flex-col w-full p-4">
              <ScheduleRow
                jenisIbadah="Cell Group/Kelompok Kecil"
                limit={4}
                title="Jadwal Cell Group"
              />
              <ScheduleRow
                kategori="Keluarga"
                limit={6}
                title="Jadwal Ibadah Keluarga"
              />
              <ScheduleRow limit={4} title="Semua Jadwal Ibadah" />
            </div>
          </div>

          <div className="w-full p-4">
            <OurLocation />
          </div>
        </div>

        {/* Desktop Layout - Side-by-side */}
        <div className="hidden lg:flex">
          {/* Left Column - Church Statistics (Sidebar) */}
          <ChurchStatistics />

          {/* Right Column - Main Content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Hero */}
            <div className="relative flex justify-start items-center h-screen">
              <img
                alt="Home Head"
                className="object-cover w-full h-full brightness-60"
                src="/header/f92411b3.webp"
              />
              <div className="absolute flex flex-col p-16">
                <p className="text-white text-4xl font-bold">Welcome to</p>
                <h1 className="text-white text-6xl font-bold">
                  GMIT Imanuel Oepura
                </h1>
                <p className="text-white text-lg">
                  Together in love, growing in faith, serving in hope.
                </p>
              </div>
            </div>

            {/* Horizontal Statistics */}
            <ChurchStatisticsHorizontal />

            {/* About Section */}
            <AboutSection />

            {/* News */}
            <NewsRow />

            {/* CTA */}
            <div className="p-8 min-h-screen flex flex-col gap-4 bg-gray-100 dark:bg-gray-900 items-center justify-center">
              <JoinUs />
              <DailyVerse />
            </div>

            {/* Schedule */}
            <div className="relative min-h-fit">
              <img
                alt="Home Head"
                className="absolute inset-0 object-cover w-full h-full brightness-75"
                src="/header/5dd0a95e.webp"
              />
              <div className="relative z-10 flex flex-col w-full p-8">
                <ScheduleRow
                  jenisIbadah="Cell Group/Kelompok Kecil"
                  limit={4}
                  title="Jadwal Cell Group"
                />
                <ScheduleRow
                  kategori="Keluarga"
                  limit={6}
                  title="Jadwal Ibadah Keluarga"
                />
                <ScheduleRow limit={4} title="Semua Jadwal Ibadah" />
              </div>
            </div>

            {/* Location */}
            <div className="w-full p-8">
              <OurLocation />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
