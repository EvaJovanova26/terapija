# Blossom

A private daily self-care tracker where everything you log grows a garden.
See `SPEC.md` for the original design brief.

## Setup (fresh)

1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. In Supabase → Authentication → URL Configuration, set the Site URL and add
   `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback`
   for local dev) to the redirect allow-list. Email magic links are the only sign-in method.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon/publishable key.
4. `npm install && npm run dev`

## Upgrading an existing database

If your project was created with the first version of `schema.sql` (fixed
boolean columns), run `supabase/migrations/002_dynamic_items.sql` once in the
SQL editor. It creates the `items` table, seeds the default items, copies your
existing ticks into `entries.done_items`, and removes the old columns. Nothing
is lost. Do not run `schema.sql` again on an upgraded database.

## Deploy (Vercel)

Import the repo, set the two `NEXT_PUBLIC_SUPABASE_*` environment variables, deploy.
Then open the site on your phone and use "Add to Home Screen".

## How points work

All rules live in `lib/garden-logic.ts` and `lib/streak.ts`.

- Every item has its own point value (defaults: Core 1, Extra 2, Superpower 5).
- A day after a zero-point day counts double.
- Lifetime points are a high-water mark stored in `garden_state`; they never go down.
- The streak counts consecutive days with points, back from today (or yesterday if
  today is not logged yet).

## Layout

- `app/` — routes: today (`/`), `/calendar`, `/entry/[date]`, `/garden`, `/settings`,
  `/login`, auth callback, CSV export at `/api/export`.
- `components/` — small single-purpose UI pieces, grouped by screen.
- `lib/` — types, local-date helpers, point rules, Supabase clients and all queries.
- `supabase/schema.sql` — full schema for a fresh install.
- `supabase/migrations/` — one-off upgrade scripts for existing databases.
