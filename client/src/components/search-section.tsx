import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DictionaryEntry } from "@shared/schema";

interface SearchSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  currentLanguage: 'en' | 'bn';
  onLanguageToggle: () => void;
  searchResults: DictionaryEntry[];
  isLoading: boolean;
  onSelectEntry: (entry: DictionaryEntry) => void;
}

export default function SearchSection({
  searchQuery,
  onSearch,
  currentLanguage,
  onLanguageToggle,
  searchResults,
  isLoading,
  onSelectEntry
}: SearchSectionProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim() !== searchQuery) {
        onSearch(inputValue.trim());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (inputValue.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (entry: DictionaryEntry) => {
    setInputValue(entry.word);
    setShowSuggestions(false);
    onSelectEntry(entry);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      if (searchResults.length > 0) {
        onSelectEntry(searchResults[0]);
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-search-container]')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <section className="p-4 bg-white dark:bg-gray-800" data-search-container>
      <div className="relative">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={currentLanguage === 'en' ? "Search in English..." : "বাংলায় খুঁজুন..."}
            className={cn(
              "w-full pl-12 pr-20 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-primary-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
              currentLanguage === 'bn' && "font-bengali"
            )}
            data-testid="input-search"
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              data-testid="button-microphone"
            >
              <i className="fas fa-microphone"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageToggle}
              className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              data-testid="button-language-toggle"
            >
              <i className="fas fa-exchange-alt"></i>
            </Button>
          </div>
        </div>
        
        {/* Language Toggle */}
        <div className="flex items-center justify-center mt-3 space-x-3">
          <span className={cn(
            "text-sm font-medium",
            currentLanguage === 'en' ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"
          )}>
            English
          </span>
          <Switch
            checked={currentLanguage === 'bn'}
            onCheckedChange={onLanguageToggle}
            data-testid="switch-language"
          />
          <span className={cn(
            "text-sm font-medium font-bengali",
            currentLanguage === 'bn' ? "text-primary-600 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"
          )}>
            বাংলা
          </span>
        </div>
      </div>

      {/* Auto-suggestions */}
      {showSuggestions && (searchResults.length > 0 || isLoading) && (
        <Card className="mt-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
          <CardContent className="p-3">
            {isLoading ? (
              <div className="text-center py-2">
                <i className="fas fa-spinner fa-spin text-gray-400"></i>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.slice(0, 5).map((entry) => (
                  <Button
                    key={entry.id}
                    variant="ghost"
                    onClick={() => handleSelectSuggestion(entry)}
                    className="w-full justify-start text-left px-3 py-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors h-auto"
                    data-testid={`suggestion-${entry.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-search text-gray-400 text-sm"></i>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-gray-700 dark:text-gray-300 truncate",
                          currentLanguage === 'bn' && "font-bengali"
                        )}>
                          {entry.word}
                        </div>
                        {entry.translation && (
                          <div className={cn(
                            "text-xs text-gray-500 dark:text-gray-400 truncate",
                            currentLanguage === 'en' ? "font-bengali" : ""
                          )}>
                            {entry.translation}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
