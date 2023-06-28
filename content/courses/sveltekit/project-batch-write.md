---
title: Atomic Writes
description: Write multiple documents to Firestore atomically
weight: 41
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840218695
emoji: ⚛️
video_length: 1:08
---


## Batch Write

{{< file "svelte" "login/username/+page.svelte" >}}
```svelte
<script lang="ts">
  

  // ...

  async function confirmUsername() {
    console.log("confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), { 
      username, 
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: 'I am the Walrus',
      links: [
        {
          title: 'Test Link',
          url: 'https://kung.foo',
          icon: 'custom'
        }
      ]
    });

    await batch.commit();

    username = '';
    isAvailable = false;

  }

</script>
```