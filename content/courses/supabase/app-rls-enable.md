---
title: Enable RLS
description: How to enable Row Level Security
weight: 23
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773628507
emoji: 🚔
video_length: 1:53
---

Turning on RLS via SQL:

```sql
alter table <table name> enable row level security
```

RLS Policies for the user_profile table:

```sql
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
```