---
title: Security 
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Security considerations with data modeling
weight: 9
emoji: 🔥
vimeo: 330792111
video_length: 1:22

---

{{< file "firebase" "rules.json" >}}
```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    
    match /accounts/{id} {
      allow read, write: if false;
    }

    match /users/{id} {
      allow read, write: if id == request.auth.uid;
    }

    match /profiles/{id} {
      allow read;
      allow write: if id == request.auth.uid;
    }

  }
}
    
```