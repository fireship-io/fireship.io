---
title: Backend Security
description: Use Firestore Rules to ensure features are secure across the entire stack
weight: 60
lastmod: 2021-02-01T10:23:30-09:00
draft: false
vimeo: 508705383
emoji: 🔐
video_length: 6:30
chapter_start: Deploy
---


## Complete Firestore Rules

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {

      
      // Required for collection group queries
      match /posts/{postId} {
      	allow read;
      }
      
      
      match /users/{userId} {
      	allow read;
        allow create: if isValidUser(userId);
      }
      
      match /usernames/{username} {
      	allow read;
        allow create: if isValidUsername(username);
      }

      
      match /users/{userId}/posts/{postId} {
      	allow read;
        allow create: if canCreatePost(userId); 
        allow update: if canUpdatePost(userId) || canIncrementHearts(userId, postId);
        allow delete: if request.auth.uid == userId;
      }
      
      match /users/{userId}/posts/{postId}/hearts/{heartId} {
      		allow read;
        	allow write: if request.auth.uid == heartId;
      }

      
      
      function canCreatePost(userId) {
        let isOwner = request.auth.uid == userId;
        let isNow = request.time == request.resource.data.createdAt;
        let isValidContent = request.resource.data.content.size() < 20000 && request.resource.data.heartCount == 0;
        let username = get(/databases/$(database)/documents/users/$(request.auth.uid)).data.username;
        let usernameMatches = username == request.resource.data.username;

      	return isOwner && isNow && isValidContent && usernameMatches;
      }
      
      function canUpdatePost(userId) {
        let isOwner = request.auth.uid == userId;
      	let isNow = request.time == request.resource.data.updatedAt;
        let isValidContent = request.resource.data.content.size() < 20000;
        let doesNotUpdateForbidden = !request.resource.data.diff(resource.data).affectedKeys().hasAny(['uid', 'username', 'heartCount']);
        
        return isOwner && isNow && isValidContent && doesNotUpdateForbidden;
      }
      
      function canIncrementHearts(userId, postId) {
				let hasValidFields = request.resource.data.diff(resource.data).affectedKeys().hasOnly(['heartCount']);
        let currentUser = request.auth.uid;
				let heartDocExistsAfter = existsAfter(/databases/$(database)/documents/users/$(userId)/posts/$(postId)/hearts/$(currentUser));
        let heartDocExists = exists(/databases/$(database)/documents/users/$(userId)/posts/$(postId)/hearts/$(currentUser));
				
        let heartDocAdded= !heartDocExists && heartDocExistsAfter;
        let heartDocRemoved = heartDocExists && !heartDocExistsAfter;

        
        let countChange = request.resource.data.heartCount - resource.data.heartCount;
        let validChange = countChange == 1 || countChange == -1;

        return hasValidFields && validChange && ( countChange == 1 ? heartDocAdded : heartDocRemoved );
      }
      
  
      
      function isValidUser(userId) {
        let isOwner = request.auth.uid == userId;
      	let username = request.resource.data.username;
        let createdValidUsername = existsAfter(/databases/$(database)/documents/usernames/$(username));
        
        return isOwner && createdValidUsername;
      }
      
      function isValidUsername(username) {
				let isOwner = request.auth.uid == request.resource.data.uid;
        let isValidLength = username.size() >= 3 && username.size() <= 15;
        let isValidUserDoc = getAfter(/databases/$(database)/documents/users/$(request.auth.uid)).data.username == username;
        
        return isOwner && isValidLength && isValidUserDoc;     
      }
      
    }
    
  }
}
```