---
title: Animated Routes
description: How to animate route transitions in SvelteKit
weight: 31
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139426
emoji: 🎞️
video_length: 1:50
---

## Animated Route Component

{{< file "svelte" "lib/components/AnimatedRoute.svelte" >}}
```svelte
<script>
    import { fly} from "svelte/transition";
    import { page } from "$app/stores";
</script>

{#key $page.url}
  <div in:fly={{  x:'-100%', duration: 500 }}>
    <slot  />
  </div>
{/key}
```

## Login Layout

{{< file "svelte" "login/+layout.svelte" >}}
```svelte
<AnimatedRoute>
  <main>
    ...
  </main>
</AnimatedRoute>
```