import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { OfflinePackage } from "@shared/schema";

export default function OfflinePackages() {
  const { toast } = useToast();

  const { data: packages, isLoading } = useQuery({
    queryKey: ['/api/offline-packages'],
    queryFn: async () => {
      const response = await fetch('/api/offline-packages');
      if (!response.ok) throw new Error('Failed to fetch offline packages');
      return response.json() as OfflinePackage[];
    }
  });

  const downloadMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await apiRequest('PUT', `/api/offline-packages/${id}`, {
        isDownloaded: true
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/offline-packages'] });
      toast({ title: "Package downloaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to download package", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('PUT', `/api/offline-packages/${id}`, {
        isDownloaded: false,
        downloadedAt: null
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/offline-packages'] });
      toast({ title: "Package removed successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to remove package", variant: "destructive" });
    }
  });

  const downloadedPackages = packages?.filter(pkg => pkg.isDownloaded) || [];
  const availablePackages = packages?.filter(pkg => !pkg.isDownloaded) || [];
  const totalSize = downloadedPackages.reduce((acc, pkg) => acc + parseFloat(pkg.size), 0);
  const maxSize = 100; // 100MB limit
  const usagePercent = (totalSize / maxSize) * 100;

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'free': return 'default';
      case 'premium': return 'secondary';
      case 'specialized': return 'outline';
      default: return 'default';
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'free': return 'Free';
      case 'premium': return 'Premium';
      case 'specialized': return 'Specialized';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto pb-20">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Offline Packages</h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Download word packages for offline use
          </p>

          {/* Storage Info */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <i className="fas fa-hdd text-blue-600 dark:text-blue-400"></i>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Storage Used</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalSize.toFixed(1)} MB of {maxSize} MB
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={Math.min(usagePercent, 100)} className="h-2" data-testid="storage-progress" />
              </div>
            </CardContent>
          </Card>

          {/* Available Packages */}
          {availablePackages.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Available Packages</h4>
              <div className="space-y-3">
                {availablePackages.map((pkg) => (
                  <Card key={pkg.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100" data-testid={`text-package-${pkg.id}`}>
                            {pkg.name}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {pkg.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={getBadgeVariant(pkg.type)} data-testid={`badge-type-${pkg.id}`}>
                              {getBadgeLabel(pkg.type)}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400" data-testid={`text-size-${pkg.id}`}>
                              {pkg.size}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => downloadMutation.mutate(pkg.id)}
                          disabled={downloadMutation.isPending || pkg.type === 'premium'}
                          className={
                            pkg.type === 'premium' 
                              ? "ml-3 bg-amber-600 hover:bg-amber-700 text-white" 
                              : "ml-3 bg-primary-600 hover:bg-primary-700 text-white"
                          }
                          data-testid={`button-download-${pkg.id}`}
                        >
                          {pkg.type === 'premium' ? (
                            <>
                              <i className="fas fa-crown mr-1"></i>
                              Upgrade
                            </>
                          ) : (
                            <>
                              <i className="fas fa-download mr-1"></i>
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Downloaded Packages */}
          {downloadedPackages.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Downloaded</h4>
              <div className="space-y-3">
                {downloadedPackages.map((pkg) => (
                  <Card key={pkg.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-gray-100" data-testid={`text-downloaded-${pkg.id}`}>
                              {pkg.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {pkg.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(pkg.id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                          data-testid={`button-remove-${pkg.id}`}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="text-primary-600 text-2xl">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading packages...</p>
            </div>
          )}

          {packages && packages.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="text-gray-300 text-4xl mb-3">
                <i className="fas fa-download"></i>
              </div>
              <p className="text-gray-500 dark:text-gray-400">No packages available</p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
