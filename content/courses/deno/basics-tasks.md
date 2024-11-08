---
title: Tasks
description: Organize commands with Tasks
weight: 8
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462491
emoji: 🤖
video_length: 3:10
---




## Cool Ways to use Tasks in Deno

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno run --watch main.ts", // Watch a task
    "build": "deno run npm:build", // Use an NPM script
    "all": "first ; second", // Run first and second, even if first task fails
    "sequential": "first && second", // Run only if first task succeeds
    "backup": "first || second", // Run only if first task fails
    "async": "first & second" // Run both concurrently
  },
}
```


