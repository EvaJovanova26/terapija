-- Migration 003: grow.
-- Items learn which room and which traits they feed; a profile row holds the avatar.
-- Safe to run more than once.

alter table public.items
  add column if not exists domain text not null default 'living'
    check (domain in ('kitchen', 'reading', 'bedroom', 'doorway', 'bathroom', 'living')),
  add column if not exists traits text[] not null default '{}';

create table if not exists public.profiles (
  user_id      uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name text null,
  avatar       jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
drop policy if exists "profiles: own row" on public.profiles;
create policy "profiles: own row" on public.profiles for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Default rooms and traits for the seeded items, matched by label.
-- Only touches items still on the default ('living' with no traits).
update public.items i set domain = d.domain, traits = d.traits
from (values
  ('Ate', 'kitchen', array['care']),
  ('Ate before 11am', 'kitchen', array['steadiness']),
  ('Water', 'kitchen', array['care']),
  ('Cooked rather than ordered', 'kitchen', array['care', 'steadiness']),
  ('Teeth', 'bathroom', array['care']),
  ('Shower', 'bathroom', array['care']),
  ('Changed clothes', 'bathroom', array['care']),
  ('Skincare routine', 'bathroom', array['care']),
  ('Meds taken', 'bathroom', array['care']),
  ('Elvanse at a consistent time', 'bathroom', array['steadiness']),
  ('Chose not to drink when you wanted to', 'bathroom', array['courage', 'care']),
  ('Therapy or psychiatry appointment attended', 'bathroom', array['courage', 'care']),
  ('Slept', 'bedroom', array['calm']),
  ('Made the bed', 'bedroom', array['steadiness']),
  ('Phone out of the bedroom', 'bedroom', array['calm']),
  ('Screens off by 11pm', 'bedroom', array['calm']),
  ('In bed by 11.30', 'bedroom', array['calm']),
  ('Full unbroken night''s sleep', 'bedroom', array['calm']),
  ('A deliberate rest day', 'bedroom', array['calm']),
  ('Left the house', 'doorway', array['courage']),
  ('Daylight before noon', 'doorway', array['steadiness']),
  ('Stepped outside within an hour of waking', 'doorway', array['steadiness']),
  ('Walk', 'doorway', array['strength']),
  ('Went somewhere new', 'doorway', array['curiosity', 'courage']),
  ('Did something that scared you slightly', 'doorway', array['courage']),
  ('Krav Maga', 'doorway', array['strength', 'courage']),
  ('Reformer Pilates', 'doorway', array['strength']),
  ('Gym session', 'doorway', array['strength']),
  ('Exercised', 'doorway', array['strength']),
  ('Replied to one message', 'living', array['warmth']),
  ('Messaged a friend first', 'living', array['warmth']),
  ('Saw someone in person', 'living', array['warmth']),
  ('Talked to someone', 'living', array['warmth']),
  ('Cancelled nothing', 'living', array['courage']),
  ('Duolingo', 'reading', array['curiosity']),
  ('Read anything', 'reading', array['curiosity']),
  ('Journalled more than a line', 'reading', array['steadiness', 'calm']),
  ('Made something', 'reading', array['curiosity']),
  ('Tidied one surface', 'reading', array['steadiness']),
  ('One admin task', 'reading', array['steadiness']),
  ('Whole day without gaming', 'reading', array['calm'])
) as d(label, domain, traits)
where i.label = d.label and i.domain = 'living' and cardinality(i.traits) = 0;
