---
title: Anonymous Auth
description: Basic user authentication with Firebase
weight: 20
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403195865
emoji: 👤
video_length: 2:02
chapter_start: User Authentication
---


## Login Component

{{< file "vue" "Login.vue" >}}
```html
<template>
  <aside class="section">
    <h3>Sign in Anonymously</h3>
    <button class="button" @click="auth.signInAnonymously()">Sign In</button>
    </aside>
</template>

<script>
import { auth } from '../firebase';

export default {
  data() {
    return {
      auth,
    }
  },
}
</script>
```
