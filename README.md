# SkillSprint AI — Frontend



Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui.

## Tech Stack

| Library | Purpose |
|---------|---------|
| Next.js 16 | Framework (App Router) |
| React 19 | UI library |
| Tailwind CSS v4 | Styling |
| shadcn/ui (base-nova) | Component library |
| @tanstack/react-query | Server state / data fetching |
| lucide-react | Icons |
| sonner | Toasts |
| recharts | Charts |
| next-themes | Dark/light mode |
| clsx + tailwind-merge + cva | Class utilities |

## Prerequisites

- Node.js 20+

## Setup

```bash
npm install
cp .env.example .env
```

The backend must be running (default `http://localhost:5000`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (core-web-vitals + TypeScript rules) |

## Environment

| Variable | Default | Notes |
|----------|---------|-------|
| `NEXT_PUBLIC_API_BASE_URL` | `/api` | API base path (proxy via `app/api/[...path]/route.ts`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public app URL |
| `API_BACKEND_URL` | `http://localhost:5000` | Backend target for API proxy |

## Key directories

```
src/
  app/          — App Router pages & layouts
    (auth)/     — Login, Register
    (main)/     — Dashboard, Orders, Profile, Items
    api/[...path]/ — API proxy to backend
  components/   — UI (shadcn), shared, layout, sections
  lib/          — API client, auth context, providers, utils
  types/        — TypeScript interfaces (mirrors shared/)
```

## AI features

- AI Content Generator (service descriptions)
- AI Recommendations (personalized service suggestions)
- Chat Assistant (English & Bengali)
- Document Analyzer (skill extraction & suggestions)
