---
title: Common Examples
description: Simple, yet useful Firestore rules examples
weight: 23
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486585343
emoji: 🔑
video_length: 5:28
---

{{< file "firebase" "firestore.rules" >}}
```javascript
match /users/{userId} {

    allow read: if request.auth.uid != null;
    allow write: if request.auth.uid == userId;

}

match /todos/{docId} {

    allow read: if resource.data.status == 'published';

    allow create: if request.auth.uid == request.resource.data.uid 
                && request.time == request.resource.data.createdAt;
                

    allow update: if request.auth.uid == resource.data.uid 
                && request.resource.data.keys().hasOnly(['text', 'status']);
}

```