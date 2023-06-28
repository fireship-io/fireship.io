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