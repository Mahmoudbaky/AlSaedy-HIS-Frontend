# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint (zero warnings allowed)
npm run preview      # Preview production build locally

# Production (PM2)
npm run deploy       # Build + restart PM2
npm run pm2:start    # Start with ecosystem.config.cjs
npm run pm2:logs     # View logs
```

There is no test suite configured.

## Architecture Overview

**Stack:** React 19 + TypeScript, Vite, TailwindCSS v4, React Router v7, TanStack Query v5, Radix UI / shadcn-style components, Zod + react-hook-form, Sonner (toasts), next-themes, i18next.

### Startup & API configuration

`src/main.tsx` renders a `ConfigLoader` that calls `ensureApiConfig()` (from `src/config/api.ts`) before mounting the app. This fetches `/settings.json` at runtime to set the API base URL, allowing the same build to target different backends without rebuilding. The API version is controlled by the `VITE_API_VERSION` env var (`.env` sets `VITE_API_VERSION=v1`).

### Data layer pattern

All API communication follows a strict three-layer pattern:

1. **`src/lib/apiClient.ts`** — Axios instance. Automatically attaches `Bearer` tokens from `localStorage` on every request. Handles 401 → silent token refresh via `POST /auth/refresh`, queuing concurrent requests during refresh. On refresh failure, clears tokens and redirects to `/auth/auth2/login`.

2. **`src/services/`** — Service classes (`authService`, `statisticsService`). Auth-sensitive requests (login, register, refresh) bypass `apiClient` and use plain `axios` to avoid interceptor loops. All other requests use `apiClient`.

3. **`src/hooks/`** — TanStack Query hooks wrapping service methods (e.g. `useLogin`, `useUser`, `useHolyCapitalHospitalsStatistics`). Views consume hooks, never services directly.

The standard API response envelope is `{ success: boolean, message: string, data?: T, error?: string, timestamp: string }`.

### Authentication

- JWT tokens (`accessToken`, `refreshToken`) stored in `localStorage`.
- `authService` (singleton class) owns all token lifecycle logic.
- State changes dispatch a custom `auth-state-changed` DOM event so `ProtectedRoute` and other tabs stay in sync via `storage` events.
- `useUser` hook fetches `/auth/me` when authenticated; query key `['auth', 'user']` is shared with `useLogin`/`useRegister` so cache is invalidated on login.
- New users require admin confirmation (`confirmed: false`) before they can log in.

### Routing & layouts

`src/routes/Router.tsx` defines two trees:
- **Protected** (`ProtectedRoute` → `FullLayout`): all app pages. `ProtectedRoute` checks `authService.isAuthenticated()` and redirects to login if false.
- **Public** (`BlankLayout`): auth pages (`/auth/auth2/login`, `/auth/auth2/register`).

All views are lazy-loaded via the `Loadable` HOC (`src/layouts/full/shared/loadable/Loadable.tsx`).

`FullLayout` renders the `Sidebar` (desktop only) + `Header` + `<Outlet />`.

### Sidebar & role-based access

`src/layouts/full/vertical/sidebar/sidebaritems.ts` exports `getSidebarContent(t, isAdmin)`. The **Administration** section (user management) is only appended when `isAdmin === true` (checked via `user?.role === 'admin'` in `Sidebar.tsx`). To add a new menu item, edit `sidebaritems.ts` and add the icon key to `SIDEBAR_ICON_MAP` in `Sidebar.tsx`.

### Internationalisation

English and Arabic supported (`src/locales/en.json`, `src/locales/ar.json`). Arabic applies RTL via `document.documentElement.dir`. Use `useTranslation()` for all user-visible strings; add translation keys to both locale files when adding new text.

### Adding a new feature

1. Add endpoint constant to `src/config/api.ts`.
2. Create/extend a service in `src/services/`.
3. Create a TanStack Query hook in `src/hooks/`.
4. Build the view in `src/views/`.
5. Register the route in `src/routes/Router.tsx`.
6. Add sidebar entry in `sidebaritems.ts` (and icon mapping in `Sidebar.tsx` if using a new icon).
7. Add translation keys in both locale files.

### Form validation

Forms use `react-hook-form` with `zodResolver`. Schemas live in `src/validations/`. UI primitives `Field`, `FieldLabel`, `FieldError` from `src/components/ui/field.tsx` handle accessible form layout.

### Production deployment

Express static server (`server.js`) serves the `dist/` folder and returns `index.html` for all routes. PM2 manages the process via `ecosystem.config.cjs`, reading env from `.env.production`. Default port is `5174`.
