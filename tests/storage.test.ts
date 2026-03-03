import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../server/db";
import { phrases } from "@shared/schema";
import { eq } from "drizzle-orm";
import { DatabaseStorage } from "../server/storage";

const storage = new DatabaseStorage();
let createdIds: number[] = [];

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(phrases).where(eq(phrases.id, id));
  }
});

describe("DatabaseStorage", () => {
  describe("createPhrase", () => {
    it("creates a phrase and returns it with an id", async () => {
      const phrase = await storage.createPhrase({
        english: "test phrase one",
        chinese: "测试短语一",
        explanation: "A test phrase",
      });
      createdIds.push(phrase.id);
      expect(phrase.id).toBeDefined();
      expect(phrase.english).toBe("test phrase one");
      expect(phrase.chinese).toBe("测试短语一");
      expect(phrase.dateAdded).toBeInstanceOf(Date);
    });

    it("creates a phrase with only required fields", async () => {
      const phrase = await storage.createPhrase({
        english: "minimal phrase",
      });
      createdIds.push(phrase.id);
      expect(phrase.english).toBe("minimal phrase");
      expect(phrase.chinese).toBeNull();
      expect(phrase.explanation).toBeNull();
    });
  });

  describe("getPhrase", () => {
    it("returns a phrase by id", async () => {
      const created = await storage.createPhrase({
        english: "find me",
        chinese: "找我",
      });
      createdIds.push(created.id);
      const found = await storage.getPhrase(created.id);
      expect(found).toBeDefined();
      expect(found!.english).toBe("find me");
    });

    it("returns undefined for non-existent id", async () => {
      const result = await storage.getPhrase(999999);
      expect(result).toBeUndefined();
    });
  });

  describe("getAllPhrases", () => {
    it("returns an array of phrases including seeded data", async () => {
      const seeded = await storage.createPhrase({ english: "all phrases test" });
      createdIds.push(seeded.id);
      const all = await storage.getAllPhrases();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThanOrEqual(1);
      expect(all.some((p) => p.id === seeded.id)).toBe(true);
    });
  });

  describe("searchPhrases", () => {
    it("finds phrases matching english text", async () => {
      const phrase = await storage.createPhrase({
        english: "uniquesearchterm123",
        chinese: "独特搜索",
      });
      createdIds.push(phrase.id);
      const results = await storage.searchPhrases("uniquesearchterm123");
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].english).toBe("uniquesearchterm123");
    });

    it("finds phrases matching chinese text", async () => {
      const phrase = await storage.createPhrase({
        english: "something",
        chinese: "独特中文词汇xyz",
      });
      createdIds.push(phrase.id);
      const results = await storage.searchPhrases("独特中文词汇xyz");
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it("returns empty array for no matches", async () => {
      const results = await storage.searchPhrases(
        "zzznonexistentzzzxxx999",
      );
      expect(results).toEqual([]);
    });
  });

  describe("updatePhrase", () => {
    it("updates specific fields of a phrase", async () => {
      const created = await storage.createPhrase({
        english: "before update",
        chinese: "更新前",
      });
      createdIds.push(created.id);
      const updated = await storage.updatePhrase(created.id, {
        english: "after update",
        explanation: "newly added",
      });
      expect(updated).toBeDefined();
      expect(updated!.english).toBe("after update");
      expect(updated!.explanation).toBe("newly added");
      expect(updated!.chinese).toBe("更新前");
    });

    it("returns undefined for non-existent id", async () => {
      const result = await storage.updatePhrase(999999, {
        english: "nope",
      });
      expect(result).toBeUndefined();
    });
  });

  describe("deletePhrase", () => {
    it("deletes an existing phrase and returns true", async () => {
      const created = await storage.createPhrase({
        english: "to be deleted",
      });
      const result = await storage.deletePhrase(created.id);
      expect(result).toBe(true);
      const found = await storage.getPhrase(created.id);
      expect(found).toBeUndefined();
    });

    it("returns false for non-existent id", async () => {
      const result = await storage.deletePhrase(999999);
      expect(result).toBe(false);
    });
  });
});
