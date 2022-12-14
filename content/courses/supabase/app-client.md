---
title: Connect to Supabase
description: How to connect to the Supabase client
weight: 21
lastmod: 2022-11-20T10:23:30-09:00
draft: false
vimeo: 773633635
emoji: 🚆
video_length: 1:33
---

Command to install Supabase React Auth helper:

```bash
yarn add @supabase/auth-ui-react
```

Command to install Supabase JS Client:

```bash
yarn add @supabase/supabase-js
```

supa-client.ts

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_API_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supaClient = createClient(supabaseUrl, supabaseKey);
```

Supabase JS Client Reference Docs: https://supabase.com/docs/reference/javascript