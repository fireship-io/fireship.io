---
title: Advanced Firestore Usage Guide with Angular
lastmod: 2017-10-16T06:48:43-07:00
publishdate: 2018-08-10T06:48:43-07:00
author: Jeff Delaney
draft: false
description: A variety of tips and snippets that make AngularFire v5 and Firestore easier to use.
tags: 
    - pro
    - firestore
    - firebase
    - angular

youtube: 0bCdTzWXt1s
pro: true 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following lesson provides a variety of tips and snippets that make [AngularFire2](https://github.com/angular/angularfire2) and Firestore much easier to use. The goal is to provide you with a global service that can simplify your codebase and solve common challenges faced with Angular Firebase development. 


## 0. Important Firestore Caveats

1. You cannot run `update` on a document reference that does not exist (unlike RTDB)
2. Collections are not ordered by document ID (unlike RTDB)
3. You cannot save nested arrays (unlike RTDB)
4. When you delete a document, its nested collections are NOT deleted (unlike RTDB)


## 1. Create a Generic Service to Extend Firestore

**Benefit:** Customize AngularFire to behave the way you want it. 

You can extend `AngularFirestore` database service by wrapping it with your own Angular service. This allows you to inject your own custom firestore features into any component.

```shell
ng g service firestore
```

The goal of this service is to (1) increase readability, (2) reduce code, and (3) extend functionality. 

```typescript
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Action,
  DocumentSnapshotDoesNotExist,
  DocumentSnapshotExists,
} from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}


  // code goes here

}
```

 
## 2. Get Observables with a String

In AngularFire v5, the reference to an object is decoupled from the Observable data. That can be useful, but also requires more code. Sometimes I just want my `Observable` data in a concise readable format. 

I created a predicate type that accepts either a `string` or an `AngularFire(Collection | Document)`. This gives you the flexibility to pass these helper methods a string or firebase reference. In other words, you don't need to explicitly define a reference every time you want an Observable.  

<p class="warn">The methods in this section are reused throughout this lesson, so do not skip this part.</p>

**Benefit:** Return observables with a firestore reference or just a single string, making code more concise and readable. 




```typescript
// *** Usage

this.db.doc$('notes/ID')
this.db.col$('notes', ref => ref.where('user', '==', 'Jeff'))

/// OR just like regular AngularFire

noteRef: AngularFireList = this.db.doc('notes/ID');
this.db.doc(noteRef)
this.noteRef.valueChanges()

// *** Code

  // Custom Types

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

  // Return a reference

  /// **************
  /// Get a Reference
  /// **************

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /// **************
  /// Get Data
  /// **************

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
          return doc.payload.data() as T;
        }),
      );
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs: DocumentChangeAction<T>[]) => {
          return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
        }),
      );
  }


```

## 3. CRUD Operations with Server Timestamps

Firestore does not automatically order data, so you need to have at least one property to order by. To address this concern, I have extended the write operators in AngularFire to automatically maintain a `createdAt` and `updatedAt` timestamp. 

When working with a frontend JavaScript framework like Angular, the only way to keep a consistent timestamp is via a back-end server. We can use do this in Firestore with the `FieldValue.serverTimestamp()`. I recommend using a typescript getter to make this operation readable. 

**Benefit:** Always have something to `orderBy` with server-side consistency in your collections. 

```typescript
// *** Usage

db.update('items/ID', data) }) // adds updatedAt field
db.set('items/ID', data) })    // adds createdAt field
db.add('items', data) })       // adds createdAt field

// *** Code

/// Firebase Server Timestamp
get timestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
  const timestamp = this.timestamp;
  return this.doc(ref).set({
    ...data,
    updatedAt: timestamp,
    createdAt: timestamp,
  });
}

update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
  return this.doc(ref).update({
    ...data,
    updatedAt: this.timestamp,
  });
}

delete<T>(ref: DocPredicate<T>): Promise<void> {
  return this.doc(ref).delete();
}

add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
  const timestamp = this.timestamp;
  return this.col(ref).add({
    ...data,
    updatedAt: timestamp,
    createdAt: timestamp,
  });
}

```

## 4. Upsert (Update or Create) Method

My custom `upsert()` method will first check if doc exists. If YES it will update non-destructively. If NO it will set a new document. 

Note: You can also use `db.set(data, { merge: true })` to achieve similar results. However, this makes it difficult to automatically manage the timestamps in the previous step. 

**Benefit:** Never worry about *document does not exist* errors. 

```typescript
// *** Usage
this.db.upsert('notes/xyz', { content: 'hello dude'})

// *** Code
upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
  const doc = this.doc(ref)
    .snapshotChanges()
    .pipe(take(1))
    .toPromise();

  return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
    return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
  });
}
```


## 5. Get Collections with Document Ids Included

A common task is to query a collection, then use the ID to query a single document from that collection. Including the document ids in the array returned by AngularFire2 results in some pretty ugly code, so it's nice to have this wrapped in a simple helper method. This is essentially just `valueChanges()` + document IDs. 

**Benefit:** Return document keys with one line of code

```typescript
// *** Usage
db.colWithIds$('notes')


// *** Code

colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
  return this.col(ref, queryFn)
    .snapshotChanges()
    .pipe(
      map((actions: DocumentChangeAction<T>[]) => {
        return actions.map((a: DocumentChangeAction<T>) => {
          const data: Object = a.payload.doc.data() as T;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }),
    );
}
```



## 6. Inspect Data Easily

Sometimes I just want to see what I'm working with. It seems silly to re-import RxJS operators and subscribe to data every time I want to do this. I also wrapped the operation with a timer so you can check the latency for a given query. 

**Benefit:** Single line of code to console log the snapshot and time its latency. 


```typescript
// *** Usage

this.db.inspectDoc('notes/xyz')
this.db.inspectCol('notes')

// *** Code

inspectDoc(ref: DocPredicate<any>): void {
  const tick = new Date().getTime();
  this.doc(ref)
    .snapshotChanges()
    .pipe(
      take(1),
      tap((d: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>>) => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Document in ${tock}ms`, d);
      }),
    )
    .subscribe();
}

inspectCol(ref: CollectionPredicate<any>): void {
  const tick = new Date().getTime();
  this.col(ref)
    .snapshotChanges()
    .pipe(
      take(1),
      tap((c: DocumentChangeAction<any>[]) => {
        const tock = new Date().getTime() - tick;
        console.log(`Loaded Collection in ${tock}ms`, c);
      }),
    )
    .subscribe();
}
```



## 7. Using The Geopoint Datatype

If you're building a map-based app, you're going to want to make use of the `GeoPoint` class. It will give you consistent formatting and lat/lng validation for location data. Here's how we can make one in AngularFire. 

```typescript
// *** Usage
const geopoint = this.db.geopoint(38, -119)
return this.db.add('items', { location: geopoint })

// *** Code
geopoint(lat: number, lng: number) {
  return new firebase.firestore.GeoPoint(lat, lng)
}
```


## 8. Handle the Document Reference type

A Firestore document can embed references to other Firestore documents - an awesome little feature, but not so easy to take advantage of with AngularFire2. 


{{< figure src="img/doc-reference-angularfire.png" caption="Reference a document from a document in Firestore" >}}

Here's how you would associate an item doc with user doc in Angular. 

```typescript
const itemDoc = this.db.doc('items/xyz')
const userDoc = this.db.doc('users/jeff')

this.db.update({ user: userDoc.ref })
```

I am going to leverage the helper methods from our service in this section. Refer back to section 2 to review how the `doc$` helper method works. Here's how to get the a user Observable if it is referenced on a note document. 

```typescript
this.user = this.doc$('items/xyz').switchMap(doc => {
  return this.db.doc$(doc.friend.path)
})
```

Alternatively, we can create a pipe for use in the HTML. The pipe takes the raw firestore document reference and converts it into an Observable. 

```shell
ng g pipe doc
```

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {

  constructor(private db: FirestoreService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path)
  }

}
```

Here's how it looks in the HTML. (The `note` is a document that references at `user` document.)


```html
<div *ngIf="noteDoc | async as note">
  {{ (note.user | doc | async)?.name }}
</div>
```


## 9. Make Atomic Writes

An atomic write operation occurs when all operations succeed/fail together. In a SQL database, atomic writes are baked in by default. Firestore and Document databases in general require atomic writes to be structured in a specific way. 

In this example, we use the Firestore SDK directly to make the updates. You perform operations on the `batch` instance, then run `batch.commit()` to run everything together.  


```typescript
  atomic() {
    const batch = firebase.firestore().batch()
    /// add your operations here

    const itemDoc = firebase.firestore().doc('items/myCoolItem');
    const userDoc = firebase.firestore().doc('users/userId');

    const currentTime = this.timestamp

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit()
  }
```


## 10. Delete Entire Collections

When you delete a document in Firestore, it's nested sub-collections are NOT deleted along with it. Furthermore, AngularFire does not have a built-in method for deleting collections, so let's modify the one from the main API documentation. 


This section has been made into an entire [video lesson about deleting Firestore collections](https://angularfirebase.com/lessons/delete-firestore-collections-with-angular-and-rxjs/). 

## Full Service Code

Copy and paste the full code to start using these helper methods in your own project. 



```typescript
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  DocumentChangeAction,
  Action,
  DocumentSnapshotDoesNotExist,
  DocumentSnapshotExists,
} from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, take, switchMap, mergeMap, expand, takeWhile } from 'rxjs/operators';

import * as firebase from 'firebase/app';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

  /// **************
  /// Get a Reference
  /// **************

  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  /// **************
  /// Get Data
  /// **************

  doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
          return doc.payload.data() as T;
        }),
      );
  }

  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs: DocumentChangeAction<T>[]) => {
          return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
        }),
      );
  }

  /// with Ids
  colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions: DocumentChangeAction<T>[]) => {
          return actions.map((a: DocumentChangeAction<T>) => {
            const data: Object = a.payload.doc.data() as T;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        }),
      );
  }

  /// **************
  /// Write Data
  /// **************

  /// Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const timestamp = this.timestamp;
    return this.doc(ref).set({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    return this.doc(ref).update({
      ...data,
      updatedAt: this.timestamp,
    });
  }

  delete<T>(ref: DocPredicate<T>): Promise<void> {
    return this.doc(ref).delete();
  }

  add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp,
    });
  }

  geopoint(lat: number, lng: number): firebase.firestore.GeoPoint {
    return new firebase.firestore.GeoPoint(lat, lng);
  }

  /// If doc exists update, otherwise set
  upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
    const doc = this.doc(ref)
      .snapshotChanges()
      .pipe(take(1))
      .toPromise();

    return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
      return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
    });
  }

  /// **************
  /// Inspect Data
  /// **************

  inspectDoc(ref: DocPredicate<any>): void {
    const tick = new Date().getTime();
    this.doc(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((d: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>>) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Document in ${tock}ms`, d);
        }),
      )
      .subscribe();
  }

  inspectCol(ref: CollectionPredicate<any>): void {
    const tick = new Date().getTime();
    this.col(ref)
      .snapshotChanges()
      .pipe(
        take(1),
        tap((c: DocumentChangeAction<any>[]) => {
          const tock = new Date().getTime() - tick;
          console.log(`Loaded Collection in ${tock}ms`, c);
        }),
      )
      .subscribe();
  }

  /// **************
  /// Create and read doc references
  /// **************

  /// create a reference between two documents
  connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) {
    return this.doc(host).update({ [key]: this.doc(doc).ref });
  }

  /// returns a documents references mapped to AngularFirestoreDocument
  docWithRefs$<T>(ref: DocPredicate<T>) {
    return this.doc$(ref).pipe(
      map((doc: T) => {
        for (const k of Object.keys(doc)) {
          if (doc[k] instanceof firebase.firestore.DocumentReference) {
            doc[k] = this.doc(doc[k].path);
          }
        }
        return doc;
      }),
    );
  }

  /// **************
  /// Atomic batch example
  /// **************

  /// Just an example, you will need to customize this method.
  atomic() {
    const batch = firebase.firestore().batch();
    /// add your operations here

    const itemDoc = firebase.firestore().doc('items/myCoolItem');
    const userDoc = firebase.firestore().doc('users/userId');

    const currentTime = this.timestamp;

    batch.update(itemDoc, { timestamp: currentTime });
    batch.update(userDoc, { timestamp: currentTime });

    /// commit operations
    return batch.commit();
  }

  /**
   * Delete a collection, in batches of batchSize. Note that this does
   * not recursively delete subcollections of documents in the collection
   * from: https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts
   */
  deleteCollection(path: string, batchSize: number): Observable<any> {
    const source = this.deleteBatch(path, batchSize);

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize)),
      takeWhile(val => val > 0),
    );
  }

  // Detetes documents as batched transaction
  private deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize));

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.payload.doc.ref);
        });

        return from(batch.commit()).pipe(map(() => snapshot.length));
      }),
    );
  }
```