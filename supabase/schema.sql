-- Daily Baseline Tracker schema
-- Run in the Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date              date not null,
  ate               boolean not null default false,
  water             boolean not null default false,
  teeth             boolean not null default false,
  shower            boolean not null default false,
  meds              boolean not null default false,
  left_house        boolean not null default false,
  slept             boolean not null default false,
  exercised         boolean not null default false,
  talked_to_someone boolean not null default false,
  cooked            boolean not null default false,
  made_something    boolean not null default false,
  gaming_hours      numeric null,
  sleep_hours       numeric null,
  km_walked         numeric null,
  note              text null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint entries_user_date_unique unique (user_id, date)
);

create index if not exists entries_user_date_idx on public.entries (user_id, date desc);

-- Lifetime garden points. A high-water mark, so the number can only ever go up.
create table if not exists public.garden_state (
  user_id         uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  lifetime_points integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- Keep updated_at fresh.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

drop trigger if exists garden_state_set_updated_at on public.garden_state;
create trigger garden_state_set_updated_at
  before update on public.garden_state
  for each row execute function public.set_updated_at();

-- Row Level Security: every row is scoped to the signed-in user.
alter table public.entries enable row level security;
alter table public.garden_state enable row level security;

drop policy if exists "entries: own rows" on public.entries;
create policy "entries: own rows" on public.entries
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "garden_state: own row" on public.garden_state;
create policy "garden_state: own row" on public.garden_state
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
