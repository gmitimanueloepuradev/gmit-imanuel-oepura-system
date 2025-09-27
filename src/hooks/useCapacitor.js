import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export function useCapacitor() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    const checkPlatform = () => {
      const isNativeApp = Capacitor.isNativePlatform();
      const currentPlatform = Capacitor.getPlatform();

      setIsNative(isNativeApp);
      setPlatform(currentPlatform);

      // Configure status bar for mobile
      if (isNativeApp) {
        StatusBar.setStyle({ style: Style.Dark });

        // Hide splash screen after app loads
        SplashScreen.hide();
      }
    };

    checkPlatform();
  }, []);

  const setStatusBarStyle = async (style = Style.Dark) => {
    if (isNative) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.log('StatusBar error:', error);
      }
    }
  };

  const setStatusBarBackground = async (color = '#000000') => {
    if (isNative && platform === 'android') {
      try {
        await StatusBar.setBackgroundColor({ color });
      } catch (error) {
        console.log('StatusBar background error:', error);
      }
    }
  };

  const showSplashScreen = async () => {
    if (isNative) {
      try {
        await SplashScreen.show({
          showDuration: 2000,
          autoHide: true,
        });
      } catch (error) {
        console.log('SplashScreen error:', error);
      }
    }
  };

  const hideSplashScreen = async () => {
    if (isNative) {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.log('SplashScreen hide error:', error);
      }
    }
  };

  return {
    isNative,
    platform,
    setStatusBarStyle,
    setStatusBarBackground,
    showSplashScreen,
    hideSplashScreen,
  };
}

// Utility function to check if running in Capacitor
export const isCapacitor = () => {
  return Capacitor.isNativePlatform();
};

// Get current platform
export const getCurrentPlatform = () => {
  return Capacitor.getPlatform();
};