# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CS2 match prediction game for a Discord community. Users log in with Discord, pick winners of upcoming pro matches from the active HLTV tournament, and earn points on a leaderboard. It is point-based only, with no gambling or real money. The UI and user-facing strings are in Serbian (route names too: `/igraj` play, `/tabela` leaderboard, `/istorija` history, `/profil` profile, `/admin/kontrolna-tabla` dashboard, `/admin/mecevi` matches, `/admin/turniri` events, `/admin/nagrade` prizes, `/admin/dodaj-meceve` manual match entry, `/admin/rezultati` manual results).

Two independent npm projects with no root workspace:
- `server/`: Express 5 + TypeScript (ESM), PostgreSQL via raw SQL (`pg-pool`), Redis, Passport Discord, Zod, PostHog
- `client/`: Next.js 16 (App Router, Turbopack), React 19, TanStack Query, axios, Tailwind v4

## Commands

Run each from its own directory:

```
cd server; npm run dev     # nodemon + tsx, watches src/
cd server; npm run build   # tsc
cd client; npm run dev     # next dev --turbopack (port 3000)
cd client; npm run build
cd client; npm run lint    # eslint (client only; server has no linter)
```

Neither project has a test suite.

Database setup: `psql -U <user> -d postgres -f server/src/database/migrate.sql` creates the `predictions` DB (`setup.sql`) and applies the numbered files in `server/src/database/migrations/` (it uses `\ir`, so it works from any cwd). The whole script is idempotent: `setup.sql` only creates the DB if missing, and each migration wraps its body in a `DO $$ ... IF NOT EXISTS (SELECT 1 FROM schema_migrations WHERE version = '...')` block and records itself there. When adding a migration, follow that pattern and append it to `migrate.sql`.

## Environment

Server `.env`: `PORT`, `FRONTEND_URL`, `PG*` (read implicitly by `new Pool()`), `SESSION_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_SECRET`, `DISCORD_CALLBACK_URL`, `DISCORD_WEBHOOK_URL`, `POSTHOG_KEY`, `POSTHOG_HOST`, `NODE_ENV`. Redis uses `createClient()` defaults (localhost:6379).

Client `.env.local`: `NEXT_PUBLIC_API_URL`.

## Server architecture

- `server.ts` is the entry point: it starts the HTTP app from `index.ts` and the HLTV scraping scheduler. `index.ts` wires middleware, a Redis-backed session, Passport, a node-cron job, and routers (`userRoutes` at `/`, `adminRoutes` at `/admin`, `authRoutes` at `/auth`).
- **Relative imports use `.js` extensions** (ESM with `"type": "module"`), even though the files are `.ts`.
- **Error handling:** controllers are plain async functions with no try/catch. Express 5 forwards thrown errors to `utils/globalErrorHandler.ts`, which maps `ZodError`→400, `AppError(msg, status)`→its status, `CloudflareError`→429, and pg/redis errors→503. Validate input with Zod schemas from `src/schemas/` via `.parse()` and throw `AppError` for other failures.
- Auth: routes chain `isLoggedIn` (and `isAdmin`, which checks `users.is_admin` in the DB). The whole user object is serialized into the session. Get the user id with `UserType.parse(req.user)`.
- `database.query(sql, params)` runs a single query and `database.transaction(async client => ...)` runs a BEGIN/COMMIT/ROLLBACK block. Snake_case DB columns are mapped to camelCase by hand in controllers.

### Redis as the source of "current state"

Redis holds the app's live state, not just a cache:
- `active_event`: the HLTV event id whose matches are scraped and shown on `/igraj`.
- `active_parent_event`: the event that leaderboards and points roll up to. Events can have a `parent_event_id`, e.g. playoff stages under a main event. Scoring covers matches from the parent and all its children.
- `matches`: JSON list of upcoming matches from HLTV (`MATCHES_CACHE_TTL`, 2h). Admins can edit it via `POST /admin/matches`. Read it through `utils/getActiveMatches.ts`, which `getMatches`, `getMatchesPoints`, `predict` and `GET /admin/matches` share. The admin route also reports `source: 'redis' | 'database'` from the key's TTL (`-2` = missing). `[]` means HLTV returned no matches. A missing key means the scrape failed, and the helper falls back to the `matches` table. Either way it marks a match `live` once its start date has passed, so predictions lock at the scheduled time. `predict` rejects predictions for matches not in that list or already `live`.
- `sess:*` stores sessions, and `tracked:<userId>:<sessionId>` throttles PostHog `user_active` events.

On startup `config/redis.ts` deletes these keys and rebuilds `active_event`/`active_parent_event` from the `events` row with `is_active = true`. `POST /admin/event-upsert` is the other place that sets them.

### Background jobs

- `utils/fetchScheduler.ts` runs `fetchMatches` every 25–35 minutes. The randomized delay helps avoid HLTV/Cloudflare blocking. It pulls matches for `active_event` through `@bogdanpet/hltv` (the maintainer's own HLTV scraper package), caches them in Redis, inserts new ones into `matches`, and posts new matchups to a Discord webhook.
- `utils/calculatePoints.ts` runs on a cron (`0 12,14,17,19,22 * * *`) and on `POST /admin/manual-calculation`. It writes HLTV results into `matches`, then in one transaction fills `matches_points` and upserts `leaderboards` for `active_parent_event`. An HLTV failure is caught and logged so the DB part still runs. That way results entered manually via `POST /admin/set-result` turn into points even while HLTV is down, and HLTV never overwrites them (`WHERE result IS NULL`). **Scoring:** a correct pick is worth `100 + % of users who picked the other team`, so upsets pay more. Points for a match are frozen once written (`ON CONFLICT DO NOTHING`).
- Wrap HLTV calls in `hltvWrapper()` so Cloudflare blocks become `CloudflareError`.

## Client architecture

- `src/middleware.ts` calls `GET /auth/me` on the backend with the request's cookies on every page load. It redirects logged-out users away from the protected routes listed there, redirects logged-in users away from `/login` and `/` to `/igraj`, and forwards any refreshed `set-cookie`. Add new protected routes to its `protectedRoutes` array.
- Route groups: `(auth)` holds the login page and `(predictions)` holds the user pages with the shared header/navbar. `admin/` has its own layout.
- All API calls go through the axios instance in `src/services/api/backend.ts` (`withCredentials: true`, since the session cookie is cross-origin). Reads use `useQuery` inline in pages. Writes are custom `useMutation` hooks in `src/utils/mutations/`, which report results through `useToast()` from `src/context/ToastContext.tsx`.
- Path alias `@/*` → `client/src/*`. Shared API response types live in `client/src/types/` and are kept in sync with server responses by hand.
