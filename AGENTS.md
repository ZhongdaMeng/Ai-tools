# Agent Instructions for AI-tools

## Project Overview

React + TypeScript + Vite application with Ant Design UI. Uses pnpm as package manager.

## Quick Commands

```bash
pnpm dev          # Start dev server (Vite with HMR)
pnpm build        # Type-check (tsc -b) then build
pnpm lint         # ESLint check
pnpm preview      # Preview production build
```

**No test framework is configured.** There are no test scripts or test files.

## Architecture

### Path Alias

`@/` maps to `src/`. Use it in imports:

```tsx
import { useUserStore } from '@/store';
```

Configured in both `vite.config.ts` and `tsconfig.app.json`.

### API Layer

- Axios wrapper at `src/utils/request/` with typed `get`, `post`, `put`, `delete` methods
- Base URL from `VITE_APP_BASE_API` env var (`/api` in dev, `/service` in prod)
- Vite proxy forwards `/api` to `VITE_API_TARGET_URL` (default: `http://localhost:3000`)
- Response shape: `{ code: number; message: string; data: T }` (see `src/types/response.ts`)
- 401 responses auto-clear token and redirect to `/login`

### State Management

- **Zustand** for client state (`src/store/`)
- **React Query** (`@tanstack/react-query`) for server state
- Token stored in Zustand with `persist` middleware (synced to localStorage)

### Routing

- `react-router-dom` with lazy-loaded routes (`src/router/index.tsx`)
- Auth-protected routes use `requireAuthLoader` — redirects to `/login` if no token

### Styling

- SCSS (`sass` package). No CSS modules or Tailwind.

## Code Conventions

- **Prettier**: 4-space indent, single quotes, no trailing commas, no semicolons (wait — actually semicolons ARE enabled), arrow parens: `avoid`
- **ESLint**: React Hooks rules + React Refresh (Vite) + Prettier compat
- **TypeScript strict-ish**: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Comments are in Chinese (开发者使用中文)

## Gotchas

- Build runs `tsc -b` before `vite build` — type errors will fail the build
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports
- No test infrastructure exists — don't look for test scripts
- `.env.development` and `.env.production` have different `VITE_APP_BASE_API` prefixes (`/api` vs `/service`)
