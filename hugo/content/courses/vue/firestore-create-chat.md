---
title: Create Chat Rooms
description: Create a chat room in Firestore linked to the current user
weight: 30
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403344975
emoji: 💬
video_length: 2:50
chapter_start: Firestore Chat
---

## Chat List Component

{{< file "vue" "ChatList.vue" >}}
```html
<template>
  <div>
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