---
title: Check for Signed-in User in AngularFire
lastmod: 2018-03-31T18:47:13-07:00
publishdate: 2018-03-31T18:47:13-07:00
author: Jeff Delaney
draft: false
description: Check if Current User is Signed-In or for data existence in AngularFire
tags: 
    - angular
    - firebase

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

A common requirement in any app is to determine if the current user is logged-in. Or you might want to check if a database record exists before performing some logic. Doing this in an elegant want throughout your [AngularFire2](https://github.com/angular/angularfire2) app is not always obvious. 

While we could use RxJS, I find it much easier to handle these situations with Promises because they are NOT streams, but rather simple one-off operations. 

## Get the Current User

Converting an Observable to a Promise requires a completed signal from the stream. The AngularFire auth state will not complete automatically, so we pipe in the `first` operator to kill it after the first emitted value.  

### Promise-Based Solution

If prefer this approach for the elegant async/await syntax. 

```typescript
import { first } from 'rxjs/operators';


isLoggedIn() {
   return this.afAuth.authState.pipe(first()).toPromise();
}

async doSomething() {
   const user = await isLoggedIn()
   if (user) {
     // do something
   } else {
     // do something else
  }
}
```

### Observable-Based Solution

Here's the equivalent with an Observable. Not quite as elegant, especially when you need to perform this logic frequently,

```typescript
import { first, tap } from 'rxjs/operators';

isLoggedIn() {
   return this.afAuth.authState.pipe(first())
}

doSomething() {
  isLoggedIn().pipe(
    tap(user => {
      if (user) {
        // do something
      } else {
        // do something else
      }
    })
  )
  .subscribe()
}
```

## Check if a Firestore Document Exists

We can use a similar helper to determine if a certain Firestore document exists. 

```typescript
docExists(path: string) {
   return this.afs.doc(path).valueChanges().pipe(first()).toPromise()
}
```

Let's say we want to *find or create a document*. 

```typescript
async findOrCreate(path: string, data: any) {
  const doc = await docExists(path);

  if (doc) {
    return 'doc exists'
  } else {
    await this.afs.doc(path).set(data)
    return 'created new doc'
  }
}
```