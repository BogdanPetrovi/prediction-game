# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CS2 match prediction game for a Discord community. Users log in with Discord, pick winners of upcoming pro matches from the active tournament (a PandaScore serie), and earn points on a leaderboard. It is point-based only, with no gambling or real money. The UI and user-facing strings are in Serbian (route names too: `/igraj` play, `/tabela` leaderboard, `/istorija` history, `/profil` profile, `/admin/kontrolna-tabla` dashboard, `/admin/mecevi` matches, `/admin/turniri` events, `/admin/nagrade` prizes, `/admin/dodaj-meceve` manual match entry, `/admin/rezultati` manual results).

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

Server `.env`: `PORT`, `FRONTEND_URL`, `PG*` (read implicitly by `new Pool()`), `SESSION_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_SECRET`, `DISCORD_CALLBACK_URL`, `DISCORD_WEBHOOK_URL`, `POSTHOG_KEY`, `POSTHOG_HOST`, `PANDASCORE_TOKEN`, `NODE_ENV`. `PANDASCORE_TOKEN` is the PandaScore API key: send it only as an `Authorization: Bearer` header, never in a URL, and never print or log it. Redis uses `createClient()` defaults (localhost:6379).

Client `.env.local`: `NEXT_PUBLIC_API_URL`.

## Server architecture

- `server.ts` is the entry point: it starts the HTTP app from `index.ts`, the PandaScore matches scheduler and the points calculation cron. `index.ts` wires middleware, a Redis-backed session, Passport, and routers (`userRoutes` at `/`, `adminRoutes` at `/admin`, `authRoutes` at `/auth`).
- **Relative imports use `.js` extensions** (ESM with `"type": "module"`), even though the files are `.ts`.
- **Error handling:** controllers are plain async functions with no try/catch. Express 5 forwards thrown errors to `utils/globalErrorHandler.ts`, which maps `ZodError`→400, `AppError(msg, status)`→its status, `CloudflareError`→429 (left over from the HLTV scraper), and pg/redis errors→503. Validate input with Zod schemas from `src/schemas/` via `.parse()` and throw `AppError` for other failures.
- Auth: routes chain `isLoggedIn` (and `isAdmin`, which checks `users.is_admin` in the DB). The whole user object is serialized into the session. Get the user id with `UserType.parse(req.user)`.
- `database.query(sql, params)` runs a single query and `database.transaction(async client => ...)` runs a BEGIN/COMMIT/ROLLBACK block. Snake_case DB columns are mapped to camelCase by hand in controllers.

### Redis as the source of "current state"

Redis holds the app's live state, not just a cache:
- `active_event`: the PandaScore serie id whose matches are fetched and shown on `/igraj`. A serie is a whole tournament with all its stages (group stage, playoffs).
- `active_parent_event`: the event that leaderboards and points roll up to. It is the active event itself unless the admin sets a `parent_event_id`. Scoring covers matches from the parent and all its children. HLTV split tournaments into parent and child events, but a serie already covers all stages, so new events don't need a parent.
- `matches`: JSON list of upcoming matches from PandaScore (`MATCHES_CACHE_TTL`, 2h). Admins can edit it via `POST /admin/matches`. Read it through `utils/getActiveMatches.ts`, which `getMatches`, `getMatchesPoints`, `predict` and `GET /admin/matches` share. The admin route also reports `source: 'redis' | 'database'` from the key's TTL (`-2` = missing). `[]` means PandaScore returned no matches. A missing key means the fetch failed, and the helper falls back to the `matches` table. Either way it marks a match `live` once its start date has passed, so predictions lock at the scheduled time. `predict` rejects predictions for matches not in that list or already `live`.
- `pending_notifications`: list of matchups added via `POST /admin/add-match`. They are not announced right away. `POST /admin/send-notifications` sends them all in one Discord message, then trims only what it sent.
- `calculation_hours`: JSON list of full hours (0–23, Serbian time) when the points cron runs. Admins change it via `POST /admin/calculation-schedule`. If missing, `utils/calculationScheduler.ts` uses `DEFAULT_CALCULATION_HOURS`. It is config, so startup does not delete it.
- `sess:*` stores sessions, and `tracked:<userId>:<sessionId>` throttles PostHog `user_active` events.

On startup `config/redis.ts` deletes the `matches`/`active_*` keys and rebuilds `active_event`/`active_parent_event` from the `events` row with `is_active = true`. `POST /admin/event-upsert` is the other place that sets them.

### Background jobs

- `utils/fetchScheduler.ts` runs `fetchMatches` every 25–35 minutes. The randomized delay comes from the HLTV scraper era and keeps the request rate low. It pulls matches for `active_event` through `utils/pandascore.ts`, caches them in Redis, inserts new ones into `matches`, and posts new matchups to a Discord webhook through `utils/sendMatchesNotification.ts` (shared with the manual send; it splits into 25-field embeds and pings the role only once).
- `utils/calculatePoints.ts` runs on a cron and on `POST /admin/manual-calculation`. The cron is owned by `utils/calculationScheduler.ts`: it builds `0 <hours> * * *` (timezone `Europe/Belgrade`) from `calculation_hours` and destroys/recreates the task whenever an admin saves new hours, so no restart is needed. It writes PandaScore results into `matches`, then in one transaction fills `matches_points` and upserts `leaderboards` for `active_parent_event`. A PandaScore failure is caught and logged so the DB part still runs. That way results entered manually via `POST /admin/set-result` turn into points even while PandaScore is down, and PandaScore never overwrites them (`WHERE result IS NULL`). **Scoring:** a correct pick is worth `100 + % of users who picked the other team`, so upsets pay more. Points for a match are frozen once written (`ON CONFLICT DO NOTHING`).

### PandaScore

- All API calls go through `utils/pandascore.ts`: `getMatches`, `getResults` and `findEvent`. The free plan allows 1000 requests per hour. The app uses about 2–3 per hour, and users never hit the API directly.
- **Matches:** only matches with both teams and a `scheduled_at` are used. TBD matches are never cached, stored or announced. Status decides what is shown: `not_started` is upcoming, `running` is live, and `finished`/`canceled`/`postponed` never reach `/igraj`.
- **Results:** the winner comes from `winner_id` and the score from `results`. A forfeit (`forfeit` + `winner_id`, usually status `canceled` with 0:0) counts as a normal win and is stored as `1:0`/`0:1`. A result is skipped unless the winner's score is higher. `calculatePoints` maps the API teams to the DB `team1`/`team2` by name. On a mismatch it skips and logs the match, and the admin enters the result manually.
- **Admin event search** (`GET /admin/search-event?query=`) works by name. The first word goes to `search[slug]`, the candidate matching the most words wins, and ties go to the newest. The event name and logo come from the league and serie, and the admin can override the logo.
- **Legacy HLTV data:** events with id ≤ 9999 and matches around 2.39M come from the old HLTV scraper.
  - Admin event routes reject event ids below `MIN_EVENT_ID` (10000), so those rows can't change.
  - Never write to `leaderboards`, `matches_points` or `predictions` rows of old events.
  - PandaScore match ids (about 1.76M in Oct 2026, growing ~1.8k/day) reach the HLTV range around Sep–Oct 2027 and need a fix before then.
  - Because the two id ranges are mixed, profile and history sort matches by time (`COALESCE(date, created_at)`), never by id.
- **Old scraper:** `@bogdanpet/hltv`, `utils/hltvWrapper.ts` and `CloudflareError` are still in the code but unused until they are removed.

## Client architecture

- `src/middleware.ts` calls `GET /auth/me` on the backend with the request's cookies on every page load. It redirects logged-out users away from the protected routes listed there, redirects logged-in users away from `/login` and `/` to `/igraj`, and forwards any refreshed `set-cookie`. Add new protected routes to its `protectedRoutes` array.
- Route groups: `(auth)` holds the login page and `(predictions)` holds the user pages with the shared header/navbar. `admin/` has its own layout.
- All API calls go through the axios instance in `src/services/api/backend.ts` (`withCredentials: true`, since the session cookie is cross-origin). Reads use `useQuery` inline in pages. Writes are custom `useMutation` hooks in `src/utils/mutations/`, which report results through `useToast()` from `src/context/ToastContext.tsx`.
- Path alias `@/*` → `client/src/*`. Shared API response types live in `client/src/types/` and are kept in sync with server responses by hand.
