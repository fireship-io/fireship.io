---
title: Database Tables
description: Add a database table for usernames
weight: 21
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773628200
emoji: 🍱
video_length: 2:17
quiz: true
---

<quiz-modal options="VALIDATE:UNIQUE:CHECK:REGEX" answer="CHECK" prize="7">
  <h6>Which Postgres constraint is used to match against a regular expression?</h6>
</quiz-modal>

## Resources

Command to create a migration file from your current local Supabase state:

```bash
npx supabase db diff --use-migra --file=<name of the migration>
```

SQL to create our user profile table:

```sql
create table user_profiles (
  user_id uuid primary key references auth.users (id) not null,
  username text unique not null
  CONSTRAINT proper_username CHECK (username ~* '^[a-zA-Z0-9_]+$')
  CONSTRAINT username_length CHECK (char_length(username) > 3 and char_length(username) < 15)
);
```