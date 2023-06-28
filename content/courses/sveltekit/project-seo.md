---
title: SEO Pages
description: Universal data fetching for SEO friendly pages
weight: 45
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840218504
emoji: 📰
video_length: 3:17
---



## Universal Data Fetching 

{{< file "ts" "[username]/+page.ts" >}}
```typescript
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import type { PageLoad } from "./$types";
import { db } from "$lib/firebase";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
    
  const collectionRef = collection(db, "users");

  const q = query(
    collectionRef,
    where("username", "==", params.username),
    limit(1)
  );
  const snapshot = await getDocs(q);
  const exists = snapshot.docs[0]?.exists();
  const data = snapshot.docs[0]?.data();

  if (!exists) {
    throw error(404, "that user does not exist!");
  }

  if (!data.published) {
    throw error(403, `The profile of @${data.username} is not public!`);
  }

  return {
    username: data.username,
    photoURL: data.photoURL,
    bio: data.bio,
    links: data.links ?? [],
  };
}) satisfies PageLoad;

```

## SEO Optimized Page

{{< file "svelte" "[username]/+page.svelte" >}}
```svelte
<script lang="ts">
    import type { PageData } from "./$types";
    
    export let data: PageData;
  </script>
  
  <svelte:head>
    <title>@{data.username} Links</title>
    <meta name="description" content={data.bio} />
  </svelte:head>
  
  
  <main class="prose text-center mx-auto mt-8">

    <h1 class="text-7xl text-purple-500">
      @{data.username}
    </h1>
  
    <img
      src={data.photoURL ?? "/user.png"}
      alt="photoURL"
      width="256"
      class="mx-auto"
    />
  
    <p class="text-xl my-8">{data.bio ?? "no bio yet..."}</p>
    <ul class="list-none">
      {#each data.links as item}
        {@debug item}
      {/each}
    </ul>
  
  </main>
  
```