# Daily Baseline Tracker — Build Spec

## Purpose
A single-user daily tracker for basic self-care, journalling, and context.
Designed for use during low-capacity periods. The primary design goal is that
opening the app must never feel like being judged.

## Stack (fixed — do not substitute)
- Next.js (App Router, TypeScript)
- Supabase (Postgres + auth)
- Tailwind CSS
- Deployed to Vercel
- PWA manifest so it installs to iOS/Android home screen

## Hard design constraints
These override any conventional habit-tracker pattern:
- NO streaks. Never display consecutive-day counts.
- NO completion percentages, scores out of N, or "you missed X" messaging.
- NO red, no warning colours, no empty-state guilt copy.
- Unlogged days render identically to neutral — faint, not alarming.
- History view defaults to last 7 days only. Longer views exist but are opt-in.
- All gamification is additive-only (see Garden section).

## File structure
Keep files small and single-purpose. No file over ~150 lines.

/app
  /layout.tsx
  /page.tsx                 → today's log screen
  /calendar/page.tsx
  /garden/page.tsx
  /entry/[date]/page.tsx    → view/edit a past day
  /api/                     → route handlers if needed
/components
  /log/CoreChecklist.tsx
  /log/UpsideChecklist.tsx
  /log/NumberInputs.tsx
  /log/JournalField.tsx
  /log/SaveBar.tsx
  /calendar/MonthGrid.tsx
  /calendar/DayDot.tsx
  /garden/GardenView.tsx
  /garden/Plant.tsx
  /ui/                      → primitives (Button, Card, Toggle)
/lib
  /supabase/client.ts
  /supabase/queries.ts      → all DB reads/writes, typed
  /types.ts
  /garden-logic.ts          → point calculation, unlock rules
  /date.ts                  → local-date handling, no UTC drift
/supabase
  /schema.sql

## Data model

Table: entries
- id                uuid pk
- user_id           uuid
- date              date (unique per user; local date, not timestamp)
- ate               boolean
- water             boolean
- teeth             boolean
- shower            boolean
- meds              boolean
- left_house        boolean
- slept             boolean
- exercised         boolean
- talked_to_someone boolean
- cooked            boolean
- made_something    boolean
- gaming_hours      numeric null
- sleep_hours       numeric null
- km_walked         numeric null
- note              text null
- created_at        timestamptz
- updated_at        timestamptz

All booleans default false. All numerics nullable — null means "not recorded",
which is NOT the same as zero and must never be displayed as zero.

Row Level Security on, scoped to auth.uid().

## Screen 1 — Today (/)
Default landing screen. Shows today's date, editable.

Sections in this order:
1. **Core** — ate, water, teeth, shower, meds, left the house, slept.
   Large tap targets. Toggle on = filled; toggle off = neutral outline, not red.
2. **Upside** — exercised, talked to someone, cooked, made something.
   Visually distinct (lighter/secondary). Copy must make clear these are bonus.
   Never counted against the user.
3. **Numbers** — gaming hours, sleep hours, km walked. Optional, blank allowed.
   Display gaming hours adjacent to sleep and "left the house" — it is context,
   not a score. No target, no limit, no colour change based on value.
4. **Note** — single free-text field, placeholder "what happened today?"
   Multiline, autosaving.

Autosave on change with a debounce; no explicit save button required, but show
a subtle "saved" indicator. Must work if the user only fills one field.

## Screen 2 — Calendar (/calendar)
Month grid. One dot per day:
- Logged day → solid dot
- Unlogged day → very faint dot (same shape, low opacity). Not empty, not red.
Dot size or opacity may vary slightly with number of core items logged, but the
difference must be subtle — this is a texture, not a scoreboard.
Tapping a day opens /entry/[date].
Month navigation back only as far as first entry.

## Screen 3 — Entry (/entry/[date])
Identical form to Today, for any past date. Fully editable — backfilling is
expected and encouraged, not penalised.

## Screen 4 — Garden (/garden) — gamification
Additive-only progression. Rules:
- Each core item logged = 1 point. Each upside item = 2 points.
- Points accumulate to a lifetime total. Points NEVER decrease, never expire,
  never reset. There is no daily target.
- Total points unlock plants in a garden, at increasing thresholds
  (e.g. 10, 25, 50, 100, 175, 275, 400...). Unlocked plants stay unlocked
  permanently regardless of subsequent inactivity.
- The garden renders as a simple SVG scene; plants appear as they unlock.
- A day with zero logging adds zero points and changes nothing. No wilting,
  no decay, no "your garden misses you" messaging. Ever.
- Show lifetime total and next unlock threshold. Do not show daily or weekly
  point totals.

Put all threshold and point logic in /lib/garden-logic.ts so it is tunable in
one place.

## Auth
Supabase email magic-link auth. Single user in practice. Keep it minimal.

## Also required
- CSV export button (settings or garden page): all entries, all columns.
- PWA manifest + icons so "Add to Home Screen" opens fullscreen.
- Dates handled in the user's local timezone throughout. "Today" must not
  flip at 00:00 UTC.
- Mobile-first layout. The log screen must be completable one-handed.

## Build order
1. Supabase schema + typed client + queries
2. Today screen (core → upside → numbers → note)
3. Calendar + entry editing
4. Garden
5. PWA manifest, CSV export, deploy
