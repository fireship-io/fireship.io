---
title: Firestore Pagination Guide
lastmod: 2019-11-26T09:17:06-07:00
publishdate: 2019-11-26T09:17:06-07:00
author: Jeff Delaney
draft: false
description: Pagination queries with Firestore that move forward and backward.
tags: 
    - firebase
    - firestore
    - javascript

type: lessons
youtube: yFlhTvxcrQ8
github: https://github.com/fireship-io/215-firestore-pagination
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions: 
    firebase: 7.3.0
---

[Pagination](https://en.wikipedia.org/wiki/Pagination) is the process of dividing data into discrete pages. In Firestore, it is achieved by ordering a collection by a field, limiting it to a consistent page size, then offsetting the query. The Firebase Web SDK v7.3.0 introduced a new `limitToLast(n)` method that makes the process much easier. The following lesson demonstrates how to paginate Firestore data in both a forward and backward direction and discusses advanced serverside techniques.  


[Firestore Pagination](https://cloud.google.com/firestore/docs/query-data/query-cursors) is a tricky requirement when also listening to realtime updates. If the position of data changes midway through a query, you might see results jump around the screen, which may confuse users. Pagination is most well suited for collections where the expected query ordering does not change frequently.


{{< figure src="img/firestore-pagination.gif" caption="Demo of Pagination feature in Firestore" >}}

## Firestore Pagination Implementation

The following guide will provide high-level JavaScript code designed to work with any frontend UI framework. Check out the source code for a [full demo with Svelte](https://github.com/fireship-io/215-firestore-pagination). 

### Step 1 - Make the Initial Query

You have to start somewhere...

{{< file "js" "pagination.js" >}}
```js
const field = 'username';
const pageSize = 3;

const query = ref.orderBy(field).limit(pageSize);
```

### Step 2 - Move Forward

The next page requires the the **last** document from current query results. Use the `startAfter` method to offset from that document. 

```js
  function nextPage(last) {

	return ref.orderBy(field)
			  .startAfter(last[field])
			  .limit(pageSize);
  }
```

### Step 3 - Move Backward


Going back to the previous page requires the the **first** document from current query results. Use the `endBefore` method followed by `limitToLast` to offset from that document. 

```js
  function prevPage(first) {

	return ref.orderBy(field)
			  .endBefore(first[field])
			  .limitToLast(pageSize);
  }
```

### Step 4 - Show a list of pages


Showing a list of pages requires us to know the total number of documents in the query. We cannot simply request the count from Firestore without reading the entire collection, which defeats the purpose of pagination. See the serverside pagination section for your options. 


## Serverside Pagination

### Option 1 - Offest Query Operator

The Firebase Admin SDK contains a special operator [offset](https://cloud.google.com/nodejs/docs/reference/firestore/0.11.x/Query#offset). A potential solution is to route all paginated requests through Cloud Function with a parameter for the offset. 


{{< file "js" "index.js" >}}
```js
const admin = require('firebase-admin');

const pageThree = ref.orderBy(field).limit(10).offset(20);
```

### Option 2 - Aggregate data in a Cloud Function. 

Another option is create a field specifically for pagination. It is easier to handle pagination when you have a sequential set of values that increase by 1. For example, the number of the first document is 1, next is 2, then 3, 4, and so on. 

The cloud function below keeps track of the global count in a metadata document, then assigns the latest number when a new document is created. The operation is performed in a [transaction](https://firebase.google.com/docs/firestore/manage-data/transactions) to eliminate the potential for conflicts or duplicates. 

{{< file "js" "index.js" >}}
```js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.keepCount = functions.firestore
  .document('customers/{customerId}')
  .onCreate((snapshot, context) => { 

    return db.runTransaction(async transaction => {

        // Get the metadata and incement the count. 
        const metaRef = db.doc('metadata/customers');
        const metaData = ( await transaction.get( metaRef ) ).data();

        const number = metaData.count + 1;

        transaction.update(metaRef, { 
            count: number 
        });

        // Update Customer
        const customerRef = snapshot.ref;
        
        transaction.set(customerRef, { 
            number,
        }, 
         { merge: true }
        );


    });

  });
```