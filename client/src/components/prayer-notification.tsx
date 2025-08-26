import { useEffect, useState } from 'react';
import { useAndroidFeatures } from '@/hooks/use-android-features';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PrayerNotificationProps {
  prayerName: string;
  isActive: boolean;
  onDismiss: () => void;
}

export default function PrayerNotification({ prayerName, isActive, onDismiss }: PrayerNotificationProps) {
  const { vibrate, setSilentMode } = useAndroidFeatures();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (isActive && prayerName) {
      setShowNotification(true);
      
      // Vibrate on prayer start (gentle pattern)
      vibrate([200, 100, 200]);
      
      // Set device to silent mode
      setSilentMode(true);
      
      // Show notification if permissions granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`${prayerName} Prayer Time`, {
          body: 'Device has been set to silent mode',
          icon: '/icon-192.png',
          tag: 'prayer-notification',
          silent: true
        });
      }
    } else if (!isActive) {
      // Prayer time ended
      setSilentMode(false);
      
      if (showNotification) {
        // Gentle vibration to indicate end of prayer time
        vibrate([100, 50, 100]);
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Prayer Time Ended', {
            body: 'Silent mode has been disabled',
            icon: '/icon-192.png',
            tag: 'prayer-end-notification',
            silent: true
          });
        }
        
        setShowNotification(false);
      }
    }
  }, [isActive, prayerName, vibrate, setSilentMode, showNotification]);

  if (!showNotification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-mosque text-2xl text-amber-600 dark:text-amber-400"></i>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {prayerName} Prayer Time
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your device has been set to silent mode during this prayer time.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-amber-600 dark:text-amber-400 mb-4">
            <i className="fas fa-volume-mute"></i>
            <span>Silent Mode Active</span>
          </div>
          
          <Button
            onClick={() => {
              onDismiss();
              setShowNotification(false);
            }}
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/30"
            data-testid="button-dismiss-prayer-notification"
          >
            <i className="fas fa-check mr-2"></i>
            Understood
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}