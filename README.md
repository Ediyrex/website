# Ediyrex Studio

A local-first creative technology studio website uniting **Media**, **Digital**, and **Artificial Intelligence**. Built with Next.js App Router, React, TypeScript, and Tailwind CSS v4.

---

## Tech Stack (Current Phase)

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Library:** React 19 & TypeScript
- **Styling:** Tailwind CSS v4 with centralized 60-30-10 design tokens (`src/app/globals.css`)
- **Typography:** Manrope (Headings), Inter (Body/UI), IBM Plex Mono (Labels/Metadata) via `next/font/google`
- **Icons & Motion:** Lucide React & Motion (`motion/react`, `prefers-reduced-motion` compliant)
- **Validation:** Zod (`src/lib/validations/`)
- **Quality Tools:** ESLint, Prettier (`prettier-plugin-tailwindcss`), TypeScript (`tsc`)

---

## Local Development Setup

### Prerequisites
- Node.js LTS
- npm
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Public Frontend)
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Verification Commands
```bash
npm run lint        # ESLint checks
npx tsc --noEmit    # TypeScript static type checks
npm run build       # Production Next.js build verification
```

---

## Project Structure & Documentation

- `src/app/` — Public routes (`/`, `/services`, `/services/[division]`, `/work`, `/work/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`) and local preview `/api/v1/*` handlers.
- `src/components/` — Reusable UI primitives (`ui/`), global shell (`layout/`), motion wrappers (`motion/`), and homepage/internal page sections (`sections/`).
- `src/features/` — Typed local content modules (`services/`, `work/`, `products/`).
- `src/lib/` — Shared utilities and Zod validation schemas.
- `ARCHITECTURE_LOG.md` — Architecture Decision Record (Option 1 unified Next.js selected for initial local development; Option 2 monorepo documented for backend scaling).
- `docs/DATABASE_SCHEMA.md` — Gap-analyzed PostgreSQL schema specification for the upcoming backend phase.
