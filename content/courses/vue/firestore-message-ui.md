---
title: Message UI
description: Build a UI component for showing the message text
weight: 34
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403343936
emoji: 🎀
video_length: 2:32
---

## ChatRoom Component

{{< file "vue" "ChatMessage.vue" >}}
```html
<template>
  <div class="message" :class="{ 'from-user': owner }">
    {{ message.text }}
    <br />

    <audio v-if="message.audioURL" :src="message.audioURL" controls></audio>
    <br />

    <span class="sender">from UID {{ message.sender }}</span>
  </div>
</template>

<script>
export default {
    props: ['message', 'owner']
};
</script>
<style>
.message {
  background: #dddddd;
  color: black;
  margin-left: 10px;
  margin-right: auto;
  border-radius: 5px;
  padding: 12px;
  display: inline-block;
}
.from-user {
  margin-right: 10px;
  margin-left: auto;
  background: #91bbff;
}
.sender {
  font-size: 0.5rem;
}
</style>
```