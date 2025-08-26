// This file contains utility functions for dictionary operations
// In a real application, this might connect to external APIs or local databases

export interface DictionaryWord {
  id: string;
  word: string;
  language: 'en' | 'bn';
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  definition?: string;
  synonyms?: string[];
  antonyms?: string[];
  examples?: Array<{
    english: string;
    bangla: string;
  }>;
}

// Common English words for suggestions
export const commonEnglishWords = [
  'hello', 'goodbye', 'thank', 'please', 'sorry', 'help', 'water', 'food', 'home', 'family',
  'friend', 'love', 'happy', 'sad', 'good', 'bad', 'big', 'small', 'hot', 'cold',
  'book', 'read', 'write', 'learn', 'school', 'work', 'money', 'time', 'day', 'night'
];

// Common Bangla words for suggestions
export const commonBanglaWords = [
  'হ্যালো', 'বিদায়', 'ধন্যবাদ', 'দয়া', 'দুঃখিত', 'সাহায্য', 'পানি', 'খাবার', 'বাড়ি', 'পরিবার',
  'বন্ধু', 'ভালোবাসা', 'খুশি', 'দুঃখ', 'ভালো', 'খারাপ', 'বড়', 'ছোট', 'গরম', 'ঠান্ডা',
  'বই', 'পড়া', 'লেখা', 'শেখা', 'স্কুল', 'কাজ', 'টাকা', 'সময়', 'দিন', 'রাত'
];

export function getSuggestions(query: string, language: 'en' | 'bn', limit = 5): string[] {
  const words = language === 'en' ? commonEnglishWords : commonBanglaWords;
  
  return words
    .filter(word => word.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
}

export function isValidBanglaText(text: string): boolean {
  // Basic check for Bangla unicode range
  const banglaRange = /[\u0980-\u09FF]/;
  return banglaRange.test(text);
}

export function isValidEnglishText(text: string): boolean {
  // Basic check for English characters
  const englishRange = /[a-zA-Z]/;
  return englishRange.test(text);
}

export function detectLanguage(text: string): 'en' | 'bn' | 'unknown' {
  if (isValidBanglaText(text)) return 'bn';
  if (isValidEnglishText(text)) return 'en';
  return 'unknown';
}
