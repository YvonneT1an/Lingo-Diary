import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhraseSchema, updatePhraseSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: `You are a translation assistant. Translate the following Chinese diary entry into casual, natural American English. 
The tone should sound like a young professional talking to a friend — relaxed, warm, and conversational. 
Use common American slang and idioms where appropriate, but keep it natural and not forced.
Only output the English translation, nothing else. Do not add any commentary, explanation, or notes.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_completion_tokens: 8192,
      });

      const translation = response.choices[0]?.message?.content;
      if (!translation) {
        return res.status(500).json({ message: "Translation returned empty. Please try again." });
      }
      res.json({ translation });
    } catch (error: any) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Translation failed. Please try again." });
    }
  });

  // Phrase CRUD endpoints
  app.get("/api/phrases", async (_req, res) => {
    const q = _req.query.q as string | undefined;
    if (q && q.trim()) {
      const results = await storage.searchPhrases(q.trim());
      return res.json(results);
    }
    const all = await storage.getAllPhrases();
    res.json(all);
  });

  app.get("/api/phrases/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const phrase = await storage.getPhrase(id);
    if (!phrase) return res.status(404).json({ message: "Phrase not found" });
    res.json(phrase);
  });

  app.post("/api/phrases", async (req, res) => {
    const parsed = insertPhraseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: fromError(parsed.error).toString() });
    }
    const phrase = await storage.createPhrase(parsed.data);
    res.status(201).json(phrase);
  });

  app.patch("/api/phrases/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const parsed = updatePhraseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: fromError(parsed.error).toString() });
    }

    const updated = await storage.updatePhrase(id, parsed.data);
    if (!updated) return res.status(404).json({ message: "Phrase not found" });
    res.json(updated);
  });

  app.delete("/api/phrases/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const deleted = await storage.deletePhrase(id);
    if (!deleted) return res.status(404).json({ message: "Phrase not found" });
    res.status(204).send();
  });

  return httpServer;
}
