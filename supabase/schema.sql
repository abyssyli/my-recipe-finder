-- 1) 启用 pgcrypto（通常 Supabase 默认可用）
create extension if not exists pgcrypto;

-- 2) 核心表：saved_recipes
create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),

  -- Clerk 用户 ID，一般是字符串，不用 uuid
  user_id text not null,

  -- 外部 API（TheMealDB）里的菜谱 ID
  recipe_id text not null,

  recipe_name text not null,
  recipe_image text,
  category text,
  area text,

  -- 可选字段，方便后面做详情页 / 跳转
  source_url text,
  youtube_url text,

  -- 首页/收藏页展示时常用
  instructions_preview text,

  created_at timestamptz not null default now(),

  -- 防止同一用户重复收藏同一道菜
  constraint saved_recipes_user_recipe_unique unique (user_id, recipe_id)
);

-- 常用索引
create index if not exists saved_recipes_user_id_idx
  on public.saved_recipes (user_id);

create index if not exists saved_recipes_created_at_idx
  on public.saved_recipes (created_at desc);

-- 3) 开启 RLS（行级安全）
alter table public.saved_recipes enable row level security;

-- 4) RLS 策略 (使用 auth.jwt() ->> 'sub' 获取 Clerk 用户 ID)
-- 只允许用户查看自己的收藏
create policy "Users can view own saved recipes"
on public.saved_recipes
for select
using (user_id = auth.jwt() ->> 'sub');

-- 只允许用户插入属于自己的收藏
create policy "Users can insert own saved recipes"
on public.saved_recipes
for insert
with check (user_id = auth.jwt() ->> 'sub');

-- 只允许用户删除自己的收藏
create policy "Users can delete own saved recipes"
on public.saved_recipes
for delete
using (user_id = auth.jwt() ->> 'sub');

-- 只允许用户更新自己的收藏（可选）
create policy "Users can update own saved recipes"
on public.saved_recipes
for update
using (user_id = auth.jwt() ->> 'sub')
with check (user_id = auth.jwt() ->> 'sub');

-- 5) 可选表：search_history
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

-- 6) 可选表：meal_plan
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
