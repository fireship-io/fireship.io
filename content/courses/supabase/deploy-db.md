---
title: Database Deployment
description: Setup your database for production deployment
weight: 50
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773631044
emoji: 🚀
video_length: 3:01
chapter_start: Deployment
---

Command to link to your production db (requires your DB password and your access token):

```bash
npx supabase link --project-ref=<ref in your supabase url> --password=<db password>
```

Link to create a new access token: https://app.supabase.com/account/tokens

Command to store your access token:

```bash
npx supabase login
```

Command to push your local migrations to production (requires DB password):

```bash
npx supabase db push
```

Command to generate new migration file on your local instance:

```bash
npx supabase migration new <migration name>
```

Command to check what migrations will be pushed before you push them (requires DB password):

```bash
npx supabase db push --dry-run
```

Create a migration script for updates we made directly to the post db (requires DB password):

```bash
npx supbase db remote commit
```
