---
title: Collection Group Query with Firestore
lastmod: 2019-05-20T08:43:13-07:00
publishdate: 2019-05-20T08:43:13-07:00
author: Jeff Delaney
draft: false
description: Query across multiple Firestore subcollections for hierarchical data structures, like threaded comments. 
tags: 
    - firebase
    - firestore
    - javascript

youtube: fQ4u1J717ys
github: https://github.com/fireship-io/186-collection-group-queries-demo
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

At Google I/O 2019, Firebase launched a new query type, [Collection Group Queries](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query), which can have a major impact on your data modeling decisions. It allows you to combine all subcollections that share the same name, then query them together. Prior to this feature release, it was common to model one-to-many relationships with root collections that contained a field (or foreign key if you will) pointing to the parent document. Root collections are still fine, but this new feature makes it far more practical to organize your data in a natural hierarchy.

In the following lesson, we will look at the basic concepts of Collection Group Queries. Check out the full source code for a more complex [threaded comments](https://github.com/fireship-io/186-collection-group-queries-demo) feature in Angular. 

{{< box icon="scroll" class="box-green" >}}
If you have complex data requirements for Firestore, consider enrolling in the full [Firestore Data Modeling](/courses/firestore-data-modeling/) course.
{{< /box >}}


## Collection Group Query

Collection Group Queries are just like regular collection queries, with a few minor caveats to consider.Make sure your project is running Firebase JS version 6.0 or later. 

### Basic Query

Let's imagine you have a database where users can comment on posts *and* reply to comments, leading to a nested structure that looks like this: 

`posts/{postID}/comments/{commentID}/comments/{commentID}/comments/{commentID}...`

A *Collection Group Query* allows you to join all the collections that share a similar name, in this case `comments`, and query across them uniformly.  

{{< file "js" "app.js" >}}
{{< highlight javascript >}}
import * as firebase from 'firebase/app';
const db = firebase.firestore();


const query = db.collectionGroup('comments')
                .where('user', '==', 'jeffd23')
                .orderBy('createdAt');
{{< /highlight >}}

### Rules

{{< figure  src="img/firestore-permission-error.png" caption="Firebase Rules Error" >}}

If you have rules enforced in your database, you will need to allow access to the grouped subcollection. You can do this using rules version 2, along with the `path=**` syntax. 

{{< file "firebase" "rules.json" >}}
{{< highlight javascript >}}
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    

    // Allow access to all comments subcollections
    
    match /{path=**}/comments/{id} {
      allow read, write;
    }
    
  }
}
{{< /highlight >}}


### Index

Collection Group Queries require an index when ordering or filtering by a specific property. If you need an index, you should see an error that looks like this: 

{{< figure  src="img/firestore-col-group-error.png" caption="If you see a Firestore index error, just click the link in the error to fix it" >}}

{{< figure  src="img/collection-group-index.png" caption="It should result in an exemption that looks similar to this" >}}
