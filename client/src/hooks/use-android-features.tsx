import { useState, useEffect } from 'react';

interface AndroidFeatures {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  vibrate: (pattern?: number | number[]) => void;
  share: (data: { title: string; text: string; url?: string }) => Promise<void>;
  requestNotificationPermission: () => Promise<boolean>;
  setSilentMode: (enabled: boolean) => void;
  getBatteryInfo: () => Promise<{ charging: boolean; level: number }>;
}

export function useAndroidFeatures(): AndroidFeatures {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if app is installed (running in standalone mode)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store the event for later use
      (window as any).deferredPrompt = e;
      setCanInstall(true);
      console.log('Install prompt available');
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('App was installed successfully');
      setIsInstalled(true);
      setCanInstall(false);
      (window as any).deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const vibrate = (pattern: number | number[] = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const share = async (data: { title: string; text: string; url?: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        console.log('Share failed:', error);
        // Fallback to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${data.title}\n${data.text}${data.url ? '\n' + data.url : ''}`);
        }
      }
    } else {
      // Fallback for browsers without native sharing
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${data.title}\n${data.text}${data.url ? '\n' + data.url : ''}`);
      }
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const setSilentMode = (enabled: boolean) => {
    // Store silent mode preference
    localStorage.setItem('silentMode', enabled.toString());
    
    // If running as PWA, could potentially use Service Worker
    // to handle background tasks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'SILENT_MODE',
          enabled
        });
      });
    }
  };

  const getBatteryInfo = async (): Promise<{ charging: boolean; level: number }> => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return {
          charging: battery.charging,
          level: Math.round(battery.level * 100)
        };
      } catch (error) {
        console.log('Battery API not available:', error);
      }
    }
    return { charging: false, level: 100 };
  };

  return {
    isInstalled,
    canInstall,
    isOnline,
    vibrate,
    share,
    requestNotificationPermission,
    setSilentMode,
    getBatteryInfo
  };
}