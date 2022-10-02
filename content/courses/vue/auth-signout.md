---
title: User Profile
description: Create a user profile where the user can sign out
weight: 22
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403345834
emoji: 👋
video_length: 1:51
---

## User Profile Component

{{< file "vue" "UserProfile.vue" >}}
```html
<template>
  <div>
    Logged in as {{ user.uid }}<br>
    <button @click="auth.signOut()" class="button">Sign Out</button>
  </div>
</template>

<script>
import { auth } from '../firebase';

export default {
  data() {
    return { 
          auth 
    }
  },
  props: ['user']
}
</script>
```
