---
title: Typeahead Autocomplete with Firestore
lastmod: 2020-02-10T14:40:30-07:00
publishdate: 2018-02-20T14:40:30-07:00
author: Jeff Delaney
draft: false
description: Build a typeahead autocomplete search form with Firestore by implementing advanced data querying methods. 
tags: 
    - typescript
    - pro
    - rxjs
    - angular

youtube: S2fPSGkvNJI
pro: true
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


In this lesson, we will build a basic typeahead or [autocomplete](https://en.wikipedia.org/wiki/Autocomplete) system using nothing but Firestore. It relies on an [object/map data structure](https://firebase.google.com/docs/firestore/manage-data/data-types) that exposes some of the more advanced query patterns available to us. The database contains a collection of movie documents, and our goal is to build a search form that will auto-populate results based on the movie's title. 

{{< figure src="img/typeahead-firestore-demo.gif" caption="Typeahead demo using only Firestore" >}}


## Method 1: Offset with the Magic uf8ff Character

A few months ago I created a [RealtimeDB Autocomplete](https://angularfirebase.com/lessons/autocomplete-search-with-angular4-and-firebase/) lesson that uses `'\uf8ff'`, which is a very high Unicode point. It comes after all other commonly used characters, so the query will match all other values that follow it. In Firestore, that same principle can be applied like so:

```typescript
  const start = 'USER FORM INPUT HERE'
  const end = startText + '\uf8ff';

  return this.afs.collection('movies', ref => 
      ref
        .orderBy('title')
        .limit(5)
        .startAt(start)
        .endAt(end)
    )
```

This method is works well in most cases, but I also want to talk about an alternative approach using a searchable index object on the document. 

## Method 2: Firestore Searchable Data Structure

For each movie document, we will create a *mini-index* of searchable terms. It will break the word down character-by-character into an object. I will provide you with a script that you can run either clientside or serverside to build this index automatically. 

```
movies/{docId}
  title: WALL-E
  year: 2008

  searchIndex: {
    w: true
    wa: true
    wal: true
    wall: true
    walle: true
  }
```

Firestore automatically indexes every key of the `searchIndex` object, so we can make queries against each combination of characters. Later in this lesson we will create a [Cloud Function](https://firebase.google.com/docs/firestore/extend-with-functions) that generates this searchable index automatically. 

{{< figure src="img/searchable-index-firestore.gif" caption="Embedding a searchable index on a firestore document" >}}

### Pros

While this data structure may not seem ideal, it does provide several benefits over full-text search. 

- Does not require paid dependencies (Algolia, ElasticSearch, etc.)
- Easier implementation

### Cons

We are also faced with some limitations, so I'd like to lay those out:

- It can only search one property (i.e the movie title).
- It will not detect spelling errors.
- The searchable index will be case-insensitive.

Hypothetically, you could address these issues by expanding the object with additional properties, but you can only embed so much data on a single document.

If you need a system that can handle spelling errors or complex multi-property suggestions, your life will be made easier with a full-text search engine like [Algolia](/tags/algolia).

## Angular Autocomplete Search Component

Now that we know what our data structure looks like, let's build a component that can make the query reactively. 

It works by observing the form input as a `Subject` and updates the search term offset value on each `keyup` event. When a new value is entered, it updates the Firestore query on the searchable index, telling firestore to emit a new array of movie documents that match the title substring. 

### type-ahead.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { switchMap, filter } from 'rxjs/operators';


@Component({
  selector: 'type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.sass']
})
export class TypeAheadComponent implements OnInit {

  results: Observable<any[]>;

  offset = new Subject<string>();

  constructor(private afs: AngularFirestore) { }

  // Form event handler
  onkeyup(e) {
    this.offset.next(e.target.value.toLowerCase())
  }

  // Reactive search query
  search() {
    return this.offset.pipe(
      filter(val => !!val), // filter empty strings
      switchMap(offset => {
        return this.afs.collection('movies', ref =>
          ref.orderBy(`searchableIndex.${offset}`).limit(5)
        )
        .valueChanges()
      })
    )
  }

  // Listen to the form changes
  ngOnInit() {
    this.results = this.search();
  }

}
```


### type-ahead.component.html

In the HTML, we just need to bind our `onkeyup` event handler to a form input, then loop over the results observable. 

```html
<h1>Start Typing...</h1>

<input (keyup)="onkeyup($event)" placeholder="search movies...">

<ul *ngFor="let movie of results | async" class="card">
  <li>{{ movie.title }}</li>
</ul>
```

## Automated Indexing with Cloud Functions

While it's possible to build the index clientside, this is a perfect feature to delegate to a Firebase Cloud Function. 

Let's initialize cloud functions, making sure to choose the TypeScript environment. 

```shell
firebase init functions
```

### index.ts

Our cloud function will automatically index the characters of the movie title into a searchable format. Whenever a new movie is added to the database, this function will run and update the data. 

<p class="success">If you want to run this update directly from Angular, simply extract the `createIndex` function to your frontend code and use it to format the data before running a Firestore update/set operation.</p>


```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();


exports.updateIndex = functions.firestore
.document('movies/{movieId}')
.onCreate(event => {

    const movieId = event.params.movieId;
    const movie = event.after.data();

    const searchableIndex = createIndex(movie.title)

    const indexedMovie = { ...movie, searchableIndex }

    const db = admin.firestore()

    return db.collection('movies').doc(movieId).set(indexedMovie, { merge: true })

})

function createIndex(title) {
    const arr = title.toLowerCase().split('');
    const searchableIndex = {}

    let prevKey = '';

    for (const char of arr) {
        const key = prevKey + char;
        searchableIndex[key] = true
        prevKey = key
    }

    return searchableIndex
}
```

## The End

This solution is ideal when you only need a basic autocomplete feature and want to avoid 3rd party services that could add too much complexity or cost to your project. In essence, you're trading flexibility for simplicity with this solution. Feel free to reach out in the comments or on Slack if you have questions. 
