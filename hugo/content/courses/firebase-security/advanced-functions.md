---
title: Functions
description: Extracting complex logic into reusable functions
weight: 30
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486584897
emoji: 🛡️
video_length: 4:29
chapter_start: Advanced Concepts 
---

{{< file "firebase" "firestore.rules" >}}
```javascript
    match /users/{userId} {

      allow read: if isLoggedIn();
      allow write: if belongsTo(userId);

    }

    match /todos/{docId} {

      allow read: if resource.data.status == 'published';

      allow create: if canCreateTodo();
                    

      allow update: if belongsTo() 
                    && request.resource.data.keys().hasOnly(['text', 'status']);
    }

    function isLoggedIn() { 
      return request.auth.uid != null;
    }

    function belongsTo(userId) {    
      return request.auth.uid == userId || request.auth.uid == resource.data.uid;
    }

    function canCreateTodo() {
      let uid = request.auth.uid;
      let hasValidTimestamp = request.time == request.resource.data.createdAt;

      return belongsTo(uid) && hasValidTimestamp;
    }
    
```