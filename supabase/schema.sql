-- grow schema (fresh install). For an existing database, run the files in
-- supabase/migrations/ in order instead.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Items: the things you can tick. Per user, editable, retirable. ----------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label       text not null,
  group_name  text not null check (group_name in ('core', 'extra', 'superpower')),
  points      integer not null default 1 check (points >= 0),
  sort_order  integer not null default 0,
  domain      text not null default 'living'
    check (domain in ('kitchen', 'reading', 'bedroom', 'doorway', 'bathroom', 'living')),
  traits      text[] not null default '{}',
  retired_at  timestamptz null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists items_user_idx on public.items (user_id, group_name, sort_order);

-- Entries: one row per local calendar date. ----------------------------------
-- done_items holds the ids of ticked items. Numerics are null when not recorded.
create table if not exists public.entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date          date not null,
  done_items    uuid[] not null default '{}',
  gaming_hours  numeric null,
  alcohol_units numeric null,
  sleep_hours   numeric null,
  bedtime       time null,
  km_walked     numeric null,
  mood          smallint null check (mood between 1 and 5),
  energy        smallint null check (energy between 1 and 5),
  note          text null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint entries_user_date_unique unique (user_id, date)
);
create index if not exists entries_user_date_idx on public.entries (user_id, date desc);

-- Lifetime garden points, a high-water mark that can only go up. -----------
create table if not exists public.garden_state (
  user_id         uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  lifetime_points integer not null default 0,
  updated_at      timestamptz not null default now()
);

-- Profile: display name and avatar choices. ---------------------------------
create table if not exists public.profiles (
  user_id      uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name text null,
  avatar       jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- updated_at triggers -----------------------------------------------------------
drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at before update on public.items
  for each row execute function public.set_updated_at();
drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at before update on public.entries
  for each row execute function public.set_updated_at();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists garden_state_set_updated_at on public.garden_state;
create trigger garden_state_set_updated_at before update on public.garden_state
  for each row execute function public.set_updated_at();

-- Row Level Security ----------------------------------------------------------
alter table public.items enable row level security;
alter table public.entries enable row level security;
alter table public.garden_state enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "items: own rows" on public.items;
create policy "items: own rows" on public.items for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "entries: own rows" on public.entries;
create policy "entries: own rows" on public.entries for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "profiles: own row" on public.profiles;
create policy "profiles: own row" on public.profiles for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "garden_state: own row" on public.garden_state;
create policy "garden_state: own row" on public.garden_state for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Default items. The app calls this (via RPC) when a user has no items yet. ----
create or replace function public.seed_default_items(target uuid default auth.uid())
returns void language plpgsql security definer set search_path = public as $$
begin
  if target is null or exists (select 1 from public.items where user_id = target) then
    return;
  end if;
  insert into public.items (user_id, label, group_name, points, sort_order, domain, traits)
  select target, label, grp, pts, ord, dom, tr from (values
    ('Ate', 'core', 1, 1, 'kitchen', array['care']),
    ('Ate before 11am', 'core', 1, 2, 'kitchen', array['steadiness']),
    ('Water', 'core', 1, 3, 'kitchen', array['care']),
    ('Meds taken', 'core', 1, 4, 'bathroom', array['care']),
    ('Elvanse at a consistent time', 'core', 1, 5, 'bathroom', array['steadiness']),
    ('Slept', 'core', 1, 6, 'bedroom', array['calm']),
    ('Teeth', 'core', 1, 7, 'bathroom', array['care']),
    ('Shower', 'core', 1, 8, 'bathroom', array['care']),
    ('Changed clothes', 'core', 1, 9, 'bathroom', array['care']),
    ('Made the bed', 'core', 1, 10, 'bedroom', array['steadiness']),
    ('Daylight before noon', 'core', 1, 11, 'doorway', array['steadiness']),
    ('Left the house', 'core', 1, 12, 'doorway', array['courage']),
    ('Replied to one message', 'core', 1, 13, 'living', array['warmth']),
    ('Took something out of the flat', 'core', 1, 14, 'doorway', array['steadiness']),
    ('Walk', 'extra', 2, 1, 'doorway', array['strength']),
    ('Duolingo', 'extra', 2, 2, 'reading', array['curiosity']),
    ('Read anything', 'extra', 2, 3, 'reading', array['curiosity']),
    ('Cooked rather than ordered', 'extra', 2, 4, 'kitchen', array['care', 'steadiness']),
    ('Tidied one surface', 'extra', 2, 5, 'reading', array['steadiness']),
    ('One admin task', 'extra', 2, 6, 'reading', array['steadiness']),
    ('Messaged a friend first', 'extra', 2, 7, 'living', array['warmth']),
    ('Skincare routine', 'extra', 2, 8, 'bathroom', array['care']),
    ('Journalled more than a line', 'extra', 2, 9, 'reading', array['steadiness', 'calm']),
    ('Phone out of the bedroom', 'extra', 2, 10, 'bedroom', array['calm']),
    ('Screens off by 11pm', 'extra', 2, 11, 'bedroom', array['calm']),
    ('In bed by 11.30', 'extra', 2, 12, 'bedroom', array['calm']),
    ('Stepped outside within an hour of waking', 'extra', 2, 13, 'doorway', array['steadiness']),
    ('Krav Maga', 'superpower', 5, 1, 'doorway', array['strength', 'courage']),
    ('Reformer Pilates', 'superpower', 5, 2, 'doorway', array['strength']),
    ('Gym session', 'superpower', 5, 3, 'doorway', array['strength']),
    ('Saw someone in person', 'superpower', 5, 4, 'living', array['warmth']),
    ('Whole day without gaming', 'superpower', 5, 5, 'reading', array['calm']),
    ('Chose not to drink when you wanted to', 'superpower', 5, 6, 'bathroom', array['courage', 'care']),
    ('Went somewhere new', 'superpower', 5, 7, 'doorway', array['curiosity', 'courage']),
    ('Did something that scared you slightly', 'superpower', 5, 8, 'doorway', array['courage']),
    ('Cancelled nothing', 'superpower', 5, 9, 'living', array['courage']),
    ('Full unbroken night''s sleep', 'superpower', 5, 10, 'bedroom', array['calm']),
    ('Therapy or psychiatry appointment attended', 'superpower', 5, 11, 'bathroom', array['courage', 'care']),
    ('A deliberate rest day', 'superpower', 5, 12, 'bedroom', array['calm'])
  ) as d(label, grp, pts, ord, dom, tr);
end;
$$;
