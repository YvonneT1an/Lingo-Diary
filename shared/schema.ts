import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const phrases = pgTable("phrases", {
  id: serial("id").primaryKey(),
  english: text("english").notNull(),
  chinese: text("chinese"),
  explanation: text("explanation"),
  context: text("context"),
  examples: text("examples"),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
});

export const insertPhraseSchema = createInsertSchema(phrases).omit({
  id: true,
  dateAdded: true,
});

export const updatePhraseSchema = createInsertSchema(phrases).omit({
  id: true,
  dateAdded: true,
}).partial();

export type InsertPhrase = z.infer<typeof insertPhraseSchema>;
export type UpdatePhrase = z.infer<typeof updatePhraseSchema>;
export type Phrase = typeof phrases.$inferSelect;
