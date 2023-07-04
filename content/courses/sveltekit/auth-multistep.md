---
title: Multi-step Forms
description: Use SvelteKit layouts to build multi-step forms
weight: 30
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139461
emoji: 👤
video_length: 1:50
chapter_start: User Management
---

## Create Routes

- login/+page.svelte
- login/+layout.svelte
- login/photo/+page.svelte
- login/username/+page.svelte

## Root Layout

{{< file "svelte" "+layout.svelte" >}}
```svelte
<div class="min-h-screen flex flex-col">
    <slot />
</div>
```

## Login Layout

{{< file "svelte" "login/+layout.svelte" >}}
```svelte
<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav class="flex justify-center my-6">
  <ul class="steps">
    <a href="/login" class="step step-primary">Sign In</a>
    <a
      href="/login/username"
      class="step"
      class:step-primary={$page.route.id?.match(/username|photo/g)}>
      Choose Username
    </a>
    <a
      href="/login/photo"
      class="step"
      class:step-primary={$page.route.id?.includes("photo")}>
      Upload Photo
    </a>
  </ul>
</nav>

<main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
  <div class="card-body items-center text-center">
    <slot />
  </div>
</main>
```
