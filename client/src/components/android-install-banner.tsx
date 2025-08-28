import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAndroidFeatures } from '@/hooks/use-android-features';

export default function AndroidInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { isInstalled, canInstall } = useAndroidFeatures();

  useEffect(() => {
    // Show banner if app can be installed and isn't already installed
    if (canInstall && !isInstalled) {
      const hasSeenBanner = localStorage.getItem('hasSeenInstallBanner');
      if (!hasSeenBanner) {
        // Add a small delay to ensure the banner appears after page load
        setTimeout(() => {
          setShowBanner(true);
        }, 2000);
      }
    }
  }, [canInstall, isInstalled]);

  const handleInstall = () => {
    // Trigger the browser's install prompt
    const event = (window as any).deferredPrompt;
    if (event) {
      event.prompt();
      event.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        (window as any).deferredPrompt = null;
      }).catch((error: any) => {
        console.error('Install prompt error:', error);
      });
    } else {
      console.warn('No deferred prompt available');
    }
    setShowBanner(false);
    localStorage.setItem('hasSeenInstallBanner', 'true');
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('hasSeenInstallBanner', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-primary-600 text-white rounded-xl shadow-lg p-4 z-50 animate-slide-up">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <i className="fas fa-mobile-alt text-2xl"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Install Dictionary App</h4>
          <p className="text-sm text-primary-100 mb-3">
            Get the full Android app experience with offline access, faster loading, and home screen access.
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2"
              data-testid="button-install-app"
            >
              <i className="fas fa-download mr-1"></i>
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-primary-700 px-4 py-2"
              data-testid="button-dismiss-install"
            >
              Later
            </Button>
          </div>
        </div>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="flex-shrink-0 p-1 text-white hover:bg-primary-700"
          data-testid="button-close-install-banner"
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
    </div>
  );
}