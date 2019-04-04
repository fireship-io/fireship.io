---
title: Firestore Data Modeling and Queries
lastmod: 2019-02-06T20:32:21-07:00
publishdate: 2019-02-06T20:32:21-07:00
author: Jeff Delaney
draft: false
description: Learn how to handle complex relationships and queries with Firebase Firestore
tags: 
    - javascript
    - firestore
    - nosql
    - firebase


# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

[Cloud Firestore](https://firebase.google.com/docs/firestore/query-data/queries) recently came out of beta and can now be used in production with full confidence. Still, the greatest challenge for any app using a NoSQL database almost always comes down to **data modeling**. Firestore gives you a ton of flexibility, but that means you have more decisions to consider. 

The following lesson will take you through a variety of practical examples of data modeling and querying on Firestore. 



{{% box icon="scroll" class="box-blue" %}}
This post first appeared as [Episode 85 on AngularFirebase.com](https://angularfirebase.com/lessons/firestore-nosql-data-modeling-by-example/) and has been fully updated for Firestore v1. 
{{% /box %}}

## Key Concepts

Here are few key principles to follow when using Firestore.

- Let your frontend design drive decisions about data modeling. 
- Collections can be infinitely large, while documents less than 1Mb
- Data duplication is OK


https://firebase.google.com/docs/firestore/manage-data/structure-data


### Types of Queries

Below are examples of the types of queries you can make in Firestore. They can be chained together to build complex compound queries. 

{{< file "js" "query.js" >}}
{{< highlight javascript >}}
// Single Document Read 
const doc = ref.doc(path);

// Full Collection Read
const col = ref.collection(path);

// Ordered Collection
col.orderBy(field, 'asc')

// Limited Collection
col.limit(10);

// Paginated Collection, startAt endAt endAfter endBefore
col.orderBy(field, 'asc').startAt(offset).limit(10);

// Where, an expressive query
col.where(field, '>=', value)
{{< /highlight >}}

**Pro Tip ⚡** You can build queries directly from the Firebase Console and it will generate the necessary code for you. 

{{< figure src="img/firestore-query-console.png" alt="Making a query in firestore directly from the console" >}}


## Has-One or Belongs-To Relationship

One of the most common data relationships you will encounter is when an entity **has one** item. Or in other words, an item **belongs-to** the entity. If you're using Firebase Auth, you can model ownership giving a document the same ID as the user. 

{{% box icon="abacus" class="" %}}
Example: A user has one account. An account belongs to a user. 
{{% /box %}}

### Database Structure

Notice how both documents share the same unique ID. This allows you to associate and join multiple documents to a single user/entity. 


{{< figure src="img/firestore-has-one.png" alt="A has one relationship in Firestore" >}}
{{< figure src="img/firestore-belongs-to.png" alt="A belongs-to relationship in Firestore" >}}

### Query

Now we can query the related data with a basic document read. First, make a reference to the document path, then decide how you want to consume the data. 

{{< file "js" "fire.js" >}}
{{< highlight javascript >}}
const db = firebase.firestore();

const uid = 'userXYZ';

// 1. Make a reference
const userRef = db.collection('users').doc(uid);
const acctRef = db.doc(`accounts/${uid}`);

// 2a. single read
userRef.get().then(snapshot => doStuff);

// 2b. or setup a realtime listener
acctRef.onSnapshot(snapshot => doStuff);
{{< /highlight >}}


## Has-Many Relationship - Embedded

It is also possible for an entity to **have-many** of a certain item. 

{{% box icon="abacus" class="" %}}
Example: A user has many tasks
{{% /box %}}

### Database Structure

{{< figure src="img/firestore-has-one.png" alt="A has one relationship in Firestore" >}}

### Query

## Has-Many