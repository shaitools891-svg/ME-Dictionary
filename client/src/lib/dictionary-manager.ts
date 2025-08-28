// Dictionary Manager - Handles loading, merging, and managing multiple dictionary sources

import type { DictionaryEntry } from "@shared/schema";

export interface DictionarySource {
  english: Record<string, DictionaryEntry>;
  bangla: Record<string, DictionaryEntry>;
}

export class DictionaryManager {
  private dictionaries: DictionarySource[] = [];
  private mergedDictionary: DictionarySource = { english: {}, bangla: {} };

  constructor() {
    // Load the main dictionary by default
    this.loadMainDictionary();
  }

  // Load the main dictionary database
  private async loadMainDictionary() {
    try {
      const mainDict = await import('./dictionary-database.json');
      this.addDictionary(mainDict.default || mainDict);
    } catch (error) {
      console.warn('Could not load main dictionary:', error);
    }
  }

  // Add a dictionary source
  addDictionary(dictionary: DictionarySource) {
    this.dictionaries.push(dictionary);
    this.mergeDictionaries();
  }

  // Load dictionary from a JSON file URL
  async loadFromURL(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dictionary = await response.json();
      this.addDictionary(dictionary);
      return true;
    } catch (error) {
      console.error('Failed to load dictionary from URL:', error);
      return false;
    }
  }

  // Load dictionary from a local file (for development)
  async loadFromFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const dictionary = JSON.parse(e.target?.result as string);
          this.addDictionary(dictionary);
          resolve(true);
        } catch (error) {
          console.error('Failed to parse dictionary file:', error);
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }

  // Merge all dictionaries into one
  private mergeDictionaries() {
    const merged: DictionarySource = { english: {}, bangla: {} };

    this.dictionaries.forEach(dict => {
      // Merge English words
      Object.entries(dict.english || {}).forEach(([word, entry]) => {
        if (!merged.english[word]) {
          merged.english[word] = entry;
        } else {
          // Merge synonyms, antonyms, and examples if they exist
          const existing = merged.english[word];
          if (entry.synonyms && existing.synonyms) {
            const combined = [...(existing.synonyms || []), ...(entry.synonyms || [])];
            existing.synonyms = combined.filter((item, index) => combined.indexOf(item) === index);
          }
          if (entry.antonyms && existing.antonyms) {
            const combined = [...(existing.antonyms || []), ...(entry.antonyms || [])];
            existing.antonyms = combined.filter((item, index) => combined.indexOf(item) === index);
          }
          if (entry.examples && existing.examples) {
            existing.examples = [...(existing.examples || []), ...(entry.examples || [])];
          }
        }
      });

      // Merge Bangla words
      Object.entries(dict.bangla || {}).forEach(([word, entry]) => {
        if (!merged.bangla[word]) {
          merged.bangla[word] = entry;
        } else {
          // Merge synonyms, antonyms, and examples if they exist
          const existing = merged.bangla[word];
          if (entry.synonyms && existing.synonyms) {
            const combined = [...(existing.synonyms || []), ...(entry.synonyms || [])];
            existing.synonyms = combined.filter((item, index) => combined.indexOf(item) === index);
          }
          if (entry.antonyms && existing.antonyms) {
            const combined = [...(existing.antonyms || []), ...(entry.antonyms || [])];
            existing.antonyms = combined.filter((item, index) => combined.indexOf(item) === index);
          }
          if (entry.examples && existing.examples) {
            existing.examples = [...(existing.examples || []), ...(entry.examples || [])];
          }
        }
      });
    });

    this.mergedDictionary = merged;
  }

  // Search for words
  search(query: string, language: 'en' | 'bn'): DictionaryEntry[] {
    const results: DictionaryEntry[] = [];
    const searchData = language === 'en' ? this.mergedDictionary.english : this.mergedDictionary.bangla;

    // Exact match first
    if (searchData[query]) {
      results.push(searchData[query]);
    }

    // Partial matches
    Object.entries(searchData).forEach(([word, entry]) => {
      if (word.toLowerCase().includes(query.toLowerCase()) && !results.find(r => r.word === word)) {
        results.push(entry);
      }
    });

    return results;
  }

  // Get all words for a language
  getAllWords(language: 'en' | 'bn'): DictionaryEntry[] {
    const searchData = language === 'en' ? this.mergedDictionary.english : this.mergedDictionary.bangla;
    return Object.values(searchData);
  }

  // Get word count
  getWordCount(): { english: number; bangla: number } {
    return {
      english: Object.keys(this.mergedDictionary.english).length,
      bangla: Object.keys(this.mergedDictionary.bangla).length
    };
  }

  // Export current dictionary
  exportDictionary(): DictionarySource {
    return { ...this.mergedDictionary };
  }

  // Clear all dictionaries except main
  clearCustomDictionaries() {
    this.dictionaries = [];
    this.loadMainDictionary();
  }

  // Validate dictionary structure
  static validateDictionary(dictionary: any): boolean {
    if (!dictionary || typeof dictionary !== 'object') return false;
    if (!dictionary.english || !dictionary.bangla) return false;
    if (typeof dictionary.english !== 'object' || typeof dictionary.bangla !== 'object') return false;
    return true;
  }
}

// Create singleton instance
export const dictionaryManager = new DictionaryManager();

// Helper function to create dictionary entry
export function createDictionaryEntry(
  word: string,
  language: 'en' | 'bn',
  translation: string,
  options: Partial<DictionaryEntry> = {}
): DictionaryEntry {
  return {
    id: `${language}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    word,
    language,
    translation,
    partOfSpeech: options.partOfSpeech || 'noun',
    definition: options.definition || `Translation: ${translation}`,
    synonyms: options.synonyms || null,
    antonyms: options.antonyms || null,
    examples: options.examples || null,
    ...options
  };
}

// Helper function to create dictionary from arrays
export function createDictionaryFromArrays(
  englishWords: Array<{word: string, translation: string, synonyms?: string[], antonyms?: string[], examples?: Array<{english: string, bangla: string}>}>,
  banglaWords: Array<{word: string, translation: string, synonyms?: string[], antonyms?: string[], examples?: Array<{english: string, bangla: string}>}>
): DictionarySource {
  const dictionary: DictionarySource = { english: {}, bangla: {} };

  englishWords.forEach(({word, translation, synonyms, antonyms, examples}) => {
    dictionary.english[word] = createDictionaryEntry(word, 'en', translation, {
      synonyms: synonyms || null,
      antonyms: antonyms || null,
      examples: examples || null
    });
  });

  banglaWords.forEach(({word, translation, synonyms, antonyms, examples}) => {
    dictionary.bangla[word] = createDictionaryEntry(word, 'bn', translation, {
      synonyms: synonyms || null,
      antonyms: antonyms || null,
      examples: examples || null
    });
  });

  return dictionary;
}