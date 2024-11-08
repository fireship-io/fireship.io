---
title: Permissions
description: Secure by default
weight: 7
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462507
emoji: 🤐
video_length: 2:29
---


## Basic Security

{{< file "terminal" "command line" >}}
```bash
deno run --allow-read app.ts 
```

## Allow All

{{< file "terminal" "command line" >}}
```bash
deno run -A app.ts
```

## Granular Security


{{< file "terminal" "command line" >}}
```bash
deno run --allow-read --deny-read=./diary.txt app.ts
```