# LingoDiary

A language learning app that lets users write diary entries in Chinese and get casual American English translations. Users can highlight phrases from translations, save them to a personal dictionary, and review them with flashcards.

## Architecture

- **Frontend**: React + Vite + Tailwind v4 + shadcn/ui + wouter routing
- **Backend**: Express.js on Node
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Context + TanStack Query for server state

## Data Model

- `phrases` table: `id` (serial PK), `english`, `chinese`, `explanation`, `context`, `examples`, `dateAdded`

## API Routes

- `GET /api/phrases` — list all phrases (supports `?q=` search)
- `GET /api/phrases/:id` — get single phrase
- `POST /api/phrases` — create phrase
- `PATCH /api/phrases/:id` — update phrase
- `DELETE /api/phrases/:id` — delete phrase

## Key Files

- `shared/schema.ts` — Drizzle schema + Zod validation
- `server/storage.ts` — Database storage implementation
- `server/routes.ts` — API route handlers
- `client/src/context/PhraseContext.tsx` — Client-side phrase state (wraps TanStack Query)
- `client/src/pages/Write.tsx` — Diary write + translate page
- `client/src/pages/Dictionary.tsx` — Saved phrases list
- `client/src/pages/Review.tsx` — Flashcard review
- `client/src/components/PhraseModal.tsx` — Save/edit phrase dialog
- `client/src/components/layout/Layout.tsx` — App shell with top nav (desktop) + bottom tabs (mobile)

## Color Theme

- Primary: #d64a17 (warm orange-red)
- Secondary: #90cce5 (baby blue)
- Foreground/text: #004d3a (forest green)
- Accent: #c8bd00 (yellow green)

## Notes

- Translation is currently mocked (returns static text). Ready for AI integration.
- No authentication — single-user, device-local experience.
- Font: Plus Jakarta Sans (display) + Inter (fallback)
