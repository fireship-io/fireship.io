---
title: Custom Usernames in Firebase
lastmod: 2021-01-23T11:51:52-07:00
publishdate: 2021-01-23T11:51:52-07:00
author: Jeff Delaney
draft: false
description: How to implement and validate custom usernames for Firebase users with Cloud Firestore
tags: 
    - pro
    - firebase
    - firestore
    - authentication

pro: true
vimeo: 503950630

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Firebase assigns each user a unique ID upon signing up, but many apps require users to choose their own custom unique *username*, which is [not](https://github.com/firebase/firebaseui-web/issues/580) an out-of-box feature in Firebase. Think of apps like Twitter or Medium, where each user’s profile can be visited on a user like `example.com/{username}`.  The following lesson demonstrates how to securely create and validate custom usernames for Firebase users by combining Cloud Firestore. 

{{< figure src="img/username-demo.gif" caption="Demo of custom usernames in Firebase" >}}


**Assumptions:** 

- Each user must have a *unique* username.
- Username *will not change* after initial selection.


{{< figure src="img/username-vs-displayname.png" caption="The username is unique, while the displayname is not" >}}

## Data Model

The data model requires two root collections `users` and `usernames`. They use a simple reverse mapping (point to each other) that enables uniqueness validation. 

### User Profile Document

The user profile document contains public information about the user, including the username value. 

{{< figure src="img/user-doc.png" caption="The user document is used for public-facing data" >}}

### Username Document

The username document has an ID that matches the username, thus guaranteeing uniqueness. This document will be fetched when the user chooses a username to inform them whether or not their choice is available.

{{< figure src="img/username-doc.png" caption="The username document is used for uniqueness validation" >}}

## Frontend Implementation

### SignIn

First, sign in the user with any authentication method. 

{{< file "js" "app.js" >}}
```javascript
const auth = firebase.auth();
const firestore = firebase.firestore();

auth.signInWithPopup(someProvider)
```

### Validate Username Selection

Create a form input where the user can type their username. After each change to the form input, make a request to Firestore to check if the username exists. If it does NOT exist, show a green check mark saying username is available. If it does exists, show an error saying username taken.

**Optimization**. Reduce the number of reads sent to the database by wrapping this function in a [debounce](https://lodash.com/docs/#debounce) to wait for the user to stop typing before sending the request. 

{{< file "html" "index.html" >}}
```html
<form>
    <input id="username" />
</form>
```


{{< file "js" "app.js" >}}
```javascript
// Your username form input
const formInput = document.getElementById('username');

// State
let usernameAvailable = false;

// Wrap in debounce to prevent unnecessary reads

formInput.onchange = debounce ( async(event) => {

    // When form input changes, check existence of the matching username doc in db

    const username = event.target.value;

    if (username.length >= 3 && username.length <= 15) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        usernameAvailable = !exists;
    } 

}, 500)
```

### Commit Username as Batch Write

Both documents are created in a [batch](https://firebase.google.com/docs/firestore/manage-data/transactions), ensuring that they will be created successfully together (or fail together). 

{{< file "js" "app.js" >}}
```javascript
const form = document.getElementByTagName('form');

form.onsubmit = async(username) => {

    // Get the current user
    const user = auth.currentUser;

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${username}`);

    // Commit both docs together as a batch write. 
    const batch = firestore.batch();
    batch.set(userDoc, { username });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit()
    
}
```


## Backend Security

The rules below use batch write tools like [getAfter](https://firebase.google.com/docs/reference/rules/rules.firestore#.getAfter) to fetch a document as-if the batch write has been completed. The rules solve a variety of potential security issues: 

### Rules for Batch Write

1. Username must be unique.
1. Username must be formatted properly, and be between 3 & 15 characters.  
1. Username cannot exist without user profile, and vice versa. 
1. Users cannot modify their username after creation.
1. Users cannot spam the database with username docs.

{{< file "firebase" "firestore.rules" >}}
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {

      match /users/{userId} {
      	allow read;
        allow create: if isValidUser(userId);
      }
      
      function isValidUser(userId) {
        let isOwner = request.auth.uid == userId;
      	let username = request.resource.data.username;
        let createdValidUsername = existsAfter(/databases/$(database)/documents/usernames/$(username));
        
        return isOwner && createdValidUsername;
      }
      
      match /usernames/{username} {
      	allow read;
        allow create: if isValidUsername(username);
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