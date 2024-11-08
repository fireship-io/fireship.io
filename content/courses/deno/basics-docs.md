---
title: Instant Docs
description: Automatically generate documentation
weight: 6
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305856
emoji: 📑
video_length: 1:26
---



## Generate Documentation for TS Code

{{< file "ts" "lib.ts" >}}
```typescript
/**
 * Multiplies two numbers together.
 */
export function multiply(a: number, b: number) {
    return a * b;
}
```


{{< file "terminal" "command line" >}}
```bash
deno doc --html --name="My library" lib.ts
```