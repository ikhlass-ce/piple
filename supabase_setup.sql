-- SQL Setup Script for piple (media_catalog table)
-- Copy and execute this script in your Supabase SQL Editor.

create table public.media_catalog (
  id text primary key,
  title text not null,
  type text not null, -- 'movie' or 'anime'
  rating float8 not null default 8.0,
  year integer not null,
  genres jsonb not null default '[]'::jsonb, -- e.g. ["Sci-Fi", "Action"]
  duration text default '',
  episodes text default '',
  description text default '',
  poster text default '',
  banner text default '',
  videoUrl text default '',
  cast jsonb not null default '[]'::jsonb, -- e.g. ["Actor 1", "Actor 2"]
  epList jsonb default null, -- Array of episode objects
  trending boolean not null default false,
  popular boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.media_catalog enable row level security;

-- Create Policies for open client testing (adjust in production)
create policy "Allow public read access"
  on public.media_catalog for select
  using (true);

create policy "Allow public insert access"
  on public.media_catalog for insert
  with check (true);

create policy "Allow public update access"
  on public.media_catalog for update
  using (true);

create policy "Allow public delete access"
  on public.media_catalog for delete
  using (true);
