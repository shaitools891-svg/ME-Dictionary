import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCustomWordSchema, 
  insertPrayerSettingsSchema,
  insertUserSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dictionary routes
  app.get("/api/dictionary/search", async (req, res) => {
    try {
      const { query, language = 'en' } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      
      const results = await storage.searchDictionary(query, language as 'en' | 'bn');
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search dictionary" });
    }
  });

  app.get("/api/dictionary/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getDictionaryEntry(id);
      
      if (!entry) {
        return res.status(404).json({ error: "Dictionary entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dictionary entry" });
    }
  });

  // Custom words routes
  app.get("/api/custom-words/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const words = await storage.getCustomWords(userId);
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: "Failed to get custom words" });
    }
  });

  app.post("/api/custom-words", async (req, res) => {
    try {
      const validatedData = insertCustomWordSchema.parse(req.body);
      const word = await storage.createCustomWord(validatedData);
      res.status(201).json(word);
    } catch (error) {
      res.status(400).json({ error: "Invalid custom word data" });
    }
  });

  app.put("/api/custom-words/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const word = await storage.updateCustomWord(id, req.body);
      
      if (!word) {
        return res.status(404).json({ error: "Custom word not found" });
      }
      
      res.json(word);
    } catch (error) {
      res.status(500).json({ error: "Failed to update custom word" });
    }
  });

  app.delete("/api/custom-words/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCustomWord(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Custom word not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete custom word" });
    }
  });

  // Prayer settings routes
  app.get("/api/prayer-settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getPrayerSettings(userId);
      
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings = await storage.createPrayerSettings({ userId });
        return res.json(defaultSettings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get prayer settings" });
    }
  });

  app.put("/api/prayer-settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.updatePrayerSettings(userId, req.body);
      
      if (!settings) {
        // Create new settings if none exist
        const validatedData = insertPrayerSettingsSchema.parse({ ...req.body, userId });
        const newSettings = await storage.createPrayerSettings(validatedData);
        return res.json(newSettings);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prayer settings" });
    }
  });

  // Offline packages routes
  app.get("/api/offline-packages", async (req, res) => {
    try {
      const packages = await storage.getOfflinePackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get offline packages" });
    }
  });

  app.put("/api/offline-packages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedPackage = await storage.updateOfflinePackage(id, req.body);
      
      if (!updatedPackage) {
        return res.status(404).json({ error: "Offline package not found" });
      }
      
      res.json(updatedPackage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update offline package" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
