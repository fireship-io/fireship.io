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