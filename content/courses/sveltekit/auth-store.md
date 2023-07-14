---
title: Auth Store
description: Access the current user with Svelte stores
weight: 33
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139336
emoji: ⚡
video_length: 2:37
---


## SvelteFire

You can skip the code and just install [SvelteFire](https://github.com/codediodeio/sveltefire) to use this store.

## Simple Store

A simple implementation for prototyping

{{< file "ts" "firebase.ts" >}}
```typescript
const currentUser = writable<User | null>(null);

onAuthStateChanged(auth, (user) => {
  currentUser.set(user);
});
```

## Custom Store

Full implementation with unsubscribe and SSR support. 

{{< file "ts" "firebase.ts" >}}
```typescript
/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn('Auth is not initialized or not in browser');
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    }
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();
```

## Signin logic

{{< file "svelte" "login/+page.svelte" >}}

```svelte
<h2>Login</h2>

{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You are logged in</p>
  <button class="btn btn-warning" on:click={() => signOut(auth)}>Sign out</button>
{:else}
  <button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}
```
