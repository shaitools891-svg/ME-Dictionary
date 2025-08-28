import { useState, useEffect } from "react";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import SearchSection from "@/components/search-section";
import TranslationResults from "@/components/translation-results";
import { getSuggestions, commonEnglishWords, commonBanglaWords, type DictionaryWord } from "@/lib/dictionary-data";
import { dictionaryManager } from "@/lib/dictionary-manager";
import type { DictionaryEntry } from "@shared/schema";

// Dictionary manager will handle all dictionary operations

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search function using dictionary manager
  const performSearch = (query: string, language: 'en' | 'bn') => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Use dictionary manager for search
    setTimeout(() => {
      const results = dictionaryManager.search(query, language);

      // Also include suggestions from common words
      const suggestions = getSuggestions(query, language, 3);
      suggestions.forEach(suggestion => {
        if (!results.find(r => r.word === suggestion)) {
          const suggestionEntry: DictionaryEntry = {
            id: `suggestion-${suggestion}`,
            word: suggestion,
            language: language,
            translation: 'Translation not available - please add to dictionary',
            partOfSpeech: 'noun',
            definition: 'Common word - full definition available in complete version',
            synonyms: null,
            antonyms: null,
            examples: null
          };
          results.push(suggestionEntry);
        }
      });

      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedEntry(null);
    performSearch(query, currentLanguage);
  };

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    setCurrentLanguage(newLanguage);
    setSearchQuery("");
    setSelectedEntry(null);
    setSearchResults([]);
    if (searchQuery) {
      performSearch(searchQuery, newLanguage);
    }
  };

  const handleSelectEntry = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 android-scroll">
      <Header />
      
      <main className="max-w-md mx-auto pb-20 safe-area-bottom">
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
