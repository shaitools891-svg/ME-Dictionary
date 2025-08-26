import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";

interface ThemeSelectorProps {
  onClose: () => void;
}

const themes = [
  { 
    key: 'light' as const, 
    name: 'Light Blue', 
    description: 'Clean and modern',
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    key: 'dark' as const, 
    name: 'Dark Mode', 
    description: 'Easy on the eyes',
    gradient: 'from-gray-800 to-gray-900'
  },
  { 
    key: 'sepia' as const, 
    name: 'Sepia', 
    description: 'Comfortable reading',
    gradient: 'from-amber-200 to-amber-400'
  },
  { 
    key: 'forest' as const, 
    name: 'Forest Green', 
    description: 'Nature inspired',
    gradient: 'from-green-400 to-green-600'
  },
];

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeSelect = (selectedTheme: typeof theme) => {
    setTheme(selectedTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <Card className="w-full max-w-md mx-4 mb-4 rounded-t-2xl max-h-96 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Choose Theme</h3>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              data-testid="button-close-theme-modal"
            >
              <i className="fas fa-times text-gray-500 dark:text-gray-400"></i>
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.key}
              onClick={() => handleThemeSelect(themeOption.key)}
              variant="ghost"
              className="w-full p-4 rounded-xl border-2 hover:border-primary-500 transition-colors flex items-center space-x-3 h-auto text-left"
              style={{
                borderColor: theme === themeOption.key ? 'hsl(var(--primary))' : 'hsl(var(--border))'
              }}
              data-testid={`button-theme-${themeOption.key}`}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${themeOption.gradient}`}></div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{themeOption.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{themeOption.description}</p>
              </div>
              {theme === themeOption.key && (
                <i className="fas fa-check text-primary-600 dark:text-primary-400"></i>
              )}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
