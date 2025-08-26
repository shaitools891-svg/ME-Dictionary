import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import ThemeSelector from "@/components/theme-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Settings() {
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto pb-20">
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h2>

          {/* Theme Settings */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Appearance</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowThemeSelector(true)}
                  className="w-full justify-between"
                  data-testid="button-theme-selector"
                >
                  <span>Theme</span>
                  <i className="fas fa-palette text-gray-400"></i>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">App Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about new features
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    data-testid="switch-notifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sound">Sound Effects</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Play sounds for interactions
                    </p>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    data-testid="switch-sound"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">Auto Sync</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sync data automatically
                    </p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                    data-testid="switch-auto-sync"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Storage</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Custom Words</span>
                  <span className="text-gray-900 dark:text-gray-100">2.1 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Offline Packages</span>
                  <span className="text-gray-900 dark:text-gray-100">45.2 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cache</span>
                  <span className="text-gray-900 dark:text-gray-100">8.9 MB</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    data-testid="button-clear-cache"
                  >
                    Clear Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">About</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Version</span>
                  <span className="text-gray-900 dark:text-gray-100">1.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Build</span>
                  <span className="text-gray-900 dark:text-gray-100">2024.01.26</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />

      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}
    </div>
  );
}
