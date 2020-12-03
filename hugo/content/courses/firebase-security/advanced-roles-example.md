---
title: Role-based Auth Example
description: Role-based access control example
weight: 33
lastmod: 2020-11-20T10:11:30-02:00
draft: false
vimeo: 486556875
emoji: 🛡️
video_length: 5:44
---

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {


    match /users/{userId} {
        
      allow read: if isSignedIn();
      allow update, delete: if hasAnyRole(['admin']);
      
    }

    match /posts/{postId} {
        allow read: if ( isSignedIn() && resource.data.published ) || hasAnyRole(['admin']);
        allow create: if isValidNewPost() && hasAnyRole(['author']);
        allow update: if isValidUpdatedPost() && hasAnyRole(['author', 'editor', 'admin']);
        allow delete: if hasAnyRole(['admin']);
    }


    function isSignedIn() {
      return request.auth != null;
    }

    function hasAnyRole(roles) {
      return isSignedIn()
              && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(roles)
    }

    function isValidNewPost() {
      let post = request.resource.data;
      let isOwner = post.uid == request.auth.uid;
      let isNow = request.time == request.resource.data.createdAt;
      let hasRequiredFields = post.keys().hasAll(['content', 'uid', 'createdAt', 'published']);

      return isOwner && hasRequiredFields && isNow;
    }

    function isValidUpdatedPost() {
      let post = request.resource.data;
      let hasRequiredFields = post.keys().hasAny(['content', 'updatedAt', 'published']);
      let isValidContent = post.content is string && post.content.size() < 5000;

      return hasRequiredFields && isValidContent;
    }
    
  }
}

```