import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dictionaryEntries = pgTable("dictionary_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  word: text("word").notNull(),
  language: text("language").notNull(), // 'en' or 'bn'
  translation: text("translation").notNull(),
  partOfSpeech: text("part_of_speech"),
  definition: text("definition"),
  synonyms: jsonb("synonyms").$type<string[]>().default([]),
  antonyms: jsonb("antonyms").$type<string[]>().default([]),
  examples: jsonb("examples").$type<Array<{ english: string; bangla: string }>>().default([]),
});

export const customWords = pgTable("custom_words", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  englishWord: text("english_word").notNull(),
  banglaTranslation: text("bangla_translation").notNull(),
  definition: text("definition"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const prayerSettings = pgTable("prayer_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  enabled: boolean("enabled").default(false),
  fajrEnabled: boolean("fajr_enabled").default(false),
  fajrStart: text("fajr_start").default("05:00"),
  fajrEnd: text("fajr_end").default("05:30"),
  dhuhrEnabled: boolean("dhuhr_enabled").default(false),
  dhuhrStart: text("dhuhr_start").default("12:30"),
  dhuhrEnd: text("dhuhr_end").default("13:00"),
  asrEnabled: boolean("asr_enabled").default(false),
  asrStart: text("asr_start").default("16:00"),
  asrEnd: text("asr_end").default("16:30"),
  maghribEnabled: boolean("maghrib_enabled").default(false),
  maghribStart: text("maghrib_start").default("18:45"),
  maghribEnd: text("maghrib_end").default("19:15"),
  ishaEnabled: boolean("isha_enabled").default(false),
  ishaStart: text("isha_start").default("20:30"),
  ishaEnd: text("isha_end").default("21:00"),
});

export const offlinePackages = pgTable("offline_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  size: text("size").notNull(),
  type: text("type").notNull(), // 'free', 'premium', 'specialized'
  isDownloaded: boolean("is_downloaded").default(false),
  downloadedAt: timestamp("downloaded_at"),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  theme: text("theme").default("light"),
  currentLanguage: text("current_language").default("en"), // 'en' or 'bn'
});

export const insertDictionaryEntrySchema = createInsertSchema(dictionaryEntries).omit({
  id: true,
});

export const insertCustomWordSchema = createInsertSchema(customWords).omit({
  id: true,
  createdAt: true,
});

export const insertPrayerSettingsSchema = createInsertSchema(prayerSettings).omit({
  id: true,
});

export const insertOfflinePackageSchema = createInsertSchema(offlinePackages).omit({
  id: true,
  downloadedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type DictionaryEntry = typeof dictionaryEntries.$inferSelect;
export type InsertDictionaryEntry = z.infer<typeof insertDictionaryEntrySchema>;
export type CustomWord = typeof customWords.$inferSelect;
export type InsertCustomWord = z.infer<typeof insertCustomWordSchema>;
export type PrayerSettings = typeof prayerSettings.$inferSelect;
export type InsertPrayerSettings = z.infer<typeof insertPrayerSettingsSchema>;
export type OfflinePackage = typeof offlinePackages.$inferSelect;
export type InsertOfflinePackage = z.infer<typeof insertOfflinePackageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
