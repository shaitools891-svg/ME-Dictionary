import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeSelector from "@/components/theme-selector";

export default function Header() {
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="fas fa-book-open text-primary-600 text-xl" data-testid="icon-logo"></i>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid="text-app-title">
                Dictionary
              </h1>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full" data-testid="badge-language">
                EN-BN
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowThemeSelector(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              data-testid="button-theme-toggle"
            >
              <i className="fas fa-palette text-gray-600 dark:text-gray-400"></i>
            </Button>
          </div>
        </div>
      </header>

      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}
    </>
  );
}
