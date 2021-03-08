---
title: Query Messages
description: Query most recent messages in a subcollection of the chat room
weight: 33
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403344190
emoji: 📩
video_length: 3:48
---

## ChatRoom Component

{{< file "vue" "ChatRoom.vue" >}}
```html
<template>
  <main class="section">
    <h3>Welcome to ChatRoom.vue {{ chatId }}</h3>

    <User #user="{ user }">
      <div v-if="user">
        <ul>
          <li v-for="message of messages" :key="message.id">
            {{ message.text }}
          </li>
        </ul>

        <input v-model="newMessageText" class="input" />

        <button
          :disabled="!newMessageText || loading"
          class="button is-success"
          type="text"
          @click="addMessage(user.uid)"
        >Send</button>

      </div>

      <Login v-else />

    </User>

  </main>
</template>

<script>

import User from './User.vue';
import Login from './Login.vue';
import { db, storage } from '../firebase';

export default {
  components: {
    User,
    Login
  },
  data() {
      return {
          newMessageText: '',
          loading: false,
          messages: [],
      }
  },
  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection('messages');
    },
  },
  firestore() {
    return {
      messages: this.messagesCollection.orderBy('createdAt').limitToLast(10)
    };
  },
    methods: {
      async addMessage(uid) {

          this.loading = true;

          const { id: messageId } = this.messagesCollection.doc();

           await this.messagesCollection.doc(messageId).set({
              text: this.newMessageText,
              sender: uid,
              createdAt: Date.now(),

          });
      }
    },
};
</script>
```
