---
title: AuthCheck Component
description: Show and hide content for the authenticated user
weight: 34
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139297
emoji: ⚡
video_length: 0:47
---


## AuthCheck Component

{{< file "svelte" "+page.svelte" >}}
```svelte
<script lang="ts">
    import { user } from "$lib/firebase";
</script>
  
{#if $user}
  <slot />
{:else}
    <p class="text-error">
        You must be signed in to view this page.
        <a class="btn btn-primary" href="/login">Sign in</a>
    </p>
{/if}
```

## Svelte 5 Version

```svelte
<script lang="ts">
  import { user } from "$lib/firebase";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>
  
  {#if $user}
    {@render children?.()}
  {:else}
      <p class="text-error my-10">
          You must be signed in to view this page.
          <a class="btn btn-primary" href="/login">Sign in</a>
      </p>
  {/if}
```