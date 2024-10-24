---
title: Custom Usernames
description: Implement custom usernames with Firestore
weight: 40
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139219
emoji: 🧑‍🎤
video_length: 3:39
chapter_start: Advanced Features
---

## Usernames Page

{{< file "svelte" "login/username/+page.svelte" >}}
```svelte
<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user } from "$lib/firebase";
  import { doc, getDoc, writeBatch} from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;

  
  let debounceTimer: NodeJS.Timeout;

  async function checkAvailability() {
    isAvailable = false;
    clearTimeout(debounceTimer);

    loading = true;

    debounceTimer = setTimeout(async () => {
        console.log("checking availability of", username);
        
        const ref = doc(db, "usernames", username);
        const exists = await getDoc(ref).then((doc) => doc.exists());

        isAvailable = !exists;
        loading = false;

    }, 500);

  }

  async function confirmUsername() {
    // TODO
  }

</script>



<AuthCheck>
    <h2>Username</h2>
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
        <input
          type="text"
          placeholder="Username"
          class="input w-full"
          bind:value={username}
          on:input={checkAvailability}
        />

        <p>Is available? {isAvailable}</p>

        <button class="btn btn-success">Confirm username @{username} </button>

      </form>

</AuthCheck>
```



## Firestore Rules

In production, you will need strong rules to prevent username manipulation. 

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    
      match /users/{userId} {
      	allow read;
        allow create: if isValidUser(userId);
        allow update: if request.auth.uid == userId;
      }
    
      match /usernames/{username} {
      	allow read;
        allow create: if isValidUsername(username);
      }
      
      function isValidUsername(username) {
				let isOwner = request.auth.uid == request.resource.data.uid;
        let isValidLength = username.size() >= 3 && username.size() <= 15;
        let isValidUserDoc = getAfter(/databases/$(database)/documents/users/$(request.auth.uid)).data.username == username;
        
        return isOwner && isValidLength && isValidUserDoc;     
      }
      
      function isValidUser(userId) {
        let isOwner = request.auth.uid == userId;
      	let username = request.resource.data.username;
        let createdValidUsername = existsAfter(/databases/$(database)/documents/usernames/$(username));
        
        return isOwner && createdValidUsername;
      }
  }
}
```


## Svelte 5 Version

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