---
title: Hono Backend 
description: Create a web server with Node.js & Hono
weight: 10
lastmod: 2024-03-22T10:23:30-09:00
draft: false
vimeo: 927619817
emoji: 🏯
video_length: 3:22
free: true
chapter_start: Simple Project
---

### Extra Resources 

REST APIs in 100 Seconds: [YouTube Video](https://youtu.be/-MTSQjw5DrM)

### Commands

Refer to the [Hono documentation](https://hono.dev/).

```bash
npm create hono@latest my-app

cd my-app

npm run dev
```

### Prompt Template

```text
Create a basic backend server with [SOME WEB FRAMEWORK]. 
Create a GET route and POST route on the root path "/" that returns a text response with a message. Adapt the Hono code below as a reference.
```

### Code

{{< file "ts" "src/index.ts" >}}
```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  c.text('GET it')
})

app.post('/', (c) => {
  c.text('POST it')
})


const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

