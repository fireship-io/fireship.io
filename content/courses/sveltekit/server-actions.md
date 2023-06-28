---
title: More Actions
description: Use actions to update user data and handle errors
weight: 53
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840282761
emoji: 💥
video_length: 3:03
---


## Backend 

{{< file "ts" "page.server.ts" >}}
```typescript
import type { PageServerLoad, Actions } from "./$types";
import { adminAuth, adminDB } from "$lib/server/admin";
import { error, fail, redirect } from "@sveltejs/kit";

export const load = (async ({ locals, params }) => {
    // ..
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ locals, request, params }) => {

      const uid = locals.userID;

      const data = await request.formData();
      const bio = data.get('bio');
  
      const userRef = adminDB.collection("users").doc(uid!);
      const { username } = (await userRef.get()).data()!;
  
      if (params.username !== username) {
        throw error(401, "That username does not belong to you");
      }
  
      if (bio!.length > 260) {
        return fail(400, { problem: "Bio must be less than 260 characters" });
      }
  
      await userRef.update({
        bio,
      });
    },
  } satisfies Actions;
```

## Frontend

{{< file "svelte" "+page.svelte" >}}
```svelte
<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  export let data: PageData;
</script>

<main class="max-w-lg prose text-center mx-auto my-6">
  <p>Current Bio: <span class="text-info">{data.bio}</span></p>

  <p>Status Code: {$page.status}</p>
  <p class="text-error">{$page.form?.problem ?? ""}</p>

  <form method="POST" use:enhance>
    <div class="form-control">
      <label for="bio" class="label">
        <span class="label-text">Your bio</span>
      </label>
      <textarea
        name="bio"
        class="textarea textarea-bordered textarea-accent"
        value={data.bio}
      />
    </div>
    <button class="btn btn-primary my-5">Update Bio</button>
  </form>
</main>
```