# LingoDiary

A full-stack language learning platform that helps Chinese speakers improve their English through daily journaling. Users write diary entries in Chinese, receive natural American English translations powered by AI, and build a personal phrase dictionary with spaced-repetition flashcard review.

# Product Vision

LingoDiary explores how AI-assisted writing tools can support second-language fluency by:
- Reducing translation friction
- Turning passive corrections into active recall practice
- Structuring learning around user-generated content
  
The system is designed as a modular full-stack application to explore API boundaries, service responsibilities, and deployment trade-offs.

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

## System Architecture Overview

This project is implemented as a full-stack Express monolith:
```bash
Browser
   ↓
Express Server (Node.js)
   ├── Serves React static assets
   └── Handles REST API routes
         ↓
     PostgreSQL
```
 Architectural Characteristics:
- Single runtime process (Express)
- React frontend served as static assets by backend
- REST API for translation and phrase management
- Shared schema validation via Zod
- Database abstraction through an IStorage interface
This architecture prioritizes simplicity and rapid iteration while preserving clear service boundaries.

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

## Future Exploration

If scaling beyond the prototype stage:
- Separate frontend
- Containerize backend 
- Introduce API versioning
- Add authentication & rate limiting
- Decouple translation service from core API
- Add observability (structured logging + metrics)
