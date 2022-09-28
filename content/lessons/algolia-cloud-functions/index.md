---
title: Algolia Fulltext Search Cloud Functions
lastmod: 2019-08-25T10:43:13-07:00
publishdate: 2019-08-25T10:43:13-07:00
author: Jeff Delaney
draft: false
description: Build a pipeline for full-text search indexing with Firestore Cloud Functions
tags: 
    - node
    - algolia
    - firestore
    - cloud-functions

youtube: dTXzxSlhTDM
github: https://github.com/fireship-io/203-algolia-firestore-mvp
---

One of the most commonly encountered limitations of [Cloud Firestore](https://firebase.google.com/docs/firestore) (and GCP) is [full-text search](https://en.wikipedia.org/wiki/Full-text_search). This functionality is essential if you need to query complex text patterns in a database or filter results by multiple dynamic properties. My favorite solution to this limitation is [Algolia](https://www.algolia.com/), which provides a powerful, developer-friendly, search & discovery API. In the following lesson you will learn how to sync your Firestore data to an Algolia index via Cloud Functions. 



{{< figure src="img/algolia-firestore-demo.png" caption="Notice how the Algolia index (left) is synced-up with the Firestore document (right)" >}}


## Initial Setup

### Blaze plan required

Make sure you are at least using the Firebase Blaze plan because this will enable you to make network requests to third-party APIs like Algolia.

### Initialize Cloud Functions

First, initialize Cloud Functions in your project with the Firebase Tools CLI. This lesson uses vanilla JS, but feel free to select TypeScript if you prefer. 

{{< file "terminal" "command line" >}}
```text
npm i -g firebase-tools
firebase init functions
```

### Install Algolia

Indexing tasks can be handled in Node with the [Algolia JS SDK](https://www.algolia.com/doc/api-client/getting-started/install/javascript/?language=javascript) package. 

```text
cd functions
npm install algoliasearch
```

### Create an Index

Algolia provides a guided UI for building indexes that support full-text search. 

{{< figure src="img/create-index.png" caption="Create an index named customers on the Algolia dashboard" >}}

### Add the Algolia API Key to Firebase

You can find your credentials under the *API Keys* tab. Your backend code requires the **Application ID** and **Admin API Key**. Keep the admin key safe and do not expose it to the public. 

{{< figure src="img/api-keys.png" caption="You need the Algolia App ID and Admin API Key" >}}

Now set the API key and template ID in the Firebase project with the following command. 

{{< file "terminal" "command line" >}}
```text
firebase functions:config:set algolia.app=YOUR_APP_ID algolia.key=ADMIN_API_KEY
```

## Algolia Cloud Functions

Setup the Cloud Functions environment by initializing the Algolia client and index. 

{{< file "js" "functions/index.js" >}}
```js
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('customers');

/// Cloud Functions

exports.addToIndex; // TODO

exports.updateIndex; // TODO

exports.deleteFromIndex; // TODO
```

### Add Record to Algolia

Our goal is to duplicate a subset of data from the Firestore customer document to Algolia. The first step is to add a new record to the index with the `onCreate` Firestore event. 

💡 Tip. Only index data in Algolia that is actually useful for searching and/or displaying in search results. Do NOT index personally identifiable information (PII), like phone numbers and email addresses. You may not need to duplicate the entire document. 

```js
exports.addToIndex = functions.firestore.document('customers/{customerId}')

    .onCreate(snapshot => {

        const data = snapshot.data();
        const objectID = snapshot.id;

        return index.saveObject({ ...data, objectID });

    });
```

### Update a Record in Algolia

If the Firestore document data changes, we want these changes reflected in the index and search results. We can easily handle this task with an `onUpdate` function. 

```js
exports.updateIndex = functions.firestore.document('customers/{customerId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({ ...newData, objectID });
    });
```

### Delete a Record

When a Firestore document is deleted, we must also remove it from the search index. In this case, we simply pass the objectID to Algolia within an `onDelete` function.  

```js
exports.deleteFromIndex = functions.firestore.document('customers/{customerId}')

    .onDelete(snapshot => 
        index.deleteObject(snapshot.id)
    );
```

### Deploy

Deploy your functions and test them from the Firebase console, or follow the seeding instructions in the next section. 

{{< file "terminal" "command line" >}}
```text
firebase deploy --only functions
```

## Optional: Seed the Database

In the video you saw how I quickly seeded Firestore with dummy data, which was accomplished with [Faker](https://github.com/marak/Faker.js/) and the Firebase Admin SDK. Create a vanilla node script in the functions directory that sends writes to the database. 

{{< file "js" "functions/seed.js" >}}
```js
const admin = require('firebase-admin');
admin.initializeApp();

const faker = require('faker');

const db = admin.firestore();

const fakeIt = () => {
    return db.collection('customers').add({
        username: faker.internet.userName(),
        avatar: faker.internet.avatar(),
        bio: faker.hacker.phrase()
    });
}

Array(20).fill(0).forEach(fakeIt);
```

Run the script from the command line like so:

{{< file "terminal" "command line" >}}
```text
cd functions
node seed.js
```


This post first appeared as [Episode 109 Algolia Firestore on AngularFirebase.com](https://angularfirebase.com/lessons/algolia-firestore-quickstart-with-firebase-cloud-functions/) and has been fully updated with the latest best practices. 

