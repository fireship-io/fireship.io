---
title: Project Structure
description: How to structure a deno project
weight: 41
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027117775
emoji: 🧱
video_length: 2:59
---

## Updated Deno Config

{{< file "deno" "deno.json" >}}
```json
{
  "tasks": {
    "dev": "deno serve --watch -A src/main.ts",
    "test": "deno test tests/",
  }
}
```