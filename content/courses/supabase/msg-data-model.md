---
title: Normalized Data Modeling
description: Learn how to model data in a relational database
weight: 42
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773630081
emoji: 📊
video_length: 3:40
---

Link to final state of the original-ddl.sql: https://github.com/fireship-io/supaship.io/blob/course-end-point/supabase/migrations/20221116184131_original-ddl.sql

original-ddl.sql:

```sql
create extension ltree;

create table user_profiles (
  user_id uuid primary key references auth.users (id) not null,
  username text unique not null
  CONSTRAINT proper_username CHECK (username ~* '^[a-zA-Z0-9_]+$')
  CONSTRAINT username_length CHECK (char_length(username) > 3 and char_length(username) < 15)
);

create table posts (
    id uuid primary key default uuid_generate_v4() not null,
    user_id uuid references auth.users (id) not null,
    created_at timestamp with time zone default now() not null,
    path ltree not null
);

create table post_score (
    post_id uuid primary key references posts (id) not null,
    score int not null
);

create table post_contents (
    id uuid primary key default uuid_generate_v4() not null,
    user_id uuid references auth.users (id) not null,
    post_id uuid references posts (id) not null,
    title text,
    content text,
    created_at timestamp with time zone default now() not null
);

create table post_votes (
    id uuid primary key default uuid_generate_v4() not null,
    post_id uuid references posts (id) not null,
    user_id uuid references auth.users (id) not null,
    vote_type text not null,
    unique (post_id, user_id)
);

create function initialize_post_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $initialize_post_score$
begin
    insert into post_score (post_id, score)
    values (new.id, 0);
    return new;
end;$initialize_post_score$;

create trigger initialize_post_score
    after insert
    on posts
    for each row execute procedure initialize_post_score();

create function update_post_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $update_post_score$
begin
update post_score
        set score = (
            select sum(case when vote_type = 'up' then 1 else -1 end)
            from post_votes
            where post_id = new.post_id
        )
        where post_id = new.post_id;
        return new;
end;$update_post_score$;

create trigger update_post_score
    after insert or update
    on post_votes
    for each row execute procedure update_post_score();

create function get_posts(page_number int)
returns table (
    id uuid,
    user_id uuid,
    created_at timestamp with time zone,
    title text,
    score int,
    username text
)
language plpgsql
as $$
begin
    return query
    select posts.id, posts.user_id, posts.created_at, post_contents.title, post_score.score, user_profiles.username
    from posts
    join post_contents on posts.id = post_contents.post_id
    join post_score on posts.id = post_score.post_id
    join user_profiles on posts.user_id = user_profiles.user_id
    where posts.path ~ 'root'
    order by post_score.score desc, posts.created_at desc
    limit 10
    offset (page_number - 1) * 10;
end;$$;

create function get_single_post_with_comments(post_id uuid)
returns table (
    id uuid,
    author_name text,
    created_at timestamp with time zone,
    title text,
    content text,
    score int,
    path ltree
)
language plpgsql
as $$
begin
    return query
    select
      posts.id,
      user_profiles.username,
      posts.created_at,
      post_contents.title,
      post_contents.content,
      post_score.score,
      posts.path
    from posts
    join post_contents on posts.id = post_contents.post_id
    join post_score on posts.id = post_score.post_id
    join user_profiles on posts.user_id = user_profiles.user_id
    where
      posts.path <@ text2ltree(concat('root.', replace(concat($1, ''), '-', '_')))
    or
      posts.id = $1;
end;$$;

create function create_new_post("userId" uuid, "title" text, "content" text)
returns boolean
language plpgsql
as $$
begin
  with
    "inserted_post" as (
      insert into "posts" ("user_id", "path")
      values ($1, 'root')
      returning "id"
    )
  insert into "post_contents" ("post_id", "title", "content", "user_id")
  values ((select "id" from "inserted_post"), $2, $3, $1);
  return true;
end; $$;

create function create_new_comment(user_id uuid, content text, path ltree)
returns boolean
language plpgsql
as $$
begin
  with
    inserted_post as (
      insert into posts (user_id, path)
      values ($1, $3)
      returning id
    )
  insert into post_contents (post_id, title, content, user_id)
  values ((select id from inserted_post), '', $2, $1);
  return true;
end; $$;

alter table user_profiles enable row level security;
alter table posts enable row level security;
alter table post_contents enable row level security;
alter table post_score enable row level security;
alter table post_votes enable row level security;

CREATE POLICY "all can see" ON "public"."user_profiles"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "users can insert" ON "public"."user_profiles"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "owners can update" ON "public"."user_profiles"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid()=user_id)
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "all can see" ON "public"."post_contents"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "authors can create" ON "public"."post_contents"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "all can see" ON "public"."post_score"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "all can see" ON "public"."post_votes"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "owners can insert" ON "public"."post_votes"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "owners can update" ON "public"."post_votes"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid()=user_id)
WITH CHECK (auth.uid()=user_id);

CREATE POLICY "all can see" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "owners can insert" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (auth.uid()=user_id);

BEGIN;

DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;

CREATE PUBLICATION supabase_realtime WITH ( publish = 'insert, update, delete' );

ALTER PUBLICATION supabase_realtime ADD TABLE post_score;

COMMIT;
```

Interfaces for our rpc return types:

```ts
export interface GetPostsResponse {
  created_at: string;
  id: string;
  score: number;
  title: string;
  user_id: string;
  username: string;
}

export interface GetSinglePostWithCommentResponse {
  author_name: string;
  content: string;
  created_at: string;
  id: string;
  path: string;
  score: number;
  title: string;
}
```
