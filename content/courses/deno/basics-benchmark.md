---
title: Deno Bench
description: Benchmark your JavaScript performance
weight: 11
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027462536
emoji: 🏋️
video_length: 7:35
free: true
---

## Deno Benchmark for Regex

{{< file "ts" "main.ts" >}}
```typescript
const testString = "Hello, my email is test@example.com and another.email@domain.co.uk";
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const preCompiledRegex = new RegExp(emailPattern);

Deno.bench({
    name: "Runtime regex",
    baseline: true,
    fn: () => {
        const regex = new RegExp(emailPattern);
        regex.test(testString);
    }
});

Deno.bench({
    name: "Precompiled exec",
    fn: () => {
        preCompiledRegex.exec(testString);
    }
});

Deno.bench({
    name: "Precompiled match",
    fn: () => {
        preCompiledRegex.test(testString);
    }
});

Deno.bench({
    name: "Literal",
    fn: () => {
       /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(testString);
    }
});
```