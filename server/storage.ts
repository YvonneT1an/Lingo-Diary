import { phrases, type Phrase, type InsertPhrase, type UpdatePhrase } from "@shared/schema";
import { eq, desc, or, ilike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  getAllPhrases(): Promise<Phrase[]>;
  getPhrase(id: number): Promise<Phrase | undefined>;
  searchPhrases(query: string): Promise<Phrase[]>;
  createPhrase(phrase: InsertPhrase): Promise<Phrase>;
  updatePhrase(id: number, phrase: UpdatePhrase): Promise<Phrase | undefined>;
  deletePhrase(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getAllPhrases(): Promise<Phrase[]> {
    return await db.select().from(phrases).orderBy(desc(phrases.dateAdded));
  }

  async getPhrase(id: number): Promise<Phrase | undefined> {
    const [phrase] = await db.select().from(phrases).where(eq(phrases.id, id));
    return phrase;
  }

  async searchPhrases(query: string): Promise<Phrase[]> {
    const pattern = `%${query}%`;
    return await db
      .select()
      .from(phrases)
      .where(or(ilike(phrases.english, pattern), ilike(phrases.chinese, pattern)))
      .orderBy(desc(phrases.dateAdded));
  }

  async createPhrase(phrase: InsertPhrase): Promise<Phrase> {
    const [created] = await db.insert(phrases).values(phrase).returning();
    return created;
  }

  async updatePhrase(id: number, updates: UpdatePhrase): Promise<Phrase | undefined> {
    const [updated] = await db
      .update(phrases)
      .set(updates)
      .where(eq(phrases.id, id))
      .returning();
    return updated;
  }

  async deletePhrase(id: number): Promise<boolean> {
    const [deleted] = await db.delete(phrases).where(eq(phrases.id, id)).returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();
