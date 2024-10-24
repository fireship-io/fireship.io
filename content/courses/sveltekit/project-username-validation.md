---
title: Form Validation
description: Use reactive declarations for form validation
weight: 42
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840218660
emoji: ✅
video_length: 1:42
---

## Username Validation

{{< file "svelte" "login/username/+page.svelte" >}}
```svelte
<script lang="ts">

    // ...

    const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  
    $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
    $: isTouched = username.length > 0;
    $: isTaken = isValid && !isAvailable && !loading
  
    // ...
  </script>
  
  <AuthCheck>
  <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
    <input
      type="text"
      placeholder="Username"
      class="input w-full"
      bind:value={username}
      on:input={checkAvailability}
      class:input-error={(!isValid && isTouched)}
      class:input-warning={isTaken}
      class:input-success={isAvailable && isValid && !loading}
    />
    <div class="my-4 min-h-16 px-8 w-full">
      {#if loading}
        <p class="text-secondary">Checking availability of @{username}...</p>
      {/if}
  
      {#if !isValid && isTouched}
        <p class="text-error text-sm">
          must be 3-16 characters long, alphanumeric only
        </p>
      {/if}
  
      {#if isValid && !isAvailable && !loading}
        <p class="text-warning text-sm">
          @{username} is not available
        </p>
      {/if}
  
      {#if isAvailable}
        <button class="btn btn-success">Confirm username @{username} </button>
      {/if}
    </div>
  </form>
  
  
  </AuthCheck>
```

### Svelte 5 Version

```svelte
<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { doc, getDoc, writeBatch } from "firebase/firestore";
  let username = $state("");
  let loading = $state(false);
  let isAvailable = $state(false);
  let debounceTimer: NodeJS.Timeout;

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  let isValid =
    $derived(username?.length > 2 && username.length < 16 && re.test(username));
  let isTouched = $derived(username.length > 0);
  let isTaken = $derived(isValid && !isAvailable && !loading);

  function checkAvailability() {
    isAvailable = false;
    clearTimeout(debounceTimer);
    if (!isValid) {
      loading = false;
      return;
    }

    loading = true;

    debounceTimer = setTimeout(async () => {
      console.log("checking availability of", username);

      const ref = doc(db, "usernames", username);
      const exists = await getDoc(ref).then((doc) => doc.exists());

      isAvailable = !exists;
      loading = false;
    }, 500);
  }

  async function confirmUsername(e: SubmitEvent) {
    e.preventDefault();
    console.log("confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), {
      username,
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: "I am the Walrus",
      links: [
        {
          title: "Test Link",
          url: "https://kung.foo",
          icon: "custom",
        },
      ],
    });

    await batch.commit();

    username = "";
    isAvailable = false;
  }
</script>

<AuthCheck>
  {#if $userData?.username}
    <p class="text-lg">
      Your username is <span class="text-success font-bold"
        >@{$userData.username}</span
      >
    </p>
    <p class="text-sm">(Usernames cannot be changed)</p>
    <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
  {:else}
    <form class="w-2/5" onsubmit={confirmUsername}>
      <input
        type="text"
        placeholder="Username"
        class="input w-full"
        bind:value={username}
        oninput={checkAvailability}
        class:input-error={!isValid && isTouched}
        class:input-warning={isTaken}
        class:input-success={isAvailable && isValid && !loading}
      />
      <div class="my-4 min-h-16 px-8 w-full">
        {#if loading}
          <p class="text-secondary">Checking availability of @{username}...</p>
        {/if}

        {#if !isValid && isTouched}
          <p class="text-error text-sm">
            must be 3-16 characters long, alphanumeric only
          </p>
        {/if}

        {#if isValid && !isAvailable && !loading}
          <p class="text-warning text-sm">
            @{username} is not available
          </p>
        {/if}

        {#if isAvailable}
          <button class="btn btn-success">Confirm username @{username} </button>
        {/if}
      </div>
    </form>
  {/if}
</AuthCheck>
```