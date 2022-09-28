---
title: "Infinite Scroll Firestore Angular"
lastmod: 2017-10-11T05:26:11-07:00
publishdate: 2017-10-11T05:26:11-07:00
author: Jeff Delaney
draft: false
description: Perform infinite scroll pagination, both downwards and upwards, with Firestore and Angular.
tags: 
    - firestore
    - firebase
    - angular

youtube: -yae3DNV1mY
github: https://github.com/AngularFirebase/62-firestore-infinite-scroll
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

A few months ago, I showed you how to create a basic infinite scroll feature using Realtime Database. Today, we will create a more sophisticated and flexible pagination service with Firestore to facilitate infinite scroll. 

As an added bonus, the feature will be able to scroll *upwards*, which is useful when scrolling back in time through a text feed - think Facebook Messenger or Slack. 

<p class="success">Get the [Firestore Pagination source code](https://github.com/AngularFirebase/62-firestore-infinite-scroll).</p>


## How it Works

In Firstore, you need to make a [brand new query with a document cursor](https://firebase.google.com/docs/firestore/query-data/query-cursors) each time you want more data. AngularFire2 provides this data in the `snapshotChanges()` method, making it possible to map custom objects that have the raw snapshot we need as a cursor. 

I experimented with a few different patterns and found my favorite approach was to use a service to keep track of a query configuration. This allows you to repeat a consistent query, while updating the cursor after each new batch. It keeps track of all source data on the service, which may or may not be desirable for your use case. The end result is an API that looks like this: 

- `init()` - Configure the initial query.
- `more()` - Request another batch of data. 

The service provides three Observables for use in the HTML. 

- `data` - Array of documents from Firestore.
- `loading` - true when loading executing a query.
- `done` - true when the end of the database is reached.

### Downward Scrolling

Downward scrolling is the default usage. 

{{< figure src="img/infinite-scroll-firestore1.gif" caption="Upward infinite scroll angular firestore" >}}

### Upward Scrolling

It also supports upward scrolling by prepending new items. 

{{< figure src="img/infinite-scroll-firestore2.gif" caption="Downward infinite scroll angular firestore" >}}

## Scrollable Directive

```shell
ng g directive scrollable
```

<p class="warn">Direct access to the DOM will cause errors if compiling Angular for platform-server or web-worker. You can get around this by wrapping DOM access code in a `try-catch` block and provide a fallback for users, such as a clickable button to load more items.</p>

We need a directive that can tell us if we have reached the top and/or bottom of the page. Using `@Output` and `EventEmitter` we can create a custom event that will tell us whether the user has scrolled to the bottom of the container. 

The `top` and `bottom` values for an element can be calculated using scroll data from the DOM. 


```typescript
import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter()
  
  constructor(public el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    try {

      const top = event.target.scrollTop
      const height = this.el.nativeElement.scrollHeight
      const offset = this.el.nativeElement.offsetHeight

      // emit bottom event
      if (top > height - offset - 1) {
        this.scrollPosition.emit('bottom')
      }

      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top')
      }

    } catch (err) {}
  }

}
```

When using this directive, your container div must handle overflow with a scroll bar for example: 

```css
.container {
  overflow-y: scroll;
}
```

## Using the Directive in a Component

Now let's see how the directive works in the `app.component`. First, set up an event handler in the typescript.

```typescript
  scrollHandler(e) {
    console.log(e)
    // should log top or bottom
  }
```

Then fire the handler on the custom `scrollPosition` event in the HTML.  

```html
<div scrollable (scrollPosition)="scrollHandler($event)">
  add some content here
</div>
```

You should see the events logged in the browser console. 

## Loading Spinner (Optional)

```shell
ng g component loading-spinner
```

I am using a loading spinner in this demo from [spinkit](http://tobiasahlin.com/spinkit/). You can simply copy and paste the HTML and CSS from spinkit into the component files. 

## Pagination Service for Firestore

```shell
ng g service pagination
```

My goal is to provide you with a generic service that can provide a decent level flexibility when paginating with Firestore. 

 ### Query Configuration

 The `QueryConfig` interface defines the options are passed to the `init` method in the service. These options reproduce consistent queries and simplify components that use the service. The only required fields are `path` (the collection path in firestore) and `field` (the field you want the collection ordered by). All other fields are optional and will be set to defaults in the service.  

```typescript
interface QueryConfig {
  path: string, //  path to collection
  field: string, // field to orderBy
  limit: number, // limit per query
  reverse: boolean, // reverse order?
  prepend: boolean // prepend to source?
}
```

### Service 

There's quite a bit going on here. I will try to break it down on a per-method basis. 

- `mapAndUpdate()` is where the actual data request occurs. It maps the snapshot to the usable data and the snapshot cursor. 
- `getCursor()` If prepending documents to the feed, we need the first index, otherwise, we need the last index, or return null if it's empty.
- `init()` takes the query options and makes a collection reference to Firestore. It also defines the `data` Observable, which is an array of documents that can grow with future queries using the RxJS `scan` operator. If prepending, we concat new elements to the beginning of the array. 
- `more()` is used for all subsequent queries.  It also finds the appropriate cursor and adds `startAfter` to offset the query. 

```typescript
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';

@Injectable()
export class PaginationService {

  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(private afs: AngularFirestore) { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.query: QueryConfig = { 
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    }

    const first = this.afs.collection(this.query.path, ref => {
      return ref
              .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
              .limit(this.query.limit)
    })

    this.mapAndUpdate(first)

    // Create the observable array for consumption in components
    this.data = this._data.asObservable()
        .scan( (acc, val) => { 
          return this.query.prepend ? val.concat(acc) : acc.concat(val)
        })
  }

 
  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor()

    const more = this.afs.collection(this.query.path, ref => {
      return ref
              .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
              .limit(this.query.limit)
              .startAfter(cursor)
    })
    this.mapAndUpdate(more)
  }


  // Determines the doc snapshot to paginate query 
  private getCursor() {
    const current = this._data.value
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc 
    }
    return null
  }


  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return };

    // loading
    this._loading.next(true)

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data()
          const doc = snap.payload.doc
          return { ...data, doc }
        })
  
        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values

        // update source with new values, done loading
        this._data.next(values)
        this._loading.next(false)

        // no more values, mark done
        if (!values.length) {
          this._done.next(true)
        }
    })
    .take(1)
    .subscribe()

  }

}
```

## Using the Service in a Component

The service code was complex, but it provides a very simple API for handling infinite scroll in the component. You only need to perform two steps. 

(1) Use `init(path, field, opts?)` to load the initial query. Here's how to use it. 

```typescript
init(path: string, field: string, opts: {
    limit: number,
    reverse?: boolean,
    prepend?: boolean
})
```

- path  - path to collection
- field - field to order by
- limit - number of docs per query
- reverse - order desc
- prepend - add new docs to start of list

(2) After the initial query, simply run `more()` to add the next batch of data. Here we run it on the scroll event, but you could also use it with a click or any other event. 

```typescript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {


  constructor(public page: PaginationService) {}

  ngOnInit() {
    this.page.init('boats', 'year', { reverse: true, prepend: false })
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.page.more()
    }
  }
  
}
```

The service provides three Observables we can use in the HTML. 

- `data` -  Array of data from Firestore
- `loading` - true when making next query 
- `done` - true when the end of database is reached

```html
<div class="content" scrollable (scrollPosition)="scrollHandler($event)">

  <div *ngFor="let boat of page.data | async">
    <h1>Built in {{ boat.year }}</h1>
    <img [src]="boat.url">
  </div>

  <p *ngIf="page.done | async">I ran out of boats!</p>
  <loading-spinner  *ngIf="page.loading | async"></loading-spinner>
</div>
```

## The End

Hopefully this gives you a decent jumpstart on pagination and infinite scroll in your Angular Firestore project. This service can be customized in many ways, so please reach out if you have any questions. 
