---
title: Cloud Functions Data Aggregation
lastmod: 2017-10-29T11:27:02-07:00
publishdate: 2017-10-29T11:27:02-07:00
author: Jeff Delaney
draft: false
description: A complete demo of data aggregation with Firestore Cloud Functions
tags: 
    - firebase
    - cloud-functions
    - firestore

youtube: I6Q5VM1ao2k
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following lesson demonstrates how to make Firestore queries faster and more cost-effective by [aggregating data](https://cloud.google.com/firestore/docs/solutions/aggregation) from a subcollection to its parent. Aggregation is simply the process of totaling up a bunch of documents and calculating combined or cumulative information about them. 
 
 A Firebase Cloud Function configured with a [Firestore database trigger](/courses/cloud-functions/firestore-intro/) makes it possible to perform this task automatically whenever a document changes. This demo simulates the relationship between blog posts and a subcollection of comments. Our goal is to show a post's total comment count and last five comments, while only reading a single document. 


{{< figure src="img/aggregate-firestore.gif" caption="Data aggregation to speed up firestore document reads" >}}

 This technique is best suited for situations where you perform **many reads and relatively few writes**. Think Yelp! reviews. Many people want to view the total aggregated review score, but only a small percentage actually write their own review. 

 <p class="success">Full source code for the [Firestore data aggregation cloud function](https://github.com/AngularFirebase/63-firestore-aggregation).</p> 


 ## Isn't that Data Duplication

 You must have a RDBMS background... [Data duplication](https://robvolk.com/nosql-design-patterns-for-relational-data-9c2c11ae3b4a) in a NoSQL document database is perfectly acceptable. A little bit of duplication makes it possible to display data faster by avoiding unnecessary queries.  

 Imagine you wanted to show a feed of 10 posts, each with the comment count.  If each post has 10 comments, a grand total 110 document reads would be needed to show this content per user. If you have a 1000 daily active users, that's 110,000 reads per day just to show this feed - that will not scale well. 

 ## Data Aggregation Cloud Function

 If new to cloud functions, first initialize your project. 

 ```
 firebase init functions
 ```

 Also, make sure the package.json is up-to-date. Older version may not support Firestore. 

```
  "dependencies": {
    "firebase-admin": "~5.4.1",
    "firebase-functions": "^0.7.1"
  }
```

### Advantages

[Data aggregation](https://www.3pillarglobal.com/insights/introduction-to-data-aggregation-with-nosql-databases-blog-series-1-of-3) excels when you need to show relational data or a preview from another collection, but would rather not make a ton of extra queries to do so. 

- Faster reads. Reading a single document is always faster then reading multiple documents. The more documents you aggregate, the higher the speed gains will be. 
- Lower costs. Assuming you read the subcollection frequently, but write infrequently, you should see major cost savings as your user base grows. 
- Aggregate data is cool. The with right type of data, you can display all sorts of interesting statistics about a collection and improve the user experience. 
 
### Drawbacks
 
 Performing the update from a cloud function has few tradeoffs. 

 - Higher latency on writes. In addition to performing the read/write, you also need to invoke the function. Overall, I found that aggregating around 15 comments took about 1 second. Not bad, but noticeably slower than a direct Firestore connection.
 - Different cost structure. Although are goal is to reduce reads, we now have additional writes and cloud function invocations.  
 - Additional maintenance. Another cloud function to worry about. 

### index.js

The cloud function will be triggered on any comment write operation - create, update, or delete.  When one occurs, a reference is made the the parent post document, then we query the entire subcollection. 

{{< figure src="img/agg-pattern.png" caption="Aggregation pattern in NoSQL" >}}

 A `querySnapshot` is not an array, even though you can deceptively call `forEach` on it. It is a class called [QuerySnapshot](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot) in Firestore that only has a few methods on it. In the function, I convert its underlying data to a regular JS Array so it can be more easily aggregated. The three aggregated fields are as follows: 

- `commentCount` - total size of collection
- `recentComments` - last five comments
- `lastActivity` - timestamp of last comment


```js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateComments = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onWrite(event => {

    const commentId = event.params.commentId; 
    const postId = event.params.postId;
    
    // ref to the parent document
    const docRef = admin.firestore().collection('posts').doc(postId)
    
    // get all comments and aggregate
    return docRef.collection('comments').orderBy('createdAt', 'desc')
         .get()
         .then(querySnapshot => {

            // get the total comment count
            const commentCount = querySnapshot.size

            const recentComments = []

            // add data from the 5 most recent comments to the array
            querySnapshot.forEach(doc => {
                recentComments.push( doc.data() )
            });

            recentComments.splice(5)

            // record last comment timestamp
            const lastActivity = recentComments[0].createdAt

            // data to update on the document
            const data = { commentCount, recentComments, lastActivity }
            
            // run update
            return docRef.update(data)
         })
         .catch(err => console.log(err) )
});
```

Don't forget to deploy the function. 

```shell
firebase deploy --only functions
```

<p class="tip">If your aggregation operation will be updating multiple documents, it's a good idea to use a [Firestore transaction or batch](https://firebase.google.com/docs/firestore/manage-data/transactions) to make the operation atomic. All operations should succeed or fail together. </p>

## Lazy Loading Firestore Data in the Component

 We can setup a simple blog in the app component to simulate the relationship between blog posts and comments. This is not meant to be a robust feature, but rather to show you how aggregated data can be used to make queries faster. 


### App Component TypeScript

 The `loadMore()` method will call `valueChanges()` only when the user clicks the button. This will load the Firestore data lazily for the small percentage of users who want to see older comments. 


```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument 
} from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  postRef: AngularFirestoreDocument<any>;
  post$: Observable<any>;

  commentsRef: AngularFirestoreCollection<any>;
  comments$: Observable<any>;

  formValue: string;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.postRef = this.afs.doc('posts/testPost')
    this.commentsRef = this.postRef.collection('comments', ref => ref.orderBy('createdAt', 'desc') )
    this.post$ = this.postRef.valueChanges();
  }

  addComment() {
    this.commentsRef.add({ content: this.formValue, createdAt: new Date() })
    this.formValue = '';
  }

  // Lazy Load the Firestore Collection
  loadMore() {
    this.comments$ = this.commentsRef.valueChanges();
  }

}
```


### Html

Notice how I only show the `post.recentComments` when the `comments$` Observable is not defined. If the user decides to load more, then the aggregated data is replaced with the full comments collection. 

 ```html
<div *ngIf="post$ | async as post">

  <h1>{{ post.title }}</h1>

  <p>{{ post.content }}</p>

  <p>Last Comment: {{ post.lastActivity }}</p><br>
  <p>Total Comments: {{ post.commentCount }}</p>

  <h3>Add your Comment</h3>

  <input [(ngModel)]="formValue" (keyup.enter)="addComment()">

  <h3>Recent Comments</h3>

  <!-- Aggregated comments on the post document -->
  <ng-container *ngIf="!comments$">
    <div *ngFor="let comment of post.recentComments">
      <p>{{ comment.content }}</p>
      <em>posted {{ comment.createdAt }}</em>
      <hr>
    </div>
  </ng-container>

  <!-- Firestore comment documents from the subcollection -->
  <div *ngFor="let comment of comments$ | async">
      <p>{{ comment.content }}</p>
      <em>posted {{ comment.createdAt }}</em>
      <hr>
  </div>

  <button (click)="loadMore()">
    Load all {{ post.commentCount }} comments
  </button>

</div>
```

## The End

Today we built a simple data aggregation cloud function that could be expanded to handle more sophisticated tasks. Hopefully this gives you some inspiration that will lead to faster/cheaper Firestore queries and help you deal with the challenges of large collections. 
