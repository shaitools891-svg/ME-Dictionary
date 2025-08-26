import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { PrayerSettings } from "@shared/schema";

const MOCK_USER_ID = "user-1";

const prayers = [
  { key: 'fajr', name: 'Fajr', description: 'Dawn Prayer', icon: 'fa-mosque' },
  { key: 'dhuhr', name: 'Dhuhr', description: 'Noon Prayer', icon: 'fa-sun' },
  { key: 'asr', name: 'Asr', description: 'Afternoon Prayer', icon: 'fa-cloud-sun' },
  { key: 'maghrib', name: 'Maghrib', description: 'Sunset Prayer', icon: 'fa-cloud-moon' },
  { key: 'isha', name: 'Isha', description: 'Night Prayer', icon: 'fa-moon' },
] as const;

export default function PrayerSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrayerSettings | null>(null);

  const { data: prayerSettings, isLoading } = useQuery({
    queryKey: ['/api/prayer-settings', MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/prayer-settings/${MOCK_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch prayer settings');
      return response.json() as PrayerSettings;
    }
  });

  useEffect(() => {
    if (prayerSettings) {
      setSettings(prayerSettings);
    }
  }, [prayerSettings]);

  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<PrayerSettings>) => {
      const response = await apiRequest('PUT', `/api/prayer-settings/${MOCK_USER_ID}`, updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prayer-settings', MOCK_USER_ID] });
      toast({ title: "Prayer settings saved successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to save prayer settings", variant: "destructive" });
    }
  });

  const handleMasterToggle = (enabled: boolean) => {
    if (!settings) return;
    const updatedSettings = { ...settings, enabled };
    setSettings(updatedSettings);
    updateMutation.mutate(updatedSettings);
  };

  const handlePrayerToggle = (prayerKey: string, enabled: boolean) => {
    if (!settings) return;
    const updatedSettings = {
      ...settings,
      [`${prayerKey}Enabled`]: enabled
    };
    setSettings(updatedSettings as PrayerSettings);
    updateMutation.mutate(updatedSettings);
  };

  const handleTimeChange = (prayerKey: string, timeType: 'start' | 'end', value: string) => {
    if (!settings) return;
    const updatedSettings = {
      ...settings,
      [`${prayerKey}${timeType === 'start' ? 'Start' : 'End'}`]: value
    };
    setSettings(updatedSettings as PrayerSettings);
  };

  const handleSave = () => {
    if (!settings) return;
    updateMutation.mutate(settings);
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-md mx-auto pb-20">
          <div className="p-4 text-center py-8">
            <div className="text-primary-600 text-2xl">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading prayer settings...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto pb-20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Prayer Silent Mode</h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Automatically silence phone during prayer times
          </p>

          {/* Master Toggle */}
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-moon text-amber-600 dark:text-amber-400"></i>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Auto Silent Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable for all prayers</p>
                  </div>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={handleMasterToggle}
                  data-testid="switch-master-toggle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times */}
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const isEnabled = settings[`${prayer.key}Enabled` as keyof PrayerSettings] as boolean;
              const startTime = settings[`${prayer.key}Start` as keyof PrayerSettings] as string;
              const endTime = settings[`${prayer.key}End` as keyof PrayerSettings] as string;

              return (
                <Card key={prayer.key} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <i className={`fas ${prayer.icon} text-primary-600 dark:text-primary-400`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{prayer.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{prayer.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(enabled) => handlePrayerToggle(prayer.key, enabled)}
                        disabled={!settings.enabled}
                        data-testid={`switch-${prayer.key}`}
                      />
                    </div>
                    <div className={`grid grid-cols-2 gap-3 ${!isEnabled || !settings.enabled ? 'opacity-50' : ''}`}>
                      <div>
                        <Label htmlFor={`${prayer.key}-start`} className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Start Time
                        </Label>
                        <Input
                          id={`${prayer.key}-start`}
                          type="time"
                          value={startTime}
                          onChange={(e) => handleTimeChange(prayer.key, 'start', e.target.value)}
                          disabled={!isEnabled || !settings.enabled}
                          className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          data-testid={`input-${prayer.key}-start`}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${prayer.key}-end`} className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          End Time
                        </Label>
                        <Input
                          id={`${prayer.key}-end`}
                          type="time"
                          value={endTime}
                          onChange={(e) => handleTimeChange(prayer.key, 'end', e.target.value)}
                          disabled={!isEnabled || !settings.enabled}
                          className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          data-testid={`input-${prayer.key}-end`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              data-testid="button-save-settings"
            >
              {updateMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                'Save Prayer Settings'
              )}
            </Button>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
