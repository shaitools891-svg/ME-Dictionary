import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import AndroidInstallBanner from "@/components/android-install-banner";
import PrayerNotification from "@/components/prayer-notification";
import { prayerScheduler } from "@/lib/prayer-scheduler";
import { useState, useEffect } from "react";
import Home from "@/pages/home";
import CustomWords from "@/pages/custom-words";
import OfflinePackages from "@/pages/offline-packages";
import PrayerSettings from "@/pages/prayer-settings";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/custom" component={CustomWords} />
      <Route path="/offline" component={OfflinePackages} />
      <Route path="/prayer" component={PrayerSettings} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [prayerStatus, setPrayerStatus] = useState({ isActive: false, currentPrayer: null });

  useEffect(() => {
    // Initialize prayer scheduler
    prayerScheduler.onStatusChange((isActive, prayer) => {
      setPrayerStatus({ isActive, currentPrayer: prayer });
    });
    
    prayerScheduler.start();

    return () => {
      prayerScheduler.stop();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen transition-colors duration-300 android-tap-highlight android-scroll safe-area-top safe-area-bottom">
            <Toaster />
            <Router />
            <AndroidInstallBanner />
            <PrayerNotification
              prayerName={prayerStatus.currentPrayer || ''}
              isActive={prayerStatus.isActive}
              onDismiss={() => setPrayerStatus(prev => ({ ...prev, isActive: false }))}
            />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
