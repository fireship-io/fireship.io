---
title: Routing
description: How file system routing works
weight: 4
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 839877956
emoji: 🚅
video_length: 3:23
quiz: true
free: true
---

<quiz-modal options="+page.server.ts:+error.svelte:+layout.ts:+loading.ts" answer="+loading.ts" prize="1">
  <h5>Which file is NOT special in SvelteKit?</h5>
</quiz-modal>

## SvelteKit Pages Cheat Sheet

⚡Bookmark the routing page from the [SvelteKit Routing Docs](https://kit.svelte.dev/docs/routing)

##### Page

- `+page.svelte` main UI for a route.  
- `+page.ts` fetch data for a page, runs on client and server. 
- `+page.server.ts` fetch data for a page, runs on server only. 

##### Layout

- `+layout.svelte` share UI across multiple child routes.  
- `+layout.ts` fetch data for a layout, runs on client and server. 
- `+layout.server.ts` fetch data for a layout, runs on server only. 

##### Server 

- `+server.ts` used to build API routes that handle different HTTP verbs and non-HTML response types.

##### Error

- `+error.svelte` will be rendered if server-side data fetching or rendering fails.
