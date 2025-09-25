import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add fallback timeout to ensure content shows even if IntersectionObserver fails
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px' // Trigger earlier
      }
    );

    const element = document.getElementById('about-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div id="about-section" className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Mengenal GMIT Imanuel Oepura
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Gereja yang hidup dalam kasih, bertumbuh dalam iman, dan melayani dengan hati
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-8'}`}>
            {/* Timeline Preview */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">1950</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Awal Mula</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    GMIT Imanuel Oepura didirikan sebagai bagian dari pelayanan gereja di wilayah Timor,
                    lahir dari semangat penyebaran Injil dan kebutuhan masyarakat lokal.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">1970</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pertumbuhan</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Masa pembangunan gedung gereja yang lebih besar dan pengembangan berbagai
                    pelayanan seperti sekolah minggu dan persekutuan pemuda.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">2024</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Era Modern</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Mengintegrasikan teknologi dalam pelayanan dan keterlibatan aktif dalam
                    pembangunan masyarakat serta pelestarian budaya Timor.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/about" className="group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  Pelajari Lebih Lanjut
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                </div>
              </Link>
              <Link href="/sejarah" className="group">
                <div className="border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 px-8 py-3 rounded-full font-semibold text-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transform hover:scale-105 transition-all duration-300">
                  Sejarah Lengkap
                </div>
              </Link>
            </div>
          </div>

          {/* Right - Visual */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/header/about.png"
                  alt="GMIT Imanuel Oepura"
                  className="w-full h-80 lg:h-96 object-cover transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">GMIT Imanuel Oepura</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      "Together in love, growing in faith, serving in hope"
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 shadow-lg animate-pulse">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 shadow-lg animate-bounce">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold mb-2">70+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Tahun Melayani</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Anggota Jemaat</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Program Pelayanan</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold mb-2">1</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Keluarga Besar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}