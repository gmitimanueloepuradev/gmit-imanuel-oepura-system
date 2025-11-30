import { useEffect, useState } from "react";

import kontenLandingPageService from "@/services/kontenLandingPageService";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function History() {
  const [sejarahData, setSejarahData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sejarah
        const sejarahResponse =
          await kontenLandingPageService.getPublicBySection("SEJARAH");

        if (sejarahResponse.success && sejarahResponse.data.length > 0) {
          setSejarahData(sejarahResponse.data);
        }
      } catch (error) {
        console.error("Error fetching sejarah:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Array warna untuk timeline
  const colors = [
    {
      gradient: "from-blue-400 to-indigo-400",
      text: "text-blue-300",
    },
    {
      gradient: "from-green-400 to-emerald-400",
      text: "text-green-300",
    },
    {
      gradient: "from-purple-400 to-pink-400",
      text: "text-purple-300",
    },
    {
      gradient: "from-orange-400 to-red-400",
      text: "text-orange-300",
    },
    {
      gradient: "from-cyan-400 to-blue-400",
      text: "text-cyan-300",
    },
  ];

  if (loading) {
    return <LoadingScreen isLoading={true} message="Memuat Sejarah Gereja..." />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent">
            Sejarah Kami
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full" />
        </div>

        {/* Timeline */}
        {sejarahData.length > 0 ? (
          <div className="space-y-12">
            {sejarahData.map((item, index) => {
              const color = colors[index % colors.length];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center gap-8 group"
                >
                  {/* Left Content (for even index) */}
                  {isEven && (
                    <div className="flex-1 md:text-right">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                        <h3 className={`text-2xl font-bold ${color.text} mb-4`}>
                          {item.judul}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-200">
                          {item.konten}
                        </p>
                        {item.deskripsi && (
                          <p className="text-sm leading-relaxed text-gray-300 mt-4">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty space for odd index */}
                  {!isEven && <div className="flex-1 hidden md:block" />}

                  {/* Timeline Dot */}
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${color.gradient} rounded-full flex-shrink-0 relative`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${color.gradient} rounded-full animate-ping opacity-75`}
                    />
                  </div>

                  {/* Right Content (for odd index) */}
                  {!isEven && (
                    <div className="flex-1">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                        <h3 className={`text-2xl font-bold ${color.text} mb-4`}>
                          {item.judul}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-200">
                          {item.konten}
                        </p>
                        {item.deskripsi && (
                          <p className="text-sm leading-relaxed text-gray-300 mt-4">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty space for even index */}
                  {isEven && <div className="flex-1 hidden md:block" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">
              Belum ada data sejarah yang tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
