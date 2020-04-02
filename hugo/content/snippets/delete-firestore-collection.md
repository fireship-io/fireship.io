---
title: Delete a Firestore Collection
lastmod: 2020-02-11T14:29:28-07:00
publishdate: 2020-02-11T14:29:28-07:00
author: Jeff Delaney
draft: false
description: How to delete a Firestore Collection or Subcollection 
tags: 
    - firebase
    - firestore

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

Deleting an entire collection from Firestore should be handled on a backend server. Collections can grow infinitely large, so deleting a millions of documents can be an excessively large workload to put on a clientside web or mobile app. 

### Option A - Use the CLI or Console

You can manually delete a collection or subcollection from the [Firebase Console](https://console.firebase.google.com/) OR by using the CLI. 

{{< file "terminal" "command line" >}}
{{< highlight text >}}
firebase firestore:delete path-to-delete
{{< /highlight >}}

### Option B - Use a Cloud Function

It is possible to interact with [Firebase Tools](https://firebase.google.com/docs/cli) from a Cloud Function. This works especially well with Callable functions because you most certainly want to enforce some form of user authorization. 

First, obtain CI token to authenticate firebase tools. 

```shell
cd functions
npm i firebase-tools -D

firebase login:ci
# your_token

firebase functions:config:set ci_token="your_token"
```

The function should validate the user has permission to run the operation. If allowed, it runs the CLI command recursively on the collection and its nested subcollections. 

```js
const project = process.env.GCLOUD_PROJECT;
const token = functions.config().ci_token;

exports.deleteCollection = functions.runWith({ timeoutSeconds: 540})
  .https.onCall((data, context) => {

      const path = data.path;
      const allowed = context.auth.uid === path.split('/')[0]; // TODO your own logic

    if (!allowed) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Hey, that is not cool buddy!'
      );
    }

    return firebase_tools.firestore
      .delete(path, {
        project,
        token,
        recursive: true,
        yes: true,
      })
      .then(() => ({ result: 'all done!' }));
  });

```
