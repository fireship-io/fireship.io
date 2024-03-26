---
title: Database Setup
description: Create a new Postgres database with Supabase
weight: 22
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927649107
emoji: 📅
video_length: 3:27
---

### Supabase Project

Create a free [Supabase](https://supabase.com/) project and database. Add your environment variables to the `.env.local` file.

Go to `auth >> providers >> email` and enable email sign-in. Set the `confirm email` option to FALSE. 

### Commands

Install the Supabase client library.

```bash
npm i @supabase/supabase-js
```


### Code

Update your `.env.local` file with the following:

{{< file "cog" ".env.local" >}}
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
SUPABASE_SECRET_KEY=
```

The `supabaseClient` file is used to interact with the Supabase on the frontend.


{{< file "ts" "utils/supabaseClient.ts" >}}
```tsx
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

The `supabaseServer` file is used to create a client that connects ONLY to a secure backend. It bypasses row-level security and is used for admin tasks.

{{< file "ts" "utils/supabaseServer.ts" >}}
```tsx
import { createClient } from '@supabase/supabase-js'
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.SUPABASE_SECRET_KEY!
)
```

Create the necessary database tables by pasting this code into the Supabase SQL editor:

```sql
create table
  public.stripe_customers (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null,
    stripe_customer_id text not null,
    total_downloads integer null default 0,
    plan_active boolean not null default false,
    plan_expires bigint null,
    subscription_id text null,
    constraint stripe_customers_pkey primary key (id),
    constraint stripe_customers_stripe_customer_id_key unique (stripe_customer_id),
    constraint stripe_customers_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;

create table
  public.downloads (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null,
    ts timestamp without time zone null default now(),
    image text null,
    constraint downloads_pkey primary key (id),
    constraint downloads_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;
```
