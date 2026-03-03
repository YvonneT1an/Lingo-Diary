import { describe, it, expect } from "vitest";
import { insertPhraseSchema, updatePhraseSchema } from "@shared/schema";

describe("insertPhraseSchema", () => {
  it("accepts valid phrase with all fields", () => {
    const result = insertPhraseSchema.safeParse({
      english: "hit the sack",
      chinese: "去睡觉",
      explanation: "Informal way to say going to bed",
      context: "I'm exhausted, gonna hit the sack.",
      examples: "I usually hit the sack around 11pm.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.english).toBe("hit the sack");
      expect(result.data.chinese).toBe("去睡觉");
    }
  });

  it("accepts phrase with only required english field", () => {
    const result = insertPhraseSchema.safeParse({
      english: "grab a bite",
    });
    expect(result.success).toBe(true);
  });

  it("rejects phrase without english field", () => {
    const result = insertPhraseSchema.safeParse({
      chinese: "吃点东西",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty english string (no min-length constraint)", () => {
    const result = insertPhraseSchema.safeParse({
      english: "",
    });
    expect(result.success).toBe(true);
  });

  it("strips id and dateAdded fields", () => {
    const result = insertPhraseSchema.safeParse({
      english: "test",
      id: 999,
      dateAdded: new Date(),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect("id" in result.data).toBe(false);
      expect("dateAdded" in result.data).toBe(false);
    }
  });

  it("allows null optional fields", () => {
    const result = insertPhraseSchema.safeParse({
      english: "zonk out",
      chinese: null,
      explanation: null,
      context: null,
      examples: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("updatePhraseSchema", () => {
  it("accepts partial updates", () => {
    const result = updatePhraseSchema.safeParse({
      english: "updated phrase",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.english).toBe("updated phrase");
      expect(result.data.chinese).toBeUndefined();
    }
  });

  it("accepts empty object (no updates)", () => {
    const result = updatePhraseSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts updating only explanation", () => {
    const result = updatePhraseSchema.safeParse({
      explanation: "new explanation",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.explanation).toBe("new explanation");
    }
  });
});
