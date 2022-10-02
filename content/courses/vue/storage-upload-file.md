---
title: Upload
description: Upload the audio file to Firebase Storage and link it to a Firestore document
weight: 41
lastmod: 2020-04-01T10:23:30-09:00
draft: false
vimeo: 403343083
emoji: 📤
video_length: 3:33
---

## Chat Room Component

Add file uploads. 

{{< file "vue" "ChatRoom.vue" >}}
```html
<script>
import { db, storage } from '../firebase';

export default {
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
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection('messages');
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    }
  },
  methods: {
      // omitted ...
    async addMessage(uid) {

        this.loading = true;

        let audioURL = null;

        const { id: messageId } = this.messagesCollection.doc();

        if (this.newAudio) {
          const storageRef = storage
            .ref('chats')
            .child(this.chatId)
            .child(`${messageId}.wav`);

            await storageRef.put(this.newAudio);

          audioURL = await storageRef.getDownloadURL();
        }


         await this.messagesCollection.doc(messageId).set({
            text: this.newMessageText,
            sender: uid,
            createdAt: Date.now(),
            audioURL
        });

        this.loading = false;
        this.newMessageText = '';
        this.newAudio = null;
    }
};
</script>
```