---
title: Server-side Rendering - What? Why? How?
description: Key concepts related to SSR and Angular Universal
weight: 50
lastmod: 2019-07-16T10:23:30-09:00
draft: false
vimeo: 359179180
emoji: ❓
chapter_start: Server-side Rendering
video_length: 2:57
---

Determine the best rendering strategy for your use-case. You may not need SSR at all if the app does not care about search engine bots or social media link bots. 

## Strategies

### Server-side Rendering (SSR)

- Renders the app on every request
- Requires a NodeJS server 

### Prerendering

- Renders the app at build-time
- Can be deployed to Firebase Hosting
- Routes must be known in advance
