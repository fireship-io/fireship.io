---
title: Match
description: Path match security rules to documents & collections
weight: 20
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486619288
emoji: 🔑
chapter_start: Firestore Rules Concepts
video_length: 3:19
---

{{< file "firebase" "firestore.rules" >}}
```javascript
match /users/jeffd23 {
    // Single document
}

match /users/{userId} {
    // Single Collection
}

match /posts/{postId=**} {
    // Recursive wildcard, includes all subcollections
}
```