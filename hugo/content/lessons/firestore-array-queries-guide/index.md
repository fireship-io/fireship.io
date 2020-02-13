---
title: Working with Firestore Arrays
lastmod: 2020-02-12T14:46:47-07:00
publishdate: 2019-02-12T14:46:47-07:00
author: Jeff Delaney
draft: false
description: Tips and tricks for Firestore array queries and writes
tags: 
    - firebase
    - firestore

type: lessons
youtube: 4t2eHrFW_0M
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Have you ever wanted to make a query to Firestore for all documents *with an array containing a certain value*? Array queries are possible as of Firebase JS [SDK v5.3.0](https://firebase.google.com/support/release-notes/js). In addition, the SDK also added support for the atomic addition and removal of elements on an array field. 
 

## Firestore Arrays 

### Queries

Firebase introduced an `array-contains` operator that can be used with `where` to query array fields. It will return all documents that contain a the provided value in the array. Currently, this is only supported with one value, so don't try chaining more than one of these in a single query. 

```js
const col = firestore.collection('carts');

const query = col.where('items', 'array-contains', 'fruit loops')

query.get(...)
```

Use `array-contains-any` to query a list of many possible matches. 

```js
const query = col.where('items', 'array-contains-any', ['fruit loops', 'corn-pops', 'wheaties'])
```

### Writes

How to delete a specific item from an array? Use [arrayRemove](https://firebase.google.com/docs/reference/android/com/google/firebase/firestore/FieldValue.html#public-static-fieldvalue-arrayremove-object...-elements)

```js
import * as firebase from 'firebase/app';

const const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

const doc = firestore.doc('carts/abc');

doc.update({
    items: arrayRemove('chex')
});
```

How to add new items to an array? 


```js
const const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

doc.update({
    items: arrayUnion('coco puffs')
});
```
