---
title: Join Collections in Firestore
lastmod: 2018-08-23T17:30:50-07:00
publishdate: 2018-08-23T17:30:50-07:00
author: Jeff Delaney
draft: false
description: Leverage RxJS to perform SQL-like JOIN queries in Firestore
tags: 
    - rxjs
    - firebase
    - firestore

pro: true
youtube: QdIKVvguS8U
github: https://github.com/AngularFirebase/133-firestore-joins-custom-rx-operators

# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


**How do I perform a SQL JOIN in Firestore?** - it's a difficult question almost all developers will come across. The simple answer for ALL NoSQL databases is that it's just not possible in an apples-to-apples way. We can't perform this operation server-side, however, we can get clever with custom RxJS operators to solve similar problems - plus gain the added benefit of maintaining realtime listeners on all data. 

Our operators require [AngularFire](https://github.com/angular/angularfire2) and will add some RxJS magic to its existing Observables to tackle the challenge of joining [Firestore](https://firebase.google.com/docs/firestore/) documents and collections together easily in Firestore. The code in this lesson is *advanced* - if you get stuck checkout these related lessons:

- [Firestore NoSQL Data Modeling](/lessons/firestore-nosql-data-modeling-by-example/)
- [Custom RxJS Operators Guide](/lessons/custom-rxjs-operators-by-example/)

## Document to Document JOIN

{{< figure src="img/doc-to-doc-join.png" caption="" >}}

Joining documents together is slightly easier than collections. A common data model in NoSQL is to save a field with a document ID that points to a related document. We could just perform separate document reads one-by-one, but that would be cumbersome. Let's build an operator that can handle this process seamlessly as a single Observable.

<p class="tip">This lesson uses strings to keep track of relational data, but you might also use a Firestore `DocumentReference` when dealing with large complex paths.</p>


### Usage

Consider the following data model. We have three unique docs in separate collections. The user doc makes a reference to a specific pet and car ID - this can be a *has one* or *belongs to* relationship. 

```
+users
    docId=jeff {
      car: 'subaru'
      pet: 'humphrey'
    }

+pets
    docId=humphrey {
        type: 'dog'
        food: 'kibble'
    }

+cars
    docId=subaru {
        model: 'Legacy'
        doors: 4
    }
```

The first argument is the `AngularFirestore` instance. Operators are pure functions, so they we have to pass dependencies as arguments. The second arg is an object where each *key is the field with the related doc ID* and the *value is the collection containing this doc*. The result is a joined object that joins the related document data as a object on each key. 

```typescript
const user$ = afs.document('users/jeff').valueChanges()

const joined = user$.pipe( 
  docJoin(afs, { car: 'cars', pet: 'pets' } ) 
)

///// result /////

{
    ...userData
    pet: { type: 'dog', food: 'kibble' },
    car: { model: 'Legacy', doors: 4 }
}
```

### docJoin Code

The code for this custom operator can be broken down into three major steps. 

1. Retrieve the data from the parent document, save it to an internal variable so it can be combined with the joins. 
2. [switchMap](http://rxjsdocs.com/#/operators/switchMap) to the doc reads of the relational data and combine them with [combineLatest](http://rxjsdocs.com/#/operators/combineLatest). This will wait for all reads to finish before any data is emitted. 
3. Map the joins to the parent document as a single object Observable. 


```typescript
import { AngularFirestore } from 'angularfire2/firestore';

import { combineLatest, defer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export const docJoin = (
  afs: AngularFirestore,
  paths: { [key: string]: string }
) => {
  return source =>
    defer(() => {
      let parent;
      const keys = Object.keys(paths);

      return source.pipe(
        switchMap(data => {
          // Save the parent data state
          parent = data;

          // Map each path to an Observable
          const docs$ = keys.map(k => {
            const fullPath = `${paths[k]}/${parent[k]}`;
            return afs.doc(fullPath).valueChanges();
          });

          // return combineLatest, it waits for all reads to finish
          return combineLatest(docs$);
        }),
        map(arr => {
          // We now have all the associated douments
          // Reduce them to a single object based on the parent's keys
          const joins = keys.reduce((acc, cur, idx) => {
            return { ...acc, [cur]: arr[idx] };
          }, {});

          // Return the parent doc with the joined objects
          return { ...parent, ...joins };
        })
      );
    });
};
```


## Collection Join (Left Join SQL)

{{< figure src="img/collection-join-firestore.png" caption="" >}}

One of most useful types of joins in a SQL database is a [LEFT JOIN](https://www.w3schools.com/sql/sql_join_left.asp), which gives us all records from the first table, then any matching records from another table based on a shared key.  

We can achieve a similar style query in Firestore when documents from two collections share a common key-value pair, similar conceptually to a primary and foreign key in SQL. In this example, it will replace the keys on the left collection with the query data from the right collection. 

### Usage

Let's say we have a database structure that looks something like this below.
```
+users
    docId=jeff {
        userId: 'jeff'
        ...data
    }

+orders
    docId=a {
        orderNo: 'A'
        userId: 'jeff'
    }

    docId=b {
        orderNo: 'B'
        userId: 'jeff'
    }

```

Our goal is to query the users collection, then query each orders collection for every doc, for instance: `orders.where('userId', '==',  userId)`. 

The operator has three required arguments and an optional limit `leftJoin(afs, joinKey, joinCollection, limit=100)`. 


```typescript
const users$ = afs.collection('users').valueChanges()
const usersOrders$ = users$.pipe( 
  leftJoin(afs, 'userId', 'orders') 
)

///// result: users collection with orders array on each doc ///// 

[
  { ...user1Data, orders: [{ orderNo: 'A', userId: 'jeff' }, { orderNo: 'B', userId: 'jeff' }]},
  { ...user2Data, orders: [...]}
]
```

### leftJoin Code

The code for a collection join is slightly more complex, but overall pattern is identical to the previous operator. Let's break them down again: 

1. Call *switchMap* on the initial query. 
2. Loop over documents in that query, setting up a secondary query based on the common key-value pair between the documents. Perform all join queries together with *combineLatest*.
3. Map them join queries to documents in the original query. 

<p class="success">I've also added custom logging to this operator so we know the total documents in the joined query. In the console, it will log something like **Queried 25, Joined 100**, so you know that 125 reads were executed.</p>

```typescript
import { AngularFirestore } from 'angularfire2/firestore';

import { combineLatest, pipe, of, defer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export const leftJoin = (
  afs: AngularFirestore,
  field,
  collection,
  limit = 100
) => {
  return source =>
    defer(() => {
      // Operator state
      let collectionData;

      // Track total num of joined doc reads
      let totalJoins = 0;

      return source.pipe(
        switchMap(data => {
          // Clear mapping on each emitted val ;
          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          for (const doc of collectionData) {
            // Push doc read to Array
            if (doc[field]) {
              // Perform query on join key, with optional limit
              const q = ref => ref.where(field, '==', doc[field]).limit(limit);

              reads$.push(afs.collection(collection, q).valueChanges());
            } else {
              reads$.push(of([]));
            }
          }

          return combineLatest(reads$);
        }),
        map(joins => {
          return collectionData.map((v, i) => {
            totalJoins += joins[i].length;
            return { ...v, [collection]: joins[i] || null };
          });
        }),
        tap(final => {
          console.log(
            `Queried ${(final as any).length}, Joined ${totalJoins} docs`
          );
          totalJoins = 0;
        })
      );
    });
};
```



## The End

We built two unique RxJS operators that perform joins in Firestore and solve similar problems to those in SQL databases. Keep in mind, there is no one right way to do this - consider it a starting point to create abstractions around your own business logic. 



