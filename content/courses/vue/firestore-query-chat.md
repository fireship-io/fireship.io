---
title: Query Chat Rooms
description: Query all chat rooms owned by the current user
weight: 31
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403344777
emoji: 🔍
video_length: 1:48
---

## Chat List Component

{{< file "vue" "ChatList.vue" >}}
```html
<template>
  <div>
    <ul>
      <li v-for="chat of chats" :key="chat.id">
        <router-link :to="{ name: 'chat', params: { id: chat.id } }">{{ chat.id }}</router-link>
      </li>
    </ul>

    <button @click="createChatRoom()" class="button">Create New Chat Room</button>
  </div>
</template>

<script>
import { db } from '../firebase';

export default {
  data() {
    return { 
        chats: [] 
    }
  },
  firestore() {
    return { 
        chats: db.collection('chats').where('owner', '==', this.uid) 
    }
  },
  methods: {
      async createChatRoom() {
          const newChat = await db.collection('chats').add({
              createdAt: Date.now(),
              owner: this.uid,
              members: [this.uid]
          })

            console.log(newChat)
      }


      
  },
  props: ['uid']

};
</script>
```