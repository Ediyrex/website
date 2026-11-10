# Architecture Decision Record (ADR)

## Log Entry: 2026-11-08 — Repository Structure & Application Architecture

### Context
Ediyrex operates on a hybrid business model:
1. **Client Services**:
   - Pillar 1: Media & Content (Video production, photography, reels, brand films, content strategy, motion graphics)
   - Pillar 2: Web & Digital Experience (Web design & dev, landing pages, e-commerce, SaaS & dashboards, UI/UX, full-stack apps, brand identity)
   - Pillar 3: AI Agents & Automation (AI agents, workflow automation, chatbots, AI voice receptionists, custom AI apps, RAG, product integrations)
2. **Proprietary In-House Products / Labs**:
   - Client services directly fund, validate, and complement internal SaaS products.

---

### Selected Architecture: Option 1 — Unified Next.js (`app/` + `app/api/`)

**Status**: Accepted & Implemented  
**Date**: November 8, 2026  

#### Decision Details
- Implement a unified Next.js project using App Router (`src/app/`) and Route Handlers (`src/app/api/`).
- Adopt a modular, domain-driven directory structure:
  - `src/app/` — Routing, layouts, page views, and API route handlers.
  - `src/components/` — UI design system and reusable presentation components.
  - `src/features/` — Domain modules for:
    - `features/media/` (Media & content services showcase, portfolio, assets)
    - `features/digital/` (Web, digital experience, SaaS dashboards, UI/UX)
    - `features/ai/` (AI agents, automation workflows, voice demos, RAG query interfaces)
    - `features/products/` (Internal proprietary products & hybrid studio showcase)
  - `src/services/` — Business logic and third-party integrations.
  - `src/lib/` — Shared utilities, helpers, database/auth clients.

#### Rationale
- **Fastest Time to Market**: Maximum development velocity for building and shipping the marketing website, portfolio, and lead-generation flows.
- **Single Deployment**: Unified build and hosting on modern serverless infrastructure without extra orchestration.
- **Lower Tooling Overhead**: Avoids early workspace/monorepo build cache management while the core branding and service offerings are launched.

---

### Alternate Option Recorded: Option 2 — Monorepo (Turborepo / Workspaces)

**Status**: Documented as Future Migration Target  

#### Structure
```text
ediyrex/
├── apps/
│   ├── web/              # Agency marketing site & client portal (Next.js)
│   ├── studio-api/       # Dedicated AI agent runner / Voice WebSocket service (Node / FastAPI)
│   └── product-one/      # In-house SaaS product
└── packages/
    ├── ui/               # Shared design system components
    ├── config/           # Shared Tailwind, TypeScript, ESLint rules
    └── ai-core/          # Shared AI prompts, LLM connectors, RAG pipeline
```

#### Migration Triggers (When to transition to Option 2)
1. **Long-Running AI / Voice Infrastructure**: When AI voice receptionists or heavy agent pipelines require persistent WebSockets or execution exceeding serverless timeout limits (requiring a separate Node or Python backend).
2. **First In-House SaaS Launch**: When the first proprietary product is ready for development as an independent web application and needs to share components, auth, and AI libraries with the agency.
3. **Multi-Team Growth**: When client-facing web teams and product engineering teams work on different deployment cadences.

---

## Log Entry: 2026-11-10 — Phase 7 Backend & Database Stack Selection

**Status**: Accepted  
**Repository Mode**: Unified Next.js App at root (`src/app/api/v1/` and `src/db/`) — removed unused `apps/` and `packages/` monorepo folders per Option 1 selection.

### Selected Stack
- **Database**: PostgreSQL 18 (local development)
- **ORM & Migrations**: Drizzle ORM + `postgres` driver + `drizzle-kit` SQL migrations (`src/db/migrations/`)
- **Schema Validation**: Zod (`src/lib/validations/`)
- **Structured Logging**: Pino (`src/lib/server/logger.ts`) with sensitive key redaction
- **Testing**: Vitest (`npm test`)


