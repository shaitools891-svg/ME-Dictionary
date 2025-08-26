import { 
  type DictionaryEntry, 
  type InsertDictionaryEntry, 
  type CustomWord, 
  type InsertCustomWord,
  type PrayerSettings,
  type InsertPrayerSettings,
  type OfflinePackage,
  type InsertOfflinePackage,
  type User,
  type InsertUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Dictionary operations
  searchDictionary(query: string, language: 'en' | 'bn'): Promise<DictionaryEntry[]>;
  getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined>;
  
  // Custom words operations
  getCustomWords(userId: string): Promise<CustomWord[]>;
  createCustomWord(word: InsertCustomWord): Promise<CustomWord>;
  updateCustomWord(id: string, word: Partial<CustomWord>): Promise<CustomWord | undefined>;
  deleteCustomWord(id: string): Promise<boolean>;
  
  // Prayer settings operations
  getPrayerSettings(userId: string): Promise<PrayerSettings | undefined>;
  createPrayerSettings(settings: InsertPrayerSettings): Promise<PrayerSettings>;
  updatePrayerSettings(userId: string, settings: Partial<PrayerSettings>): Promise<PrayerSettings | undefined>;
  
  // Offline packages operations
  getOfflinePackages(): Promise<OfflinePackage[]>;
  updateOfflinePackage(id: string, updates: Partial<OfflinePackage>): Promise<OfflinePackage | undefined>;
  
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private dictionaryEntries: Map<string, DictionaryEntry>;
  private customWords: Map<string, CustomWord>;
  private prayerSettings: Map<string, PrayerSettings>;
  private offlinePackages: Map<string, OfflinePackage>;
  private users: Map<string, User>;

  constructor() {
    this.dictionaryEntries = new Map();
    this.customWords = new Map();
    this.prayerSettings = new Map();
    this.offlinePackages = new Map();
    this.users = new Map();

    // Initialize with some dictionary data
    this.initializeDictionaryData();
    this.initializeOfflinePackages();
  }

  private initializeDictionaryData() {
    const entries: Array<Omit<DictionaryEntry, 'id'>> = [
      {
        word: "hello",
        language: "en",
        translation: "হ্যালো, নমস্কার",
        partOfSpeech: "noun, exclamation",
        definition: "Used as a greeting or to begin a phone conversation.",
        synonyms: ["hi", "hey", "greetings"],
        antonyms: ["goodbye", "farewell"],
        examples: [
          { english: "Hello, how are you today?", bangla: "হ্যালো, আজ কেমন আছেন?" },
          { english: "She said hello to everyone at the party.", bangla: "সে পার্টিতে সবাইকে হ্যালো বলেছিল।" }
        ]
      },
      {
        word: "হ্যালো",
        language: "bn",
        translation: "hello",
        partOfSpeech: "noun, exclamation",
        definition: "অভিবাদন বা টেলিফোন কথোপকথন শুরু করার জন্য ব্যবহৃত।",
        synonyms: ["নমস্কার", "সালাম"],
        antonyms: ["বিদায়", "গুড বাই"],
        examples: [
          { english: "Hello, how are you today?", bangla: "হ্যালো, আজ কেমন আছেন?" }
        ]
      },
      {
        word: "book",
        language: "en",
        translation: "বই, বুক",
        partOfSpeech: "noun",
        definition: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
        synonyms: ["volume", "publication", "text"],
        antonyms: [],
        examples: [
          { english: "I read a good book yesterday.", bangla: "আমি গতকাল একটি ভালো বই পড়েছি।" }
        ]
      },
      {
        word: "বই",
        language: "bn",
        translation: "book",
        partOfSpeech: "noun",
        definition: "কাগজের পাতা একসাথে বাঁধানো যার মধ্যে লেখা বা ছবি থাকে।",
        synonyms: ["গ্রন্থ", "পুস্তক"],
        antonyms: [],
        examples: [
          { english: "I read a good book yesterday.", bangla: "আমি গতকাল একটি ভালো বই পড়েছি।" }
        ]
      }
    ];

    entries.forEach(entry => {
      const id = randomUUID();
      this.dictionaryEntries.set(id, { ...entry, id });
    });
  }

  private initializeOfflinePackages() {
    const packages: Array<Omit<OfflinePackage, 'id'>> = [
      {
        name: "Basic English-Bangla",
        description: "10,000+ common words with translations",
        size: "15.2 MB",
        type: "free",
        isDownloaded: false,
        downloadedAt: null
      },
      {
        name: "Advanced Dictionary",
        description: "50,000+ words with synonyms, antonyms",
        size: "45.8 MB",
        type: "premium",
        isDownloaded: false,
        downloadedAt: null
      },
      {
        name: "Technical Terms",
        description: "IT, Engineering & Science vocabulary",
        size: "22.1 MB",
        type: "specialized",
        isDownloaded: false,
        downloadedAt: null
      },
      {
        name: "Essential Vocabulary",
        description: "5,000 most common words",
        size: "8.5 MB",
        type: "free",
        isDownloaded: true,
        downloadedAt: new Date()
      }
    ];

    packages.forEach(pkg => {
      const id = randomUUID();
      this.offlinePackages.set(id, { ...pkg, id });
    });
  }

  async searchDictionary(query: string, language: 'en' | 'bn'): Promise<DictionaryEntry[]> {
    const results = Array.from(this.dictionaryEntries.values())
      .filter(entry => 
        entry.language === language && 
        entry.word.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10); // Limit results
    
    return results;
  }

  async getDictionaryEntry(id: string): Promise<DictionaryEntry | undefined> {
    return this.dictionaryEntries.get(id);
  }

  async getCustomWords(userId: string): Promise<CustomWord[]> {
    return Array.from(this.customWords.values())
      .filter(word => word.userId === userId);
  }

  async createCustomWord(insertWord: InsertCustomWord): Promise<CustomWord> {
    const id = randomUUID();
    const word: CustomWord = { 
      ...insertWord, 
      id,
      createdAt: new Date()
    };
    this.customWords.set(id, word);
    return word;
  }

  async updateCustomWord(id: string, updates: Partial<CustomWord>): Promise<CustomWord | undefined> {
    const existing = this.customWords.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.customWords.set(id, updated);
    return updated;
  }

  async deleteCustomWord(id: string): Promise<boolean> {
    return this.customWords.delete(id);
  }

  async getPrayerSettings(userId: string): Promise<PrayerSettings | undefined> {
    return Array.from(this.prayerSettings.values())
      .find(settings => settings.userId === userId);
  }

  async createPrayerSettings(insertSettings: InsertPrayerSettings): Promise<PrayerSettings> {
    const id = randomUUID();
    const settings: PrayerSettings = { ...insertSettings, id };
    this.prayerSettings.set(id, settings);
    return settings;
  }

  async updatePrayerSettings(userId: string, updates: Partial<PrayerSettings>): Promise<PrayerSettings | undefined> {
    const existing = Array.from(this.prayerSettings.values())
      .find(settings => settings.userId === userId);
    
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.prayerSettings.set(existing.id, updated);
    return updated;
  }

  async getOfflinePackages(): Promise<OfflinePackage[]> {
    return Array.from(this.offlinePackages.values());
  }

  async updateOfflinePackage(id: string, updates: Partial<OfflinePackage>): Promise<OfflinePackage | undefined> {
    const existing = this.offlinePackages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    if (updates.isDownloaded === true && !existing.downloadedAt) {
      updated.downloadedAt = new Date();
    }
    
    this.offlinePackages.set(id, updated);
    return updated;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.users.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
