import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import express from "express";
import { createServer } from "http";
import request from "supertest";
import type { Phrase, InsertPhrase, UpdatePhrase } from "@shared/schema";
import type { IStorage } from "../server/storage";

const mockPhrases: Phrase[] = [
  {
    id: 1,
    english: "hit the sack",
    chinese: "去睡觉",
    explanation: "Go to bed",
    context: "After a long day",
    examples: "I'm gonna hit the sack early tonight.",
    dateAdded: new Date("2025-01-01"),
  },
  {
    id: 2,
    english: "grab a bite",
    chinese: "吃点东西",
    explanation: "Get something to eat",
    context: null,
    examples: null,
    dateAdded: new Date("2025-01-02"),
  },
];

const mockStorage: IStorage = {
  getAllPhrases: vi.fn().mockResolvedValue(mockPhrases),
  getPhrase: vi.fn().mockImplementation(async (id: number) => {
    return mockPhrases.find((p) => p.id === id);
  }),
  searchPhrases: vi.fn().mockImplementation(async (query: string) => {
    return mockPhrases.filter(
      (p) =>
        p.english.includes(query) || (p.chinese && p.chinese.includes(query)),
    );
  }),
  createPhrase: vi.fn().mockImplementation(async (data: InsertPhrase) => {
    return { id: 3, dateAdded: new Date(), ...data } as Phrase;
  }),
  updatePhrase: vi
    .fn()
    .mockImplementation(async (id: number, data: UpdatePhrase) => {
      const existing = mockPhrases.find((p) => p.id === id);
      if (!existing) return undefined;
      return { ...existing, ...data };
    }),
  deletePhrase: vi.fn().mockImplementation(async (id: number) => {
    return mockPhrases.some((p) => p.id === id);
  }),
};

let mockOpenAICreate = vi.fn().mockResolvedValue({
  choices: [{ message: { content: "Today was super chill." } }],
});

vi.mock("openai", () => {
  const MockOpenAI = function () {
    return {
      chat: {
        completions: {
          get create() {
            return mockOpenAICreate;
          },
        },
      },
    };
  };
  return { default: MockOpenAI };
});

vi.mock("../server/storage", () => ({
  storage: mockStorage,
}));

let app: express.Express;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  const httpServer = createServer(app);
  const { registerRoutes } = await import("../server/routes");
  await registerRoutes(httpServer, app);
});

beforeEach(() => {
  mockOpenAICreate = vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Today was super chill." } }],
  });
  vi.clearAllMocks();
  (mockStorage.getAllPhrases as any).mockResolvedValue(mockPhrases);
  (mockStorage.getPhrase as any).mockImplementation(async (id: number) =>
    mockPhrases.find((p) => p.id === id),
  );
  (mockStorage.searchPhrases as any).mockImplementation(
    async (query: string) =>
      mockPhrases.filter(
        (p) =>
          p.english.includes(query) ||
          (p.chinese && p.chinese.includes(query)),
      ),
  );
  (mockStorage.createPhrase as any).mockImplementation(
    async (data: InsertPhrase) =>
      ({ id: 3, dateAdded: new Date(), ...data }) as Phrase,
  );
  (mockStorage.updatePhrase as any).mockImplementation(
    async (id: number, data: UpdatePhrase) => {
      const existing = mockPhrases.find((p) => p.id === id);
      if (!existing) return undefined;
      return { ...existing, ...data };
    },
  );
  (mockStorage.deletePhrase as any).mockImplementation(async (id: number) =>
    mockPhrases.some((p) => p.id === id),
  );
});

describe("POST /api/translate", () => {
  it("returns 400 when text is missing", async () => {
    const res = await request(app).post("/api/translate").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Text is required");
  });

  it("returns 400 when text is empty string", async () => {
    const res = await request(app).post("/api/translate").send({ text: "   " });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Text is required");
  });

  it("returns 400 when text is not a string", async () => {
    const res = await request(app).post("/api/translate").send({ text: 123 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Text is required");
  });

  it("returns translation for valid Chinese text", async () => {
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "今天很轻松" });
    expect(res.status).toBe(200);
    expect(res.body.translation).toBe("Today was super chill.");
    expect(mockOpenAICreate).toHaveBeenCalled();
  });

  it("returns 500 when OpenAI returns empty content", async () => {
    mockOpenAICreate = vi.fn().mockResolvedValue({
      choices: [{ message: { content: null } }],
    });
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "你好" });
    expect(res.status).toBe(500);
    expect(res.body.message).toContain("empty");
  });

  it("returns 500 when OpenAI throws an error", async () => {
    mockOpenAICreate = vi.fn().mockRejectedValue(new Error("API rate limit"));
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "你好" });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Translation failed. Please try again.");
  });

  it("returns 500 when OpenAI returns no choices", async () => {
    mockOpenAICreate = vi.fn().mockResolvedValue({ choices: [] });
    const res = await request(app)
      .post("/api/translate")
      .send({ text: "你好" });
    expect(res.status).toBe(500);
    expect(res.body.message).toContain("empty");
  });
});

describe("GET /api/phrases", () => {
  it("returns all phrases", async () => {
    const res = await request(app).get("/api/phrases");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(mockStorage.getAllPhrases).toHaveBeenCalled();
  });

  it("searches phrases with query parameter", async () => {
    const res = await request(app).get("/api/phrases?q=sack");
    expect(res.status).toBe(200);
    expect(mockStorage.searchPhrases).toHaveBeenCalledWith("sack");
  });

  it("ignores empty query parameter", async () => {
    const res = await request(app).get("/api/phrases?q=");
    expect(res.status).toBe(200);
    expect(mockStorage.getAllPhrases).toHaveBeenCalled();
    expect(mockStorage.searchPhrases).not.toHaveBeenCalled();
  });
});

describe("GET /api/phrases/:id", () => {
  it("returns a phrase by id", async () => {
    const res = await request(app).get("/api/phrases/1");
    expect(res.status).toBe(200);
    expect(res.body.english).toBe("hit the sack");
  });

  it("returns 404 for non-existent id", async () => {
    const res = await request(app).get("/api/phrases/999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Phrase not found");
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).get("/api/phrases/abc");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID");
  });
});

describe("POST /api/phrases", () => {
  it("creates a new phrase with valid data", async () => {
    const res = await request(app).post("/api/phrases").send({
      english: "no biggie",
      chinese: "没什么大不了的",
      explanation: "Not a big deal",
    });
    expect(res.status).toBe(201);
    expect(res.body.english).toBe("no biggie");
    expect(res.body.id).toBe(3);
  });

  it("rejects phrase missing required english field", async () => {
    const res = await request(app).post("/api/phrases").send({
      chinese: "没什么",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it("creates a phrase with only english field", async () => {
    const res = await request(app).post("/api/phrases").send({
      english: "chill out",
    });
    expect(res.status).toBe(201);
    expect(res.body.english).toBe("chill out");
  });
});

describe("PATCH /api/phrases/:id", () => {
  it("updates an existing phrase", async () => {
    const res = await request(app).patch("/api/phrases/1").send({
      explanation: "Updated explanation",
    });
    expect(res.status).toBe(200);
    expect(res.body.explanation).toBe("Updated explanation");
    expect(res.body.english).toBe("hit the sack");
  });

  it("returns 404 for non-existent phrase", async () => {
    const res = await request(app).patch("/api/phrases/999").send({
      english: "test",
    });
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).patch("/api/phrases/abc").send({
      english: "test",
    });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/phrases/:id", () => {
  it("deletes an existing phrase", async () => {
    const res = await request(app).delete("/api/phrases/1");
    expect(res.status).toBe(204);
    expect(mockStorage.deletePhrase).toHaveBeenCalledWith(1);
  });

  it("returns 404 for non-existent phrase", async () => {
    const res = await request(app).delete("/api/phrases/999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const res = await request(app).delete("/api/phrases/abc");
    expect(res.status).toBe(400);
  });
});
