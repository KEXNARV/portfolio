# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive portfolio for an AI Product System Engineer featuring 10 distinct landing page themes. Each theme has unique design language, typography, and animations.

## Commands

### Frontend (Next.js 16 + React 19)
```bash
cd frontend
npm install           # Install dependencies
npm run dev           # Dev server on port 6000
npm run build         # Production build
npm run lint          # ESLint
```

### Backend (NestJS 11)
```bash
cd backend
npm install           # Install dependencies
npm run start:dev     # Dev server on port 3001 (watch mode)
npm run build         # Compile to dist/
npm run start:prod    # Run compiled app
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run lint          # ESLint
npm run format        # Prettier
```

### Database (PostgreSQL + Prisma)
```bash
docker-compose up -d              # Start PostgreSQL (port 5433) + PgAdmin (port 5051)
cd backend && npx prisma generate # Generate Prisma client
npx prisma migrate dev            # Run migrations
npx prisma studio                 # Database GUI
```

## Architecture

### Frontend Structure
- **App Router**: `frontend/app/` with file-based routing
- **Landing Pages**: 10 themes at `/landing1` through `/landing10`
- **Theme Selector**: Main page (`app/page.tsx`) is a carousel to browse themes
- **UI Components**: shadcn/ui in `components/ui/`, uses Radix primitives
- **Styling**: Tailwind CSS 4 with CSS variables
- **Animations**: Framer Motion for complex animations
- **Utility**: `cn()` function in `lib/utils.ts` for className merging (clsx + tailwind-merge)
- **Path Alias**: `@/*` maps to root

### Backend Structure
- **NestJS Modules**: Standard Controller → Service → Module pattern
- **Entry**: `src/main.ts` bootstraps app with CORS for `http://localhost:6000`
- **Database**: Prisma ORM with PostgreSQL
- **Schema**: 4 models in `prisma/schema.prisma` - Profile, Project, Skill, Experience

### Frontend-Backend Connection
- Frontend runs on port 6000
- Backend runs on port 3001 with CORS enabled
- Database credentials in `backend/.env`

## Landing Page Patterns

Each landing page (`app/landing[1-10]/page.tsx`) follows these patterns:
- `"use client"` directive for client-side rendering
- Google Fonts imported per theme
- Framer Motion for entrance animations
- Responsive breakpoints using `md:` prefix
- Self-contained components within each page file

| Landing | Theme | Style |
|---------|-------|-------|
| 1 | Industrial | Dark, red accents, terminal aesthetic |
| 2 | Visionary | Swiss design, custom cursor, parallax |
| 3 | Brutalist | Light bg, thick borders, magenta |
| 4 | Nothing | Nothing Phone inspired, dotted patterns |
| 5 | Aurora | Purple gradients, spatial computing |
| 6 | Ethereal | Glassmorphism, aurora background |
| 7 | Cyber Sec | Matrix/hacker, green terminal |
| 8 | Editorial | Newspaper layout, serif typography |
| 9 | Blueprint | Technical drawing, CAD aesthetic |
| 10 | Zen | Japanese minimal, washi texture |

## Docker Services

```yaml
postgres:     port 5433, admin/adminpassword, database: portfolio_db
pgadmin:      port 5051, admin@admin.com/adminpassword
```
