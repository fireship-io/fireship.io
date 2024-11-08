---
title: WTF is meta.main?
description: Run code in context with meta.main
weight: 03
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305878
emoji: 🚛
video_length: 2:04
free: true
---

## Meta Main Example

{{< file "ts" "main.ts" >}}
```typescript
export function helloWorld() {
  console.log('Main?', import.meta.main)
  return "Hi Mom!"
}

if (import.meta.main) {
  console.log(helloWorld());
}
```

Import the function in a different file:

{{< file "ts" "lib.ts" >}}
```typescript
import { helloWorld } from './main'
helloWorld()
```

If you run the main file, the value is logged in side `meta.main`

{{< file "terminal" "command line" >}}
```bash
deno run main.ts
```

But if you run the lib file, it will NOT run the code inside `meta.main`

{{< file "terminal" "command line" >}}
```bash
deno run lib.ts
```