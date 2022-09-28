---
title: How to Use Firestore Increment
lastmod: 2019-04-08T07:41:02-07:00
publishdate: 2019-04-08T07:41:02-07:00
author: Jeff Delaney
draft: false
description: Use the special Firestore Increment field value to increase or decrease numeric values atomically in the database. 
tags: 
    - firebase

youtube: 8Ejn1FLRRaw
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

type: lessons

versions: 
    firebase: 5.9.3
---

One of the common challenges faced when working with Firestore is maintaining an accurate [count](https://firebase.google.com/docs/firestore/solutions/counters) of a value on a document (or multiple documents). One cannot simply update a counter and expect it to be accurate because many clients might be competing to update the same value simultaneously. The solution to this problem has traditionally been to deploy a Cloud Function that runs the update in a transaction to guarantee an [atomic](https://en.wikipedia.org/wiki/Atomicity_(database_systems)) update. This works great, but adds a significant amount of complexity for a relatively simple requirement. 

Fortunately, Firebase recently introduced `FieldValue.increment` to make this process much, much easier. Let's take a look at how it works...

## Firestore Increment

Increment is a special value that will atomically update a counter based on the interval you specify. You do not need to read the document to obtain the current total - Firebase does all the calculation serverside.  In most cases, you will be keeping a count by adding an integer of `1` to the current total.  

### Increase a Counter 

{{< file "js" "app.js" >}}
```js
const db = firebase.firestore();
const increment = firebase.firestore.FieldValue.increment(1);

// Document reference
const storyRef = db.collection('stories').doc('hello-world');

// Update read count
storyRef.update({ reads: increment });
```

### Decrease a Counter

We can decrement a counter by simply changing the interval value to `-1`. 

{{< file "js" "app.js" >}}
```js
const decrement = firebase.firestore.FieldValue.increment(-1);

// Update read count
storyRef.update({ reads: decrement });
```

### Update a Floating Point Total

It also works with decimal values, which can be useful when updating something like a user's order history total. 

```js
const userRef = db.collection('users').doc('some-user');
const increaseBy = firebase.firestore.FieldValue.increment(23.99);

userRef.update({ totalSpent: increaseBy });
```

### Counting Values in Separate Documents

In certain cases, your counter value may depend on the creation of a new document or just be located in a different document. You can use [batched writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes) to ensure all data is updated safely. For example, we might want to create a *like* document, then update the total multiple places. 

```js
const batch = db.batch();
batch.set(likesRef, ...likeData);
batch.update(storyRef, { likes: increment });
batch.update(userRef, { totalLikes: increment });
batch.commit();
```

### Keep a Count of Documents in a Collection

Keeping a count of documents in a collection is perhaps the single most common form of data aggregation in Firestore. Prior to increment, we had the option to (a) read ALL documents clientside or (b) use a Cloud Function to keep a count of documents in a collection. 

Now, we have a third option. Create a document called `--stats--` for the purpose of maintaining aggregation or metadata about this collection. In your frontend code, use a batch to increment the stats when creating a new document.  


```js
const storyRef = db.collection('stories').doc('hello-world');
const statsRef = db.collection('stories').doc('--stats--');

const increment = firebase.firestore.FieldValue.increment(1);

const batch = db.batch();
const storyRef = db.collection('stories').doc(`${Math.random()}`);
batch.set(storyRef, { title: 'New Story!' });
batch.set(statsRef, { storyCount: increment }, { merge: true });
batch.commit();
```