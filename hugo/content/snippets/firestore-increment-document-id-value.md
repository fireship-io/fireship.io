---
title:  Firestore Order by Document ID or Field
lastmod: 2019-11-17T07:41:02-07:00
publishdate: 2019-11-18T07:41:02-07:00
author: Jeff Delaney
draft: false
description: How to auto-increment a document field or ID in Firestore
tags: 
    - firebase
    - firestore
    - data-modeling

type: lessons
---


The follow snippet contains strategies for ordering a collections sequentially. For example, you may want a field that increases by 1 after each new document is created. Cloud Firestore [does not](https://firebase.google.com/docs/firestore/manage-data/add-data) provide automatic ordering on the auto-generated docIDs, so we need be clever to solve this problem . 

## Auto-ordering Techniques

### Timestamp Approach

The easiest way to order by creation time is to use a server timestamp. This tells Firestore to add a date to the document based on Google Cloud's backend time, so you're not relying on the client's clock (which is likely to be inaccurate). 

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}

// Create Data
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

db.collection('things').add({ ...myData, createdAt: timestamp() })


// Query
db.collection('things').orderBy('createdAt').startAfter(today)
{{< /highlight >}}

The main limitation of this approach is that it does not provide a discrete count of the documents in database. 

### Increment a Counter on New Documents

Another option is to use a Firestore Cloud Function to update a count for each newly-created document. This is especially useful if you want to query a specific page in paginated query. 

**Goal:** Maintain a sequential count on each document in the collection. The first document is `number: 1`, second `number: 2`, and so on. 

In order for this to work well at scale, we need to run the write as a transaction. We also need a separate document to serve as single source of truth to guarantee an accurate count when adding a new record to the database. I usually keep documents like this in a separate collection like `metadata/{collectionName}` to keep track of aggregate data about the collection.

{{< figure src="/img/snippets/firestore-count-metadata.png" caption="Create a metadata/{collectionName} document in the database" >}}


[Initialize](https://firebase.google.com/docs/functions/get-started) Cloud Functions and deploy an `onCreate` function that reads the metadata in a [transaction](https://firebase.google.com/docs/firestore/manage-data/transactions), then updates both documents atomically. The transaction will only complete if it can safely read the metadata and make all the updates without being conflicted by other activity in the database.  


{{< file "js" "index.js" >}}
{{< highlight javascript >}}
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Cloud Function to increment a document field after creation. 
exports.keepCount = functions.firestore
  .document('customers/{customerId}')
  .onCreate((snapshot, context) => { 

    // Run inside a transaction
    return db.runTransaction(async transaction => {

        // Get the metadata document and increment the count. 
        const metaRef = db.doc('metadata/customers');
        const metaData = ( await transaction.get( metaRef ) ).data();

        const number = metaData.count + 1;

        transaction.update(metaRef, { 
            count: number 
        });

        // Update the customer document
        const customerRef = snapshot.ref;
        
        transaction.update(customerRef, { 
            number,
        });


    });

  });
{{< /highlight >}}

In your frontend code, you can now make queries for a specific page of results:


{{< highlight javascript >}}
const pageQuery = ref.orderBy('number').startAfter(500).limit(100)
{{< /highlight >}}

A potential drawback with this approach is that it does not re-order the collection when data is deleted. For example, if the doc with `number: 23` is deleted, it will NOT shift down 24, 25, 26 and so on into its place. Learn more in the [Firestore Data Modeling Full Course](/courses/firestore-data-modeling/). 
