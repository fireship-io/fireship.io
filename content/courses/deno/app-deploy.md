---
title: Ship it
description: How to deploy a Deno app
weight: 52
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027787685
emoji: 🚀
video_length: 4:36
---


{{< file "terminal" "command line" >}}
```bash
deno install -A jsr:@deno/deployctl --global

deployctl deploy
```

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno serve --watch --unstable-kv --env -A src/main.ts",
    "test": "deno test tests/",
    "deploy": "deployctl deploy --project YOUR_PROJECT"
  },

  "deploy": {
    "entrypoint": "src/main.ts"
  }
  
}
```