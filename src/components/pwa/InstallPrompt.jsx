import { useEffect, useState } from "react";
import { X, Download, Share, Plus } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect device type and standalone mode
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOS = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream;
    const android = /android/.test(userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true;

    setIsIOS(iOS);
    setIsAndroid(android);
    setIsStandalone(standalone);

    // Check if user has already dismissed the prompt
    const hasSeenPrompt = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');

    // Show prompt again after 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const shouldShowAgain = !dismissedTime || parseInt(dismissedTime) < sevenDaysAgo;

    // Handle beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      if (!hasSeenPrompt || shouldShowAgain) {
        setTimeout(() => setShowInstallPrompt(true), 3000); // Show after 3 seconds
      }
    };

    // Show for iOS Safari users
    if (iOS && !standalone && (!hasSeenPrompt || shouldShowAgain)) {
      setTimeout(() => setShowInstallPrompt(true), 3000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide prompt if app gets installed
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && isAndroid) {
      // Android Chrome install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
  };

  // Don't show if already installed or not mobile
  if (isStandalone || (!isIOS && !isAndroid) || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-md mx-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/android-chrome-192x192.png"
                alt="GMIT JIO"
                className="w-8 h-8 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Install GMIT JIO
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Akses lebih cepat dari layar utama
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {isIOS ? (
          // iOS Instructions
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Install aplikasi ini di iPhone/iPad:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Share size={16} className="text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  1. Tap tombol Share
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Plus size={16} className="text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  2. Pilih "Add to Home Screen"
                </span>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Mengerti
            </button>
          </div>
        ) : (
          // Android Install Button
          <div className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Install untuk akses yang lebih cepat dan notifikasi
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}