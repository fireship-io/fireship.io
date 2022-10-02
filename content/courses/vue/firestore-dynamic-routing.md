---
title: Dynamic Routing
description: Load a chat room based on its document ID with the Vue Router
weight: 32
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403344582
emoji: 🚉
video_length: 2:14
---

## Router Config

{{< file "js" "main.js" >}}
```javascript
import ChatRoom from './components/ChatRoom'

const router = new VueRouter({
  routes: [

    { path: '/chats/:id', component: ChatRoom, name: 'chat' }
  ]
})
```

## Router Link

```html
<router-link :to="{ name: 'chat', params: { id: chat.id } }">{{ chat.id }}</router-link>
```

## ChatRoom Component

{{< file "vue" "ChatRoom.vue" >}}
```html
<template>
  <main class="section">
    <h3>Welcome to ChatRoom.vue {{ chatId }}</h3>

    <router-link to="/">Back</router-link>

  </main>
</template>

<script>

export default {
  computed: {
    chatId() {
      return this.$route.params.id;
    },
  },

};
</script>
```