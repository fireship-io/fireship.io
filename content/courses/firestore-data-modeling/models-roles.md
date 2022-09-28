---
title: Role-Based Authorization
lastmod: 2019-04-16T09:12:30-08:00
draft: false
description: Role-based access control and security rules
weight: 17
emoji: 🎁
vimeo: 331445271
video_length: 3:25
---

Sample Firestore rules for Role-based Authorization where the user document determines the access level. 

{{< file "firebase" "rules.json" >}}
```js
match /posts/{document} {

    function getRoles() {
        return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles;
    }

    allow read;
    allow update: if getRoles().hasAny(['admin', 'editor']) == true;
    allow write: if getRoles().hasAny(['admin']) == true;
}
```