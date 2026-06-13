-- ═══════════════════════════════════════════════════════════════
-- VƯỜN VUA RESORT — Supabase setup
-- Run in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. PROFILES (extends auth.users) ──────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'user',  -- 'admin' | 'user'
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users read own profile"
  on profiles for select to authenticated
  using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update to authenticated
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── 2. POSTS (SEO blog) ───────────────────────────────────────
create table if not exists posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  content          text not null,
  excerpt          text,
  meta_description text,
  cover_image      text,
  category         text not null default 'guide',
  tags             text[] default '{}',
  author_id        text not null,
  author_name      text not null,
  status           text not null default 'draft',
  comment_count    int not null default 0,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── 3. COMMENTS (with replies) ────────────────────────────────
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  parent_id   uuid references comments(id) on delete cascade,
  author_name text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ── 4. BOOKINGS (customers) ───────────────────────────────────
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone_num  text not null,
  checkin    date not null,
  checkout   date not null,
  numbers    text not null,
  service    text not null,
  status     text not null default 'new',
  created_at timestamptz not null default now()
);

-- ── 5. COMMENT COUNT TRIGGER ──────────────────────────────────
create or replace function update_comment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set comment_count = greatest(comment_count - 1, 0) where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists on_comment_change on comments;
create trigger on_comment_change
  after insert or delete on comments
  for each row execute function update_comment_count();

-- ── 6. ROW LEVEL SECURITY ─────────────────────────────────────
alter table posts enable row level security;
alter table comments enable row level security;
alter table customers enable row level security;

-- Posts: public read published
drop policy if exists "Public read published posts" on posts;
create policy "Public read published posts"
  on posts for select using (status = 'published');

-- Posts: authors manage own
drop policy if exists "Authors read own posts" on posts;
create policy "Authors read own posts"
  on posts for select to authenticated
  using (author_id = auth.uid()::text);

drop policy if exists "Authors insert posts" on posts;
create policy "Authors insert posts"
  on posts for insert to authenticated
  with check (author_id = auth.uid()::text);

drop policy if exists "Authors update own posts" on posts;
create policy "Authors update own posts"
  on posts for update to authenticated
  using (author_id = auth.uid()::text);

drop policy if exists "Authors delete own posts" on posts;
create policy "Authors delete own posts"
  on posts for delete to authenticated
  using (author_id = auth.uid()::text);

-- Comments: public read on published posts
drop policy if exists "Public read comments" on comments;
create policy "Public read comments"
  on comments for select using (
    exists (select 1 from posts where posts.id = comments.post_id and posts.status = 'published')
  );

-- Comments: anyone can insert on published posts
drop policy if exists "Anyone insert comments" on comments;
create policy "Anyone insert comments"
  on comments for insert with check (
    exists (select 1 from posts where posts.id = comments.post_id and posts.status = 'published')
  );

-- Comments: authenticated authors can read all on their posts + delete
drop policy if exists "Authors read comments on own posts" on comments;
create policy "Authors read comments on own posts"
  on comments for select to authenticated
  using (
    exists (
      select 1 from posts
      where posts.id = comments.post_id and posts.author_id = auth.uid()::text
    )
  );

drop policy if exists "Authors delete comments on own posts" on comments;
create policy "Authors delete comments on own posts"
  on comments for delete to authenticated
  using (
    exists (
      select 1 from posts
      where posts.id = comments.post_id and posts.author_id = auth.uid()::text
    )
  );

-- Bookings: anon can insert
drop policy if exists "Anyone insert booking" on customers;
create policy "Anyone insert booking"
  on customers for insert with check (true);

-- Bookings: only authenticated can read (admin dashboard later)
drop policy if exists "Auth read bookings" on customers;
create policy "Auth read bookings"
  on customers for select to authenticated using (true);

-- ═══════════════════════════════════════════════════════════════
-- ACCOUNT SETUP (do this in Supabase Dashboard)
-- ═══════════════════════════════════════════════════════════════
--
-- 1. Authentication → Providers → Email: enable
-- 2. Authentication → Users → Add user:
--      Email: admin@vuonvua.vn
--      Password: (your secure password)
--      User Metadata JSON:
--        { "full_name": "Admin Vườn Vua", "role": "admin" }
-- 3. Run this SQL file
-- 4. Copy Project URL + anon key into js/supabase.js (already set)
-- 5. Login at dashboard.html with the admin account
--
-- Tables created:
--   profiles   — user accounts (linked to auth.users)
--   posts      — SEO blog articles
--   comments   — guest comments + replies (parent_id)
--   customers  — booking form submissions
-- ═══════════════════════════════════════════════════════════════
