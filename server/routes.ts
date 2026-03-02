import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhraseSchema, updatePhraseSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
