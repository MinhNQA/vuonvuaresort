-- Run this in Supabase → SQL Editor
-- Then create an admin user in Authentication → Users

-- Posts table
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  content       text not null,
  excerpt       text,
  cover_image   text,
  category      text not null default 'discussion',
  tags          text[] default '{}',
  author_id     text not null,
  author_name   text not null,
  status        text not null default 'draft',
  upvotes       int not null default 0,
  comment_count int not null default 0,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Comments table
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  author_name text not null,
  content     text not null,
  upvotes     int not null default 0,
  created_at  timestamptz not null default now()
);

-- Auto-update comment_count
create or replace function update_comment_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update posts set comment_count = comment_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists on_comment_change on comments;
create trigger on_comment_change
  after insert or delete on comments
  for each row execute function update_comment_count();

-- Row Level Security
alter table posts enable row level security;
alter table comments enable row level security;

-- Anyone can read published posts
create policy "Public read published posts"
  on posts for select
  using (status = 'published');

-- Authenticated users can read all their own posts
create policy "Authors read own posts"
  on posts for select
  to authenticated
  using (author_id = auth.uid()::text);

-- Authenticated users can insert posts
create policy "Authors insert posts"
  on posts for insert
  to authenticated
  with check (author_id = auth.uid()::text);

-- Authenticated users can update own posts
create policy "Authors update own posts"
  on posts for update
  to authenticated
  using (author_id = auth.uid()::text);

-- Authenticated users can delete own posts
create policy "Authors delete own posts"
  on posts for delete
  to authenticated
  using (author_id = auth.uid()::text);

-- Anyone can read comments on published posts
create policy "Public read comments"
  on comments for select
  using (
    exists (
      select 1 from posts
      where posts.id = comments.post_id and posts.status = 'published'
    )
  );

-- Anyone can post comments (guest comments)
create policy "Anyone insert comments"
  on comments for insert
  with check (
    exists (
      select 1 from posts
      where posts.id = comments.post_id and posts.status = 'published'
    )
  );

-- Allow anon to update upvotes on published posts
create policy "Public upvote posts"
  on posts for update
  using (status = 'published')
  with check (status = 'published');
