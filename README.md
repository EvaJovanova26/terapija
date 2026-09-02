# Baseline — daily baseline tracker

A quiet, single-user daily tracker. See `SPEC.md` for the full design brief.

## Setup

1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. In Supabase → Authentication → URL Configuration, add your site URL and
   `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback`
   for local dev) to the redirect allow-list. Email magic links are the only sign-in method.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon/publishable key.
4. `npm install && npm run dev`

## Deploy (Vercel)

Import the repo, set the two `NEXT_PUBLIC_SUPABASE_*` environment variables, deploy.
Then open the site on your phone and use "Add to Home Screen"; the manifest makes it
open fullscreen.

## Layout

- `app/` — routes: today (`/`), `/calendar`, `/entry/[date]`, `/garden`, `/login`,
  auth callback, CSV export at `/api/export`.
- `components/` — small single-purpose UI pieces, grouped by screen.
- `lib/` — types, local-date helpers, garden point rules (`garden-logic.ts`),
  Supabase clients and all queries.
- `supabase/schema.sql` — tables, triggers, and row-level security.
