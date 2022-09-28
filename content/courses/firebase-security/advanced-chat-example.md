---
title: Chat Example
description: Chat data validation example
weight: 32
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486584623
emoji: 🛡️
video_length: 4:46
---
Firebase Rules for hypothertical chat application

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write: if false;
    }
    
    match /messages/{docId} {
 			allow read: if request.auth.uid != null;
      allow create: if canCreateMessage();
    }
    
  	function canCreateMessage() {
      let isSignedIn = request.auth.uid != null;
      let isOwner = request.auth.uid == request.resource.data.uid;
      let isNotTooLong = request.resource.data.text.size() < 255;
      let isNow = request.time == request.resource.data.createdAt;

      let isNotBanned = exists(
      	/databases/$(database)/documents/banned/$(request.auth.uid)
      ) == false;
      
      return isSignedIn && isOwner && isNotTooLong && isNow && isNotBanned;
    }
    
  }
}
```