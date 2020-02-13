---
title: Combine Firestore Collections into a Single Array Observable
lastmod: 2018-02-20T18:50:43-07:00
publishdate: 2018-02-20T18:50:43-07:00
author: Jeff Delaney
draft: false
description: Combine Firestore collections via AngularFire, while maintaining realtime listeners 
tags: 
    - angular
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
---

In this quick snippet I will show you how to combine two or more Firestore collections from [AngularFire](https://github.com/angular/angularfire2/blob/master/docs/firestore/collections.md) into a single realtime Observable. 
 
## The Problem

Let's imagine you have queried multiple Firestore collections, but want combine them and iterate over them using `ngFor`- this is a common requirement when dealing with subcollections. In addition, you want to maintain a realtime listener to update the data if a new object is added to either query.  

Your collections might look something like this

```typescript
const usersRef = this.afs.collection('users');

const fooPosts = usersRef.doc('userFoo').collection('posts').valueChanges();
const barPosts = usersRef.doc('userBar').collection('posts').valueChanges();
```

We want a `fooPosts + barPosts` as a single Observable array. 

## Solution

We can accomplish our goal of a single unified collection with RxJS and plain JS array reduce mapping. This example will not keep maintain a specific ordering between the arrays, but you can add your own client-side logic control the ordering of the result array. 

The magic RxJS operator here is [combineLatest](http://rxmarbles.com/#combineLatest), which listens for updates on either individual Observable, but emits the both results together each time.

We can then use the plain JS [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) and [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) methods to flatten the two arrays.  


```typescript
import { combineLatest } from 'rxjs/observable/combineLatest';


const combinedList = combineLatest<any[]>(fooPosts, barPosts).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    )
```

Now you can loop over the results in the HTML.

```html
<div *ngFor="let post of combinedPosts | async">

  {{ post | json }}

</div>
```