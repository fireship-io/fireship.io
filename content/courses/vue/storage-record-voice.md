---
title: Capture Audio
description: Record a stream from the user's microphone using the MediaRecorder API
weight: 40
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403343486
emoji: 🎙️
video_length: 3:19
chapter_start: Voice Messages
---

## ChatRoom Component

Add a voice recorder. 

{{< file "vue" "ChatRoom.vue" >}}
```html
<template>
  <main class="section">

    <!-- omitted... -->

        <h5>Record Audio</h5>

        <button v-if="!recorder" @click="record()" class="button is-info">Record Voice</button>

        <button v-else @click="stop()" class="button is-danger">Stop</button>

        <br />

        <audio v-if="newAudio" :src="newAudioURL" controls></audio>

        <hr />

      </div>

      <Login v-else />
    </User>
  </main>
</template>

<script>

import User from './User.vue';
import ChatMessage from './ChatMessage.vue';
import Login from './Login.vue';
import { db, storage } from '../firebase';

export default {
  components: {
    User,
    Login,
    ChatMessage,
  },
  data() {
      return {
          newMessageText: '',
          loading: false,
          messages: [],
          newAudio: null,
          recorder: null,
      }
  },
  computed: {
     // omitted...

    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    }
  },
  methods: {
    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(this.newAudio);
      });

      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  }
};
</script>

```