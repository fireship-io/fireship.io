---
title: Allow - Read, Write, & Beyond
description: What operations can you allow in Firestore?
weight: 21
lastmod: 2020-11-20T10:11:30-02:00
draft: false
emoji: 🔑
vimeo: 486619225
video_length: 1:42
---

{{< file "firebase" "firestore.rules" >}}
```javascript
  match /users/{docId=**} {

      allow read, write;

      allow get;
      allow list;

      allow create;
      allow update;
      allow delete;
      
    }
```