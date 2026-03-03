# LingoDiary

A language learning app that helps you improve your English by writing daily diary entries in Chinese. Get casual, natural American English translations powered by AI, save interesting phrases to your personal dictionary, and review them with interactive 3D flip-card flashcards.

## Features

- **Write & Translate** — Write diary entries in Chinese and receive warm, conversational American English translations powered by OpenAI.
- **Phrase Dictionary** — Highlight and save interesting words or phrases from your translations. Add explanations, context, and example sentences.
- **Flashcard Review** — Review saved phrases with 3D flip-card flashcards. Rate your recall with Hard, Good, or Easy buttons.
- **Search** — Quickly find saved phrases by English or Chinese text.
- **Responsive Design** — Top navigation bar on desktop, bottom tab bar on mobile.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, shadcn/ui, wouter (routing), TanStack Query, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI (gpt-5-mini) via Replit AI Integrations
- **Testing**: Vitest, Supertest

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (provisioned automatically on Replit)

### Installation

```bash
npm install
```

### Database Setup

Push the Drizzle schema to the database:

```bash
npm run db:push
```

### Running the App

```bash
npm run dev
```

The app starts on port 5000 and serves both the API and the frontend.

### Running Tests

```bash
npx vitest run
```

This runs 43 tests across three test suites:

- **Schema tests** — Zod validation for insert and update schemas
- **Route tests** — API endpoint tests with mocked storage and OpenAI
- **Storage tests** — Database integration tests against PostgreSQL

## Project Structure

```
client/
  src/
    components/
      layout/Layout.tsx      # App shell (top nav desktop, bottom tabs mobile)
      PhraseModal.tsx         # Save/edit phrase dialog
    context/
      PhraseContext.tsx       # Phrase state management (TanStack Query)
    pages/
      Write.tsx               # Diary write + translate page
      Dictionary.tsx          # Saved phrases list with search
      Review.tsx              # Flashcard review page
    App.tsx                   # Router and app entry point
server/
  index.ts                   # Express server setup
  routes.ts                  # API route handlers
  storage.ts                 # Database storage layer (IStorage interface)
  db.ts                      # Database connection
shared/
  schema.ts                  # Drizzle schema + Zod validation types
tests/
  schema.test.ts             # Schema validation tests
  routes.test.ts             # API route tests
  storage.test.ts            # Storage integration tests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/translate` | Translate Chinese text to casual American English |
| GET | `/api/phrases` | List all saved phrases (supports `?q=` search) |
| GET | `/api/phrases/:id` | Get a single phrase by ID |
| POST | `/api/phrases` | Save a new phrase |
| PATCH | `/api/phrases/:id` | Update an existing phrase |
| DELETE | `/api/phrases/:id` | Delete a phrase |

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Warm orange-red | `#d64a17` |
| Secondary | Baby blue | `#90cce5` |
| Foreground | Forest green | `#004d3a` |
| Accent | Yellow-green | `#c8bd00` |

## License

MIT
