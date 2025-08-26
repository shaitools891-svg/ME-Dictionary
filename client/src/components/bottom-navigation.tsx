import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { path: "/", icon: "fa-search", label: "Search", testId: "nav-search" },
  { path: "/custom", icon: "fa-book", label: "Custom", testId: "nav-custom" },
  { path: "/offline", icon: "fa-download", label: "Offline", testId: "nav-offline" },
  { path: "/prayer", icon: "fa-moon", label: "Prayer", testId: "nav-prayer" },
  { path: "/settings", icon: "fa-cog", label: "Settings", testId: "nav-settings" },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="max-w-md mx-auto flex">
        {navigationItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={cn(
                "flex-1 py-3 px-4 text-center transition-colors rounded-none h-auto flex flex-col items-center space-y-1",
                isActive
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
              data-testid={item.testId}
            >
              <i className={`fas ${item.icon} text-xl`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
