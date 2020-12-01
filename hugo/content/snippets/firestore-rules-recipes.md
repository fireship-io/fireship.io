---
title: Firestore Security Rules Cookbook
publishdate: 2019-01-02T09:35:09-07:00
lastmod: 2020-12-01T09:35:09-07:00
draft: false
author: Jeff Delaney
type: lessons
description: Common Recipes for Firestore Security Rules
tags:
    - firebase
    - firestore

youtube: b7PUm7LmAOw
---

The purpose of this reference is to demonstrate common [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started) patterns. Many of the rules below are extracted into functions to maximize code reuse.

## Basic Recipes

Let's start with some common Firestore security use cases needed by almost every app.

{{< box icon="fire" class="box-orange" >}}
At runtime, Firebase rules look for the first valid `allow == true` rule and NOT vice-versa. This is very important to keep in mind, as you might think you secured a path, only for it to be allowed somewhere else. Always start with secure rules, then carefully allow access where needed.
{{< /box >}}

### Locked Mode

Start here. Keep your database locked down by default, then add rules to grant access to certain read or writes. If you flip that value to `true` and your entire database will be open to the public.

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write: if false;
    }

    // other rules go here...

  }
}
{{< /highlight >}}

### Scope Rules to Specific Operations

Rules can be enforced on various read/write operations that occur in a clientside app. We can scope rules to each of the follow read operations. 

- `allow read` - Applies to both lists and documents.
- `allow get` - When reading a single document.
- `allow list` - When querying a collection.

Write operations can be scoped as follows: 

- `allow create` - When setting new data with `docRef.set()` or `collectionRef.add()`
- `allow update` - When updating data with `docRef.update()` or `set()`
- `allow delete` - When deleting data with `docRef.delete()`
- `allow write` - Applies rule to create, update, and delete. 

### Request vs Resource

Firestore gives us access to several special variables that can be used to compose rules. 

- `request` contains incoming data (including auth and time)
- `resource` existing data that is being requested

This part is confusing because a *resource* also exists on the *request* to represent the incoming data on write operations. I like to use use helper functions to make this code a bit more readable. 

## User-Based Rules

Most apps design their security rules around user authorization logic.

### Secure to Signed-In Users

Allow access only when signed in. Example: a *user must be logged in*.

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
    match /posts/{postId} {
        allow read: if request.auth != null;
    }
{{< /highlight >}}


### Secure by Owner, Has-One Relationship

Use this rule to allow access only if the authenticated user's UID matches the ID on a document. Example: a *user has-one account document*.


{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
match /accounts/{userId} {
    allow write: if belongsTo(userId);
}

function belongsTo(userId) {
    return request.auth.uid == userId
}
{{< /highlight >}}

### Secure by Owner, Has-Many Relationship

Sometimes a user will own many documents in a collection, so the Document ID will be different than the User ID. In this case, we can look at the request (create) and or the existing resource (delete), assuming it has a `uid` property to track the relationship. Example: *user has-many posts*.

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
service cloud.firestore {
  match /databases/{database}/documents {

    match /posts/{postId} {
        allow write: if requestMatchesUID();
        allow update: if requestMatchesUID() && resourceMatchesUID();
        allow delete: if resourceMatchesUID();
    }

    function requestMatchesUID() {
        return request.auth.uid == request.resource.data.uid;
    }

    function resourceMatchesUID() {
        return request.auth.uid == resource.data.uid;
    }
  }
}
{{< /highlight >}}

### Block Anonymous Users

If you implement lazy registration, you may want to limit the privileges of anonymous user s. You can determine if a user is anonymous on the auth token. 

{{< file "firebase" "firestore.rules" >}}
```javascript
match /posts/{postId} {
  allow create: if request.auth.uid != null 
                && request.auth.token.firebase.sign_in_provider != 'anonymous';

```

## Advanced Scenarios

###  Make all Collections Readable or Writable - Except One

Let's imagine you create collection names dynamically and want them to be unlocked by default. However, you have a special collection that requires strict rules. You start by locking down all paths, then dynamically pass the collection name in a rule. If the name does not equal the special collection then allow the operation.

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
    match /{document=**} {
      allow read, write: if false;
    }

    match /{collectionName}/{docId} {
      allow read: if collectionName != 'special-collection';
    }
{{< /highlight >}}

## Common Functions

### A few examples you might find useful

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
service cloud.firestore {
  match /databases/{database}/documents {


    function isSignedIn() {
      return request.auth != null;
    }
    function emailVerified() {
      return request.auth.token.email_verified;
    }
    function userExists() {
      return exists(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    // [READ] Data that exists on the Firestore document
    function existingData() {
      return resource.data;
    }
    // [WRITE] Data that is sent to a Firestore document
    function incomingData() {
      return request.resource.data;
    }

    // Does the logged-in user match the requested userId?
    function isUser(userId) {
      return request.auth.uid == userId;
    }

    // Fetch a user from Firestore
    function getUserData() {
      return get(/databases/$(database)/documents/accounts/$(request.auth.uid)).data
    }

    // Fetch a user-specific field from Firestore
    function userEmail(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.email;
    }


    // example application for functions
    match /orders/{orderId} {
      allow create: if isSignedIn() && emailVerified() && isUser(incomingData().userId);
      allow read, list, update, delete: if isSignedIn() && isUser(existingData().userId);
    }

  }
}

{{< /highlight >}}

## Data Validation Example

Now let's combine some of the functions created earlier to build a robust validation rule. By chaining together rules with `&&` we can validate the data structure of multiple fields as an `AND` condition. We can also use `||` for OR conditions. 

{{< file "firebase" "firestore rules" >}}
```js
// allow update: if isValidProduct();

function isValidProduct() {
  return incomingData().price > 10 && 
         incomingData().name.size() < 50 &&
         incomingData().category in ['widgets', 'things'] &&
         existingData().locked == false && 
         getUserData().admin == true
}
```

## Time-based Rules Examples

Firestore also includes a `duration` helper to generate dates that can be operated upon. For example, we might want to throttle updates to 1 minute intervals. We can create this rule by comparing the `request.time` to a timestamp on the document + the throttle duration. 

```js
// allow update: if isThrottled() == false;

function isThrottled() {
  return request.time < resource.data.lastUpdate + duration.value(1, 'm')
}
```