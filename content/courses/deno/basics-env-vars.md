---
title: Env Vars
description: Manage Environment Variables
weight: 9
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027533510
emoji: ⚙️
video_length: 2:15
---

## How to Access Environment Variables

{{< file "ts" "app.ts" >}}
```typescript
const code = Deno.env.get('KILLCODE')
```

## Set Environment Variables with Dotenv

{{< file "terminal" ".env" >}}
```bash
KILLCODE=hello
```

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno run --env app.ts"
  }
}
```

## Set Environment Variables in a Task

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "export KILLCODE=hello && deno run app.ts"
  }
}
```
