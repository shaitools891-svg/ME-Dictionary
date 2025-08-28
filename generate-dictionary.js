#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive word lists for different categories
const wordCategories = {
  english: {
    greetings: {
      words: ['hello', 'hi', 'goodbye', 'bye', 'welcome', 'farewell', 'greetings', 'salutations', 'cheerio', 'hiya'],
      translations: ['হ্যালো', 'হাই', 'বিদায়', 'বাই', 'স্বাগতম', 'বিদায়', 'অভিবাদন', 'সম্ভাষণ', 'চেরিও', 'হাইয়া']
    },
    emotions: {
      words: ['happy', 'sad', 'angry', 'excited', 'tired', 'relaxed', 'worried', 'calm', 'nervous', 'confident', 'joyful', 'depressed', 'anxious', 'peaceful', 'frustrated', 'content', 'overjoyed', 'melancholy', 'furious', 'serene'],
      translations: ['খুশি', 'দুঃখিত', 'রাগান্বিত', 'উত্তেজিত', 'ক্লান্ত', 'আরামদায়ক', 'চিন্তিত', 'শান্ত', 'নার্ভাস', 'আত্মবিশ্বাসী', 'আনন্দিত', 'বিষণ্ণ', 'উদ্বিগ্ন', 'শান্তিপূর্ণ', 'হতাশ', 'সন্তুষ্ট', 'আত্মহারা', 'বিষণ্ণ', 'ক্রুদ্ধ', 'প্রশান্ত']
    },
    family: {
      words: ['family', 'mother', 'father', 'brother', 'sister', 'son', 'daughter', 'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'parent', 'child', 'spouse', 'husband', 'wife', 'grandchild', 'niece', 'nephew'],
      translations: ['পরিবার', 'মা', 'বাবা', 'ভাই', 'বোন', 'ছেলে', 'মেয়ে', 'দাদী', 'দাদু', 'খালা', 'মামা', 'চাচাতো ভাই', 'পিতামাতা', 'সন্তান', 'স্বামী/স্ত্রী', 'স্বামী', 'স্ত্রী', 'নাতি/নাতনি', 'ভাতিজি', 'ভাতিজা']
    },
    food: {
      words: ['food', 'water', 'bread', 'rice', 'meat', 'fish', 'vegetables', 'fruit', 'milk', 'coffee', 'tea', 'sugar', 'salt', 'butter', 'cheese', 'egg', 'chicken', 'beef', 'pork', 'lamb'],
      translations: ['খাবার', 'পানি', 'রুটি', 'ভাত', 'মাংস', 'মাছ', 'সবজি', 'ফল', 'দুধ', 'কফি', 'চা', 'চিনি', 'লবণ', 'মাখন', 'পনির', 'ডিম', 'মুরগি', 'গরুর মাংস', 'শূকরের মাংস', 'খাসির মাংস']
    },
    animals: {
      words: ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'chicken', 'lion', 'tiger', 'elephant', 'monkey', 'snake', 'rabbit', 'duck', 'goat', 'sheep', 'pig', 'bear', 'wolf', 'fox'],
      translations: ['কুকুর', 'বিড়াল', 'পাখি', 'মাছ', 'ঘোড়া', 'গরু', 'মুরগি', 'সিংহ', 'বাঘ', 'হাতি', 'বানর', 'সাপ', 'খরগোশ', 'হাঁস', 'ছাগল', 'ভেড়া', 'শূকর', 'ভালুক', 'নেকড়ে', 'শিয়াল']
    },
    colors: {
      words: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown', 'gray', 'gold', 'silver', 'violet', 'indigo', 'maroon', 'turquoise', 'lavender', 'crimson', 'azure'],
      translations: ['লাল', 'নীল', 'সবুজ', 'হলুদ', 'কালো', 'সাদা', 'কমলা', 'বেগুনি', 'গোলাপি', 'বাদামি', 'ধূসর', 'সোনালি', 'রূপালি', 'বেগুনি', 'নীলাভ', 'গাঢ় লাল', 'ফিরোজা', 'ল্যাভেন্ডার', 'রক্তবর্ণ', 'আকাশ নীল']
    },
    numbers: {
      words: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'hundred', 'thousand', 'million', 'billion', 'first', 'second'],
      translations: ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'শত', 'হাজার', 'মিলিয়ন', 'বিলিয়ন', 'প্রথম', 'দ্বিতীয়']
    },
    time: {
      words: ['time', 'day', 'night', 'morning', 'afternoon', 'evening', 'week', 'month', 'year', 'hour', 'minute', 'second', 'today', 'tomorrow', 'yesterday', 'now', 'then', 'soon', 'later', 'before'],
      translations: ['সময়', 'দিন', 'রাত', 'সকাল', 'বিকাল', 'সন্ধ্যা', 'সপ্তাহ', 'মাস', 'বছর', 'ঘণ্টা', 'মিনিট', 'সেকেন্ড', 'আজ', 'কাল', 'গতকাল', 'এখন', 'তখন', 'শীঘ্রই', 'পরে', 'আগে']
    },
    places: {
      words: ['home', 'school', 'office', 'hospital', 'restaurant', 'park', 'market', 'bank', 'library', 'church', 'temple', 'mosque', 'airport', 'station', 'hotel', 'mall', 'store', 'factory', 'farm', 'garden'],
      translations: ['বাড়ি', 'স্কুল', 'অফিস', 'হাসপাতাল', 'রেস্টুরেন্ট', 'পার্ক', 'বাজার', 'ব্যাংক', 'লাইব্রেরি', 'গির্জা', 'মন্দির', 'মসজিদ', 'বিমানবন্দর', 'স্টেশন', 'হোটেল', 'মল', 'দোকান', 'কারখানা', 'খামার', 'বাগান']
    },
    actions: {
      words: ['run', 'walk', 'eat', 'drink', 'sleep', 'work', 'study', 'play', 'write', 'read', 'speak', 'listen', 'see', 'hear', 'touch', 'smell', 'taste', 'buy', 'sell', 'give'],
      translations: ['দৌড়ানো', 'হাঁটা', 'খাওয়া', 'পান করা', 'ঘুমানো', 'কাজ করা', 'পড়া', 'খেলা', 'লেখা', 'পড়া', 'কথা বলা', 'শোনা', 'দেখা', 'শোনা', 'স্পর্শ করা', 'গন্ধ নেওয়া', 'স্বাদ নেওয়া', 'কেনা', 'বিক্রি করা', 'দেওয়া']
    },
    adjectives: {
      words: ['big', 'small', 'good', 'bad', 'hot', 'cold', 'fast', 'slow', 'new', 'old', 'beautiful', 'ugly', 'rich', 'poor', 'clean', 'dirty', 'easy', 'difficult', 'young', 'old'],
      translations: ['বড়', 'ছোট', 'ভালো', 'খারাপ', 'গরম', 'ঠান্ডা', 'দ্রুত', 'ধীর', 'নতুন', 'পুরানো', 'সুন্দর', 'কুৎসিত', 'ধনী', 'গরিব', 'পরিষ্কার', 'নোংরা', 'সহজ', 'কঠিন', 'যুবক', 'বৃদ্ধ']
    },
    professions: {
      words: ['doctor', 'teacher', 'engineer', 'lawyer', 'nurse', 'police', 'firefighter', 'chef', 'driver', 'farmer', 'student', 'manager', 'scientist', 'artist', 'musician', 'writer', 'actor', 'pilot', 'soldier', 'president'],
      translations: ['ডাক্তার', 'শিক্ষক', 'ইঞ্জিনিয়ার', 'আইনজীবী', 'নার্স', 'পুলিশ', 'ফায়ার ফাইটার', 'রাঁধুনি', 'চালক', 'কৃষক', 'ছাত্র', 'ম্যানেজার', 'বিজ্ঞানী', 'শিল্পী', 'সংগীতজ্ঞ', 'লেখক', 'অভিনেতা', 'পাইলট', 'সৈনিক', 'রাষ্ট্রপতি']
    }
  },
  bangla: {
    greetings: {
      words: ['হ্যালো', 'নমস্কার', 'বিদায়', 'স্বাগতম', 'ধন্যবাদ', 'দয়া', 'কেমন', 'ভালো', 'আসসালামু', 'ওয়ালাইকুম'],
      translations: ['hello', 'greetings', 'goodbye', 'welcome', 'thank you', 'mercy', 'how', 'good', 'peace be upon you', 'and upon you peace']
    },
    emotions: {
      words: ['খুশি', 'দুঃখ', 'রাগ', 'উত্তেজিত', 'ক্লান্ত', 'আরামদায়ক', 'চিন্তিত', 'শান্ত', 'নার্ভাস', 'আত্মবিশ্বাসী', 'আনন্দিত', 'বিষণ্ণ', 'উদ্বিগ্ন', 'শান্তিপূর্ণ', 'হতাশ', 'সন্তুষ্ট'],
      translations: ['happy', 'sad', 'angry', 'excited', 'tired', 'relaxed', 'worried', 'calm', 'nervous', 'confident', 'joyful', 'depressed', 'anxious', 'peaceful', 'frustrated', 'content']
    },
    family: {
      words: ['পরিবার', 'মা', 'বাবা', 'ভাই', 'বোন', 'ছেলে', 'মেয়ে', 'দাদী', 'দাদু', 'খালা', 'মামা', 'চাচাতো', 'পিতামাতা', 'সন্তান', 'স্বামী', 'স্ত্রী', 'নাতি', 'নাতনি', 'ভাতিজি', 'ভাতিজা'],
      translations: ['family', 'mother', 'father', 'brother', 'sister', 'son', 'daughter', 'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'parents', 'child', 'husband', 'wife', 'grandson', 'granddaughter', 'niece', 'nephew']
    },
    food: {
      words: ['খাবার', 'পানি', 'রুটি', 'ভাত', 'মাংস', 'মাছ', 'সবজি', 'ফল', 'দুধ', 'কফি', 'চা', 'চিনি', 'লবণ', 'মাখন', 'পনির', 'ডিম', 'মুরগি', 'গরু', 'শূকর', 'খাসি'],
      translations: ['food', 'water', 'bread', 'rice', 'meat', 'fish', 'vegetables', 'fruit', 'milk', 'coffee', 'tea', 'sugar', 'salt', 'butter', 'cheese', 'egg', 'chicken', 'beef', 'pork', 'lamb']
    },
    animals: {
      words: ['কুকুর', 'বিড়াল', 'পাখি', 'মাছ', 'ঘোড়া', 'গরু', 'মুরগি', 'সিংহ', 'বাঘ', 'হাতি', 'বানর', 'সাপ', 'খরগোশ', 'হাঁস', 'ছাগল', 'ভেড়া', 'শূকর', 'ভালুক', 'নেকড়ে', 'শিয়াল'],
      translations: ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'chicken', 'lion', 'tiger', 'elephant', 'monkey', 'snake', 'rabbit', 'duck', 'goat', 'sheep', 'pig', 'bear', 'wolf', 'fox']
    },
    colors: {
      words: ['লাল', 'নীল', 'সবুজ', 'হলুদ', 'কালো', 'সাদা', 'কমলা', 'বেগুনি', 'গোলাপি', 'বাদামি', 'ধূসর', 'সোনালি', 'রূপালি', 'নীলাভ', 'ইন্ডিগো', 'মেরুন', 'ফিরোজা', 'ল্যাভেন্ডার', 'রক্তবর্ণ', 'আজুর'],
      translations: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'brown', 'gray', 'gold', 'silver', 'violet', 'indigo', 'maroon', 'turquoise', 'lavender', 'crimson', 'azure']
    },
    numbers: {
      words: ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'শত', 'হাজার', 'লাখ', 'কোটি', 'প্রথম', 'দ্বিতীয়'],
      translations: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'hundred', 'thousand', 'million', 'billion', 'first', 'second']
    },
    time: {
      words: ['সময়', 'দিন', 'রাত', 'সকাল', 'বিকাল', 'সন্ধ্যা', 'সপ্তাহ', 'মাস', 'বছর', 'ঘণ্টা', 'মিনিট', 'সেকেন্ড', 'আজ', 'কাল', 'গতকাল', 'এখন', 'তখন', 'শীঘ্রই', 'পরে', 'আগে'],
      translations: ['time', 'day', 'night', 'morning', 'afternoon', 'evening', 'week', 'month', 'year', 'hour', 'minute', 'second', 'today', 'tomorrow', 'yesterday', 'now', 'then', 'soon', 'later', 'before']
    },
    places: {
      words: ['বাড়ি', 'স্কুল', 'অফিস', 'হাসপাতাল', 'রেস্টুরেন্ট', 'পার্ক', 'বাজার', 'ব্যাংক', 'লাইব্রেরি', 'মসজিদ', 'মন্দির', 'গির্জা', 'বিমানবন্দর', 'স্টেশন', 'হোটেল', 'মল', 'দোকান', 'কারখানা', 'খামার', 'বাগান'],
      translations: ['home', 'school', 'office', 'hospital', 'restaurant', 'park', 'market', 'bank', 'library', 'mosque', 'temple', 'church', 'airport', 'station', 'hotel', 'mall', 'store', 'factory', 'farm', 'garden']
    },
    actions: {
      words: ['দৌড়ানো', 'হাঁটা', 'খাওয়া', 'পান করা', 'ঘুমানো', 'কাজ করা', 'পড়া', 'খেলা', 'লেখা', 'পড়া', 'কথা বলা', 'শোনা', 'দেখা', 'শোনা', 'স্পর্শ করা', 'গন্ধ নেওয়া', 'স্বাদ নেওয়া', 'কেনা', 'বিক্রি করা', 'দেওয়া'],
      translations: ['run', 'walk', 'eat', 'drink', 'sleep', 'work', 'study', 'play', 'write', 'read', 'speak', 'listen', 'see', 'hear', 'touch', 'smell', 'taste', 'buy', 'sell', 'give']
    },
    adjectives: {
      words: ['বড়', 'ছোট', 'ভালো', 'খারাপ', 'গরম', 'ঠান্ডা', 'দ্রুত', 'ধীর', 'নতুন', 'পুরানো', 'সুন্দর', 'কুৎসিত', 'ধনী', 'গরিব', 'পরিষ্কার', 'নোংরা', 'সহজ', 'কঠিন', 'যুবক', 'বৃদ্ধ'],
      translations: ['big', 'small', 'good', 'bad', 'hot', 'cold', 'fast', 'slow', 'new', 'old', 'beautiful', 'ugly', 'rich', 'poor', 'clean', 'dirty', 'easy', 'difficult', 'young', 'old']
    },
    professions: {
      words: ['ডাক্তার', 'শিক্ষক', 'ইঞ্জিনিয়ার', 'আইনজীবী', 'নার্স', 'পুলিশ', 'ফায়ার ফাইটার', 'রাঁধুনি', 'চালক', 'কৃষক', 'ছাত্র', 'ম্যানেজার', 'বিজ্ঞানী', 'শিল্পী', 'সংগীতজ্ঞ', 'লেখক', 'অভিনেতা', 'পাইলট', 'সৈনিক', 'রাষ্ট্রপতি'],
      translations: ['doctor', 'teacher', 'engineer', 'lawyer', 'nurse', 'police', 'firefighter', 'chef', 'driver', 'farmer', 'student', 'manager', 'scientist', 'artist', 'musician', 'writer', 'actor', 'pilot', 'soldier', 'president']
    }
  }
};

// Generate synonyms and antonyms for words
function generateSynonyms(word, language) {
  const synonymMap = {
    en: {
      happy: ['joyful', 'pleased', 'content', 'delighted'],
      sad: ['unhappy', 'sorrowful', 'depressed', 'gloomy'],
      big: ['large', 'huge', 'enormous', 'gigantic'],
      small: ['little', 'tiny', 'miniature', 'petite'],
      good: ['excellent', 'great', 'wonderful', 'fine'],
      bad: ['terrible', 'awful', 'horrible', 'poor'],
      fast: ['quick', 'rapid', 'swift', 'speedy'],
      slow: ['sluggish', 'lethargic', 'gradual', 'unhurried'],
      hot: ['warm', 'scorching', 'boiling', 'sultry'],
      cold: ['cool', 'chilly', 'freezing', 'icy']
    },
    bn: {
      খুশি: ['আনন্দিত', 'সন্তুষ্ট', 'প্রফুল্ল', 'উল্লসিত'],
      দুঃখ: ['বিষণ্ণ', 'খেদ', 'শোক', 'অনুতাপ'],
      বড়: ['বিশাল', 'প্রকাণ্ড', 'মহৎ', 'গগনচুম্বী'],
      ছোট: ['ক্ষুদ্র', 'সূক্ষ্ম', 'নগণ্য', 'তুচ্ছ'],
      ভালো: ['উত্তম', 'সুন্দর', 'প্রশংসনীয়', 'মহৎ'],
      খারাপ: ['নিকৃষ্ট', 'জঘন্য', 'ভয়ানক', 'অনিষ্টকর'],
      দ্রুত: ['ত্বরিত', 'ক্ষিপ্র', 'বেগবান', 'জোরকদমে'],
      ধীর: ['মন্থর', 'আলস্যপূর্ণ', 'ক্রমশ', 'অনুজ্ঞ'],
      গরম: ['উষ্ণ', 'তপ্ত', 'দাহক', 'উত্তপ্ত'],
      ঠান্ডা: ['শীতল', 'হিম', 'শীতাতুর', 'হিমশীতল']
    }
  };
  return synonymMap[language]?.[word] || [];
}

function generateAntonyms(word, language) {
  const antonymMap = {
    en: {
      happy: ['sad', 'unhappy', 'miserable', 'depressed'],
      sad: ['happy', 'joyful', 'cheerful', 'glad'],
      big: ['small', 'little', 'tiny', 'miniature'],
      small: ['big', 'large', 'huge', 'enormous'],
      good: ['bad', 'terrible', 'awful', 'poor'],
      bad: ['good', 'excellent', 'great', 'wonderful'],
      fast: ['slow', 'sluggish', 'gradual', 'lethargic'],
      slow: ['fast', 'quick', 'rapid', 'swift'],
      hot: ['cold', 'cool', 'chilly', 'freezing'],
      cold: ['hot', 'warm', 'scorching', 'boiling']
    },
    bn: {
      খুশি: ['দুঃখ', 'বিষণ্ণ', 'খেদজনক', 'অনুতাপ'],
      দুঃখ: ['খুশি', 'আনন্দ', 'প্রফুল্ল', 'উল্লসিত'],
      বড়: ['ছোট', 'ক্ষুদ্র', 'সূক্ষ্ম', 'নগণ্য'],
      ছোট: ['বড়', 'বিশাল', 'প্রকাণ্ড', 'মহৎ'],
      ভালো: ['খারাপ', 'নিকৃষ্ট', 'জঘন্য', 'ভয়ানক'],
      খারাপ: ['ভালো', 'উত্তম', 'সুন্দর', 'প্রশংসনীয়'],
      দ্রুত: ['ধীর', 'মন্থর', 'আলস্যপূর্ণ', 'ক্রমশ'],
      ধীর: ['দ্রুত', 'ত্বরিত', 'ক্ষিপ্র', 'বেগবান'],
      গরম: ['ঠান্ডা', 'শীতল', 'হিম', 'শীতাতুর'],
      ঠান্ডা: ['গরম', 'উষ্ণ', 'তপ্ত', 'দাহক']
    }
  };
  return antonymMap[language]?.[word] || [];
}

// Generate example sentences
function generateExamples(word, translation, language) {
  const examples = [];

  if (language === 'en') {
    examples.push(
      { english: `I am very ${word}.`, bangla: `আমি খুব ${translation}।` },
      { english: `She looks ${word} today.`, bangla: `আজ তিনি ${translation} দেখাচ্ছেন।` },
      { english: `This is a ${word} day.`, bangla: `এটা একটা ${translation} দিন।` }
    );
  } else {
    examples.push(
      { english: `I am very ${translation}.`, bangla: `আমি খুব ${word}।` },
      { english: `She looks ${translation} today.`, bangla: `আজ তিনি ${word} দেখাচ্ছেন।` },
      { english: `This is a ${translation} day.`, bangla: `এটা একটা ${word} দিন।` }
    );
  }

  return examples;
}

// Generate part of speech
function generatePartOfSpeech(word, language) {
  const posMap = {
    en: {
      // Common nouns
      family: 'noun', mother: 'noun', father: 'noun', brother: 'noun', sister: 'noun',
      food: 'noun', water: 'noun', bread: 'noun', rice: 'noun', meat: 'noun',
      dog: 'noun', cat: 'noun', bird: 'noun', fish: 'noun', horse: 'noun',
      red: 'adjective', blue: 'adjective', green: 'adjective', yellow: 'adjective',
      happy: 'adjective', sad: 'adjective', angry: 'adjective', excited: 'adjective',
      run: 'verb', walk: 'verb', eat: 'verb', drink: 'verb', sleep: 'verb',
      hello: 'interjection', goodbye: 'interjection', welcome: 'interjection'
    },
    bn: {
      // Common nouns
      পরিবার: 'noun', মা: 'noun', বাবা: 'noun', ভাই: 'noun', বোন: 'noun',
      খাবার: 'noun', পানি: 'noun', রুটি: 'noun', ভাত: 'noun', মাংস: 'noun',
      কুকুর: 'noun', বিড়াল: 'noun', পাখি: 'noun', মাছ: 'noun', ঘোড়া: 'noun',
      লাল: 'adjective', নীল: 'adjective', সবুজ: 'adjective', হলুদ: 'adjective',
      খুশি: 'adjective', দুঃখ: 'adjective', রাগ: 'adjective', উত্তেজিত: 'adjective',
      দৌড়ানো: 'verb', হাঁটা: 'verb', খাওয়া: 'verb', পান: 'verb', ঘুমানো: 'verb',
      হ্যালো: 'interjection', বিদায়: 'interjection', স্বাগতম: 'interjection'
    }
  };
  return posMap[language]?.[word] || 'noun';
}

// Main function to generate comprehensive dictionary
function generateDictionary() {
  const dictionary = { english: {}, bangla: {} };
  let idCounter = 1;

  // Process English words
  Object.entries(wordCategories.english).forEach(([category, data]) => {
    data.words.forEach((word, index) => {
      const synonyms = generateSynonyms(word, 'en');
      const antonyms = generateAntonyms(word, 'en');
      const examples = generateExamples(word, data.translations[index], 'en');
      const partOfSpeech = generatePartOfSpeech(word, 'en');

      dictionary.english[word] = {
        id: `en-${idCounter++}`,
        word: word,
        language: 'en',
        translation: data.translations[index],
        partOfSpeech: partOfSpeech,
        definition: `A ${category} term meaning ${data.translations[index]}`,
        synonyms: synonyms.length > 0 ? synonyms : null,
        antonyms: antonyms.length > 0 ? antonyms : null,
        examples: examples
      };
    });
  });

  // Process Bangla words
  Object.entries(wordCategories.bangla).forEach(([category, data]) => {
    data.words.forEach((word, index) => {
      const synonyms = generateSynonyms(word, 'bn');
      const antonyms = generateAntonyms(word, 'bn');
      const examples = generateExamples(word, data.translations[index], 'bn');
      const partOfSpeech = generatePartOfSpeech(word, 'bn');

      dictionary.bangla[word] = {
        id: `bn-${idCounter++}`,
        word: word,
        language: 'bn',
        translation: data.translations[index],
        partOfSpeech: partOfSpeech,
        definition: `A ${category} term meaning ${data.translations[index]}`,
        synonyms: synonyms.length > 0 ? synonyms : null,
        antonyms: antonyms.length > 0 ? antonyms : null,
        examples: examples
      };
    });
  });

  return dictionary;
}

// Generate and save the dictionary
const comprehensiveDictionary = generateDictionary();
const outputPath = path.join(__dirname, 'client/src/lib/dictionary-database.json');

fs.writeFileSync(outputPath, JSON.stringify(comprehensiveDictionary, null, 2));

console.log(`✅ Generated comprehensive dictionary with ${Object.keys(comprehensiveDictionary.english).length} English words and ${Object.keys(comprehensiveDictionary.bangla).length} Bangla words`);
console.log(`📁 Saved to: ${outputPath}`);