import { useState } from "react";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import SearchSection from "@/components/search-section";
import TranslationResults from "@/components/translation-results";
import { useQuery } from "@tanstack/react-query";
import type { DictionaryEntry } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/dictionary/search', searchQuery, currentLanguage],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/dictionary/search?query=${encodeURIComponent(searchQuery)}&language=${currentLanguage}`);
      if (!response.ok) throw new Error('Failed to search dictionary');
      return response.json() as DictionaryEntry[];
    },
    enabled: searchQuery.trim().length > 0,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedEntry(null);
  };

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'bn' : 'en');
    setSearchQuery("");
    setSelectedEntry(null);
  };

  const handleSelectEntry = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto pb-20">
        <SearchSection
          searchQuery={searchQuery}
          onSearch={handleSearch}
          currentLanguage={currentLanguage}
          onLanguageToggle={handleLanguageToggle}
          searchResults={searchResults || []}
          isLoading={isLoading}
          onSelectEntry={handleSelectEntry}
          data-testid="search-section"
        />

        {selectedEntry && (
          <TranslationResults 
            entry={selectedEntry} 
            data-testid="translation-results"
          />
        )}

        {searchQuery && !selectedEntry && !isLoading && searchResults && searchResults.length === 0 && (
          <div className="px-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-gray-400 text-4xl mb-3">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Try searching with different keywords or check the language setting.
              </p>
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="px-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="text-primary-600 text-4xl mb-3">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Welcome to Dictionary
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Search for words in English or বাংলা to get translations, synonyms, and examples.
              </p>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
