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

// Generate comprehensive English word list
const generateEnglishWords = (): string[] => {
  const categories = {
    greetings: ['hello', 'hi', 'goodbye', 'bye', 'welcome', 'farewell', 'greetings', 'salutations'],
    emotions: ['happy', 'sad', 'angry', 'excited', 'tired', 'relaxed', 'worried', 'calm', 'nervous', 'confident'],
    family: ['family', 'mother', 'father', 'brother', 'sister', 'son', 'daughter', 'grandmother', 'grandfather', 'aunt', 'uncle'],
    food: ['food', 'water', 'bread', 'rice', 'meat', 'fish', 'vegetables', 'fruit', 'milk', 'coffee', 'tea', 'sugar', 'salt'],
    animals: ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'chicken', 'lion', 'tiger', 'elephant', 'monkey', 'snake'],
    colors: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown', 'gray', 'gold'],
    numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'twenty', 'hundred'],
    time: ['time', 'day', 'night', 'morning', 'afternoon', 'evening', 'week', 'month', 'year', 'hour', 'minute', 'second'],
    places: ['home', 'school', 'office', 'hospital', 'restaurant', 'park', 'market', 'bank', 'library', 'church', 'temple'],
    actions: ['run', 'walk', 'eat', 'drink', 'sleep', 'work', 'study', 'play', 'write', 'read', 'speak', 'listen']
  };

  return Object.values(categories).flat();
};

// Generate comprehensive Bangla word list
const generateBanglaWords = (): string[] => {
  const categories = {
    greetings: ['হ্যালো', 'নমস্কার', 'বিদায়', 'স্বাগতম', 'ধন্যবাদ', 'দয়া', 'কেমন', 'ভালো'],
    emotions: ['খুশি', 'দুঃখ', 'রাগ', 'উত্তেজিত', 'ক্লান্ত', 'আরামদায়ক', 'চিন্তিত', 'শান্ত', 'নার্ভাস', 'আত্মবিশ্বাসী'],
    family: ['পরিবার', 'মা', 'বাবা', 'ভাই', 'বোন', 'ছেলে', 'মেয়ে', 'দাদী', 'দাদু', 'খালা', 'মামা'],
    food: ['খাবার', 'পানি', 'রুটি', 'ভাত', 'মাংস', 'মাছ', 'সবজি', 'ফল', 'দুধ', 'কফি', 'চা', 'চিনি', 'লবণ'],
    animals: ['কুকুর', 'বিড়াল', 'পাখি', 'মাছ', 'ঘোড়া', 'গরু', 'মুরগি', 'সিংহ', 'বাঘ', 'হাতি', 'বানর', 'সাপ'],
    colors: ['লাল', 'নীল', 'সবুজ', 'হলুদ', 'কালো', 'সাদা', 'কমলা', 'বেগুনি', 'গোলাপি', 'বাদামি', 'ধূসর', 'সোনালি'],
    numbers: ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'বিশ', 'শত'],
    time: ['সময়', 'দিন', 'রাত', 'সকাল', 'বিকাল', 'সন্ধ্যা', 'সপ্তাহ', 'মাস', 'বছর', 'ঘণ্টা', 'মিনিট', 'সেকেন্ড'],
    places: ['বাড়ি', 'স্কুল', 'অফিস', 'হাসপাতাল', 'রেস্টুরেন্ট', 'পার্ক', 'বাজার', 'ব্যাংক', 'লাইব্রেরি', 'মন্দির'],
    actions: ['দৌড়ানো', 'হাঁটা', 'খাওয়া', 'পান করা', 'ঘুমানো', 'কাজ', 'পড়া', 'খেলা', 'লেখা', 'পড়া', 'কথা বলা', 'শোনা']
  };

  return Object.values(categories).flat();
};

// Common English words for suggestions (expanded)
export const commonEnglishWords = generateEnglishWords();

// Common Bangla words for suggestions (expanded)
export const commonBanglaWords = generateBanglaWords();

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
