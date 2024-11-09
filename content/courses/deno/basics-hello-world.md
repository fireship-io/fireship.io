---
title: Hello Deno
description: Say "hello world" with Deno
weight: 02
lastmod: 2024-11-05T11:11:30-09:00
draft: false
vimeo: 1027305898
emoji: 🦖
video_length: 3:47
free: true
quiz: true
---

<quiz-modal options="deno upgrade:deno up:nvm:deno version manager" answer="deno upgrade" prize="1">
  <h5>How do you update your machine with the lastest version of Deno?</h5>
</quiz-modal>


## Course Resources

- [Deno Installation and Docs](https://docs.deno.com/runtime/getting_started/installation/)
- [Project Source Code](https://github.com/fireship-io/deno-course)
- [Project Live Demo](https://link.fireship.app)


## Create a New Project

{{< file "terminal" "command line" >}}
```bash
deno init my-app
```

## Hello World

{{< file "ts" "main.ts" >}}
```typescript
function helloWorld() {
  console.log('Main?', import.meta.main)
  return "Hi Mom!"
}

if (import.meta.main) {
  console.log(helloWorld());
}
```