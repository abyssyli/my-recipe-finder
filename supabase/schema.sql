-- 1) Enable pgcrypto (usually available by default in Supabase)
create extension if not exists pgcrypto;

-- 2) Core table: saved_recipes
create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),

  -- Clerk User ID (string)
  user_id text not null,

  -- Recipe ID from TheMealDB API
  recipe_id text not null,

  recipe_name text not null,
  recipe_image text,
  category text,
  area text,

  -- Optional fields for detail pages and redirection
  source_url text,
  youtube_url text,

  -- Preview of instructions for home/collections page
  instructions_preview text,

  created_at timestamptz not null default now(),

  -- Prevent duplicate saves for the same user and recipe
  constraint saved_recipes_user_recipe_unique unique (user_id, recipe_id)
);

-- Common indexes
create index if not exists saved_recipes_user_id_idx
  on public.saved_recipes (user_id);

create index if not exists saved_recipes_created_at_idx
  on public.saved_recipes (created_at desc);

-- 3) Enable RLS (Row Level Security)
alter table public.saved_recipes enable row level security;

-- 4) RLS Policies (Using auth.jwt() ->> 'sub' to get Clerk User ID)
-- Only allow users to view their own saved recipes
create policy "Users can view own saved recipes"
on public.saved_recipes
for select
using (user_id = auth.jwt() ->> 'sub');

-- Only allow users to insert their own saved recipes
create policy "Users can insert own saved recipes"
on public.saved_recipes
for insert
with check (user_id = auth.jwt() ->> 'sub');

-- Only allow users to delete their own saved recipes
create policy "Users can delete own saved recipes"
on public.saved_recipes
for delete
using (user_id = auth.jwt() ->> 'sub');

-- Only allow users to update their own saved recipes (optional)
create policy "Users can update own saved recipes"
on public.saved_recipes
for update
using (user_id = auth.jwt() ->> 'sub')
with check (user_id = auth.jwt() ->> 'sub');

-- 5) Optional table: search_history
create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  keyword text not null,
  created_at timestamptz not null default now()
);

create index if not exists search_history_user_id_idx
  on public.search_history (user_id);

create index if not exists search_history_created_at_idx
  on public.search_history (created_at desc);

alter table public.search_history enable row level security;

create policy "Users can view own search history"
on public.search_history
for select
using (user_id = auth.jwt() ->> 'sub');

create policy "Users can insert own search history"
on public.search_history
for insert
with check (user_id = auth.jwt() ->> 'sub');

create policy "Users can delete own search history"
on public.search_history
for delete
using (user_id = auth.jwt() ->> 'sub');

-- 6) Optional table: meal_plan
create table if not exists public.meal_plan (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  recipe_id text not null,
  recipe_name text not null,
  recipe_image text,
  planned_date date not null,
  meal_type text, -- breakfast / lunch / dinner
  created_at timestamptz not null default now()
);

create index if not exists meal_plan_user_id_idx
  on public.meal_plan (user_id);

create index if not exists meal_plan_planned_date_idx
  on public.meal_plan (planned_date);

alter table public.meal_plan enable row level security;

create policy "Users can view own meal plan"
on public.meal_plan
for select
using (user_id = auth.jwt() ->> 'sub');

create policy "Users can insert own meal plan"
on public.meal_plan
for insert
with check (user_id = auth.jwt() ->> 'sub');

create policy "Users can delete own meal plan"
on public.meal_plan
for delete
using (user_id = auth.jwt() ->> 'sub');
