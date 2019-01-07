---
title: Firestore Security Rules Cookbook
publishdate: 2019-01-02T09:35:09-07:00
lastmod: 2019-01-02T09:35:09-07:00
draft: false
author: Jeff Delaney
type: lessons
description: Common Recipes for Firestore Security Rules
tags:
    - firebase
    - firestore
---

The purpose of this snippet to list common [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started) patterns. Many of the rules below are extracted into functions to maximize code reuse.

## Basic Recipes

Let's start with some common use cases needed by almost every app.

{{% box icon="fire" class="box-orange" %}}
At runtime, Firebase rules look for the first valid `allow == true` rule and NOT vice-versa. This is very important to keep in mind, as you might think you secured a path, only for it to be allowed somewhere else. Always start with secure rules, then carefully allow access where needed.
{{% /box %}}

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

Sometimes a user will own many documents in a collection, so the Document ID will be different than the User ID. In this case, we can look at the existing resource, assuming it has a `uid` property to track the relationship. Example: *user has-many posts*.

{{< file "firebase" "firestore rules" >}}
{{< highlight js >}}
service cloud.firestore {
  match /databases/{database}/documents {

    match /posts/{postId} {
        allow write: if isOwner(userId);
    }

    function isOwner(userId) {
        return request.auth.uid == resource.data.uid;
    }
  }
}
{{< /highlight >}}

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