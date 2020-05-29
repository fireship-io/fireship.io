---
title: Read a Single Firestore Document
lastmod: 2019-12-04T19:57:21-07:00
publishdate: 2019-12-04T19:57:21-07:00
author: Jeff Delaney
draft: false
description: Strategies for querying a single Firestore document. 
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

type: lessons
---

The best way to [read](https://firebase.google.com/docs/firestore/query-data/get-data) a single Firestore document depends on the data you have access to. Each of the following strategies will execute a single document read, but uses different methods based on the underlying data model. 


## Strategies

### With the ID

Reading a document by its ID, path, or reference is simple. 

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}
async function getDoc(id) {
  const snapshot = await db.collection('users').doc(id).get();
  const data = snapshot.data();
}

{{< /highlight >}}

### With a Unique Field

A common use case is to *fetch a user by their unique email address or username*. In this scenario, you may have access to the field value, but not the ID. Make a query, then check it for emptiness. 

{{< highlight javascript >}}
async function getUserByEmail(email) {
  // Make the initial query
  const query = await db.collection('users').where('email', '==', email).get();

   if (!query.empty) {
    const snapshot = query.docs[0];
    const data = snapshot.data();
  } else {
    // not found
  }

}
{{< /highlight >}}

### With a Non-Unique Field

Another common use-case is to *fetch the most recent post* In this case, we order by the desired field, then limit the result set. 

{{< highlight javascript >}}
async function getMostRecent() {
  // Make the initial query
  const query = await db.collection('posts').orderBy('createdAt').limit(1).get();

  const snapshot = query.docs[0];
  const data = snapshot.data();

}
{{< /highlight >}}

Learn more about [Firestore Data Modeling](/courses/firestore-data-modeling/) in the full course. 
