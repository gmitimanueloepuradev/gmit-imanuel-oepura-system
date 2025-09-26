import { Book, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerse = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent blocking
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

      const response = await fetch(
        "https://beta.ourmanna.com/api/v1/get?format=json",
        {
          signal: controller.signal,
          cache: 'force-cache' // Cache the response
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Gagal mengambil ayat");
      }

      const data = await response.json();

      if (data.verse && data.verse.details) {
        setVerse(data.verse.details);
      } else {
        throw new Error("Format respons tidak valid");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted due to timeout');
      } else {
        console.error("Error fetching daily verse:", err);
      }
      setError(err.message);
      // Fallback verse - show immediately
      setVerse({
        text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
        reference: "Yohanes 3:16",
        version: "TB",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerse();
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:bg-gray-300 md:dark:bg-gray-700 md:rounded-2xl p-4 md:p-6 md:shadow-lg w-full md:w-3/4 mx-auto gap-4 md:gap-8 transition-colors duration-300">
      {/* Icon/Visual */}
      <div className="flex-shrink-0 flex items-center justify-center md:w-72 md:h-72 relative flex-1">
        <div className="bg-gradient-to-br rounded-2xl p-2 w-full h-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              alt="Alkitab Kudus"
              className="object-cover rounded-xl shadow-lg"
              src="/bible-image.webp"
              fill
              sizes="(min-width: 768px) 288px, 100vw"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center text-gray-800 dark:text-white transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-4xl font-bold tracking-wide font-sans text-gray-800 dark:text-white">
            Ayat Harian
          </h2>
        </div>
        <p className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-200">
          Setiap hari, mari kita dikuatkan oleh Firman Tuhan.
        </p>

        {loading ? (
          <div className="mb-6">
            <div className="flex items-center justify-center py-8 min-h-[120px]">
              <div className="loading loading-spinner loading-lg text-blue-600" />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <blockquote className="text-xl md:text-2xl italic font-medium leading-relaxed text-gray-800 dark:text-gray-100 mb-4">
              "{verse?.text}"
            </blockquote>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              — {verse?.reference} ({verse?.version})
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            className="btn btn-outline btn-sm gap-2 hover:btn-primary disabled:loading"
            disabled={loading}
            onClick={fetchVerse}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? "Memuat..." : "Ayat Baru"}
          </button>

          {verse?.verseurl && (
            <a
              className="btn btn-ghost btn-sm text-xs opacity-60"
              href={verse.verseurl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Powered by OurManna.com
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
