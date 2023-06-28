---
title: OAuth SignIn
description: Basic SignIn with Google
weight: 32
lastmod: 2023-06-26T10:23:30-09:00
draft: false
vimeo: 840139385
emoji: 👤
video_length: 2:00
---

## Basic SignIn Logic


{{< file "svelte" "login/+page.svelte" >}}
```svelte
<script lang="ts">
    import { auth } from "$lib/firebase";

    import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user)
    }

</script>

<h2>Login</h2>

<button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
```