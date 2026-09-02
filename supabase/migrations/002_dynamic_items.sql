-- Migration 002: dynamic items.
-- Run in the Supabase SQL editor on a database created with the original schema.sql.
-- Safe to run more than once: every step checks whether it has already happened.
-- Moves the fixed boolean columns into a per-user "items" list, adds new context numbers,
-- and seeds the default items for every existing user. Nothing is lost.

-- 1. Items -------------------------------------------------------------------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  label       text not null,
  group_name  text not null check (group_name in ('core', 'extra', 'superpower')),
  points      integer not null default 1 check (points >= 0),
  sort_order  integer not null default 0,
  retired_at  timestamptz null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists items_user_idx on public.items (user_id, group_name, sort_order);

drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

alter table public.items enable row level security;
drop policy if exists "items: own rows" on public.items;
create policy "items: own rows" on public.items
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 2. Default items ------------------------------------------------------------
create or replace function public.seed_default_items(target uuid default auth.uid())
returns void language plpgsql security definer set search_path = public as $$
begin
  if target is null or exists (select 1 from public.items where user_id = target) then
    return;
  end if;
  insert into public.items (user_id, label, group_name, points, sort_order)
  select target, label, grp, pts, ord from (values
    ('Ate', 'core', 1, 1), ('Ate before 11am', 'core', 1, 2), ('Water', 'core', 1, 3),
    ('Meds taken', 'core', 1, 4), ('Elvanse at a consistent time', 'core', 1, 5),
    ('Slept', 'core', 1, 6), ('Teeth', 'core', 1, 7), ('Shower', 'core', 1, 8),
    ('Changed clothes', 'core', 1, 9), ('Made the bed', 'core', 1, 10),
    ('Daylight before noon', 'core', 1, 11), ('Left the house', 'core', 1, 12),
    ('Replied to one message', 'core', 1, 13), ('Took something out of the flat', 'core', 1, 14),
    ('Walk', 'extra', 2, 1), ('Duolingo', 'extra', 2, 2), ('Read anything', 'extra', 2, 3),
    ('Cooked rather than ordered', 'extra', 2, 4), ('Tidied one surface', 'extra', 2, 5),
    ('One admin task', 'extra', 2, 6), ('Messaged a friend first', 'extra', 2, 7),
    ('Skincare routine', 'extra', 2, 8), ('Journalled more than a line', 'extra', 2, 9),
    ('Phone out of the bedroom', 'extra', 2, 10), ('Screens off by 11pm', 'extra', 2, 11),
    ('In bed by 11.30', 'extra', 2, 12), ('Stepped outside within an hour of waking', 'extra', 2, 13),
    ('Krav Maga', 'superpower', 5, 1), ('Reformer Pilates', 'superpower', 5, 2),
    ('Gym session', 'superpower', 5, 3), ('Saw someone in person', 'superpower', 5, 4),
    ('Whole day without gaming', 'superpower', 5, 5),
    ('Chose not to drink when you wanted to', 'superpower', 5, 6),
    ('Went somewhere new', 'superpower', 5, 7),
    ('Did something that scared you slightly', 'superpower', 5, 8),
    ('Cancelled nothing', 'superpower', 5, 9), ('Full unbroken night''s sleep', 'superpower', 5, 10),
    ('Therapy or psychiatry appointment attended', 'superpower', 5, 11),
    ('A deliberate rest day', 'superpower', 5, 12)
  ) as d(label, grp, pts, ord);
end;
$$;

-- Seed every existing user, plus retired legacy items so old history keeps its points.
do $$
declare u record;
begin
  for u in select id from auth.users loop
    perform public.seed_default_items(u.id);
    insert into public.items (user_id, label, group_name, points, sort_order, retired_at)
    select u.id, l, 'extra', 2, 100 + i, now()
    from unnest(array['Exercised', 'Talked to someone', 'Made something']) with ordinality as t(l, i)
    where not exists (select 1 from public.items where user_id = u.id and label = t.l);
  end loop;
end;
$$;

-- 3. Entries: new columns, then move the booleans across --------------------
alter table public.entries
  add column if not exists done_items   uuid[] not null default '{}',
  add column if not exists alcohol_units numeric null,
  add column if not exists bedtime       time null,
  add column if not exists mood          smallint null check (mood between 1 and 5),
  add column if not exists energy        smallint null check (energy between 1 and 5);

-- Copy the old ticks across, then drop the old columns. Skipped if this already ran.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'entries' and column_name = 'ate'
  ) then
    update public.entries e set done_items = coalesce((
      select array_agg(i.id)
      from public.items i
      where i.user_id = e.user_id and (
        (i.label = 'Ate' and e.ate) or (i.label = 'Water' and e.water) or
        (i.label = 'Teeth' and e.teeth) or (i.label = 'Shower' and e.shower) or
        (i.label = 'Meds taken' and e.meds) or (i.label = 'Left the house' and e.left_house) or
        (i.label = 'Slept' and e.slept) or (i.label = 'Exercised' and e.exercised) or
        (i.label = 'Talked to someone' and e.talked_to_someone) or
        (i.label = 'Cooked rather than ordered' and e.cooked) or
        (i.label = 'Made something' and e.made_something))
    ), '{}')
    where cardinality(e.done_items) = 0;

    alter table public.entries
      drop column ate, drop column water, drop column teeth, drop column shower,
      drop column meds, drop column left_house, drop column slept, drop column exercised,
      drop column talked_to_someone, drop column cooked, drop column made_something;
  end if;
end;
$$;
