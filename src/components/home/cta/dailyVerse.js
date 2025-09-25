import { useState, useEffect } from "react";
import { Book, RefreshCw } from "lucide-react";

export default function DailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerse = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://beta.ourmanna.com/api/v1/get?format=json');

      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }

      const data = await response.json();

      if (data.verse && data.verse.details) {
        setVerse(data.verse.details);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching daily verse:', err);
      setError(err.message);
      // Fallback verse
      setVerse({
        text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
        reference: "John 3:16",
        version: "NIV"
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
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-2xl p-8 w-full h-full flex items-center justify-center">
          <Book className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center text-gray-800 dark:text-white transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h2 className="text-4xl font-bold tracking-wide font-sans text-gray-800 dark:text-white">
            Daily Verse
          </h2>
        </div>
        <p className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-200">
          Every day, let us be strengthened by God's Word.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
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
            onClick={fetchVerse}
            disabled={loading}
            className="btn btn-outline btn-sm gap-2 hover:btn-primary disabled:loading"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? "Loading..." : "New Verse"}
          </button>

          {verse?.verseurl && (
            <a
              href={verse.verseurl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm text-xs opacity-60"
            >
              Powered by OurManna.com
            </a>
          )}
        </div>
      </div>
    </div>
  );
}