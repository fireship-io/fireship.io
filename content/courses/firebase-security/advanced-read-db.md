---
title: Read Other Documents 
description: Read documents with get() and exists()
weight: 31
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486585103
emoji: 🛡️
video_length: 4:01
---

{{< file "firebase" "firestore.rules" >}}
```javascript
get(/databases/$(database)/documents/users/$(request.auth.uid))

exists(/databases/$(database)/documents/users/$(SOME_DOC_ID))
```