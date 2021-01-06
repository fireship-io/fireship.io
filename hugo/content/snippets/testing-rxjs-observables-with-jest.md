---
title: Testing RxJS Observables With Jest
lastmod: 2018-08-18T18:39:19-07:00
publishdate: 2018-08-18T18:39:19-07:00
author: Jeff Delaney
draft: false
description: Learn how to write unit testing RxJS Observables using Jest
tags: 
    - jest
    - rxjs

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The snippet below shows you how to test asynchronous [RxJS Observables](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) with [Jest](https://facebook.github.io/jest/). It's probably easier than you think.

## Testing a Single Emitted Value

Let's imagine we have an Observable that should emit a string, which we can create with the [of](https://www.learnrxjs.io/operators/creation/of.html) helper. The key to making this test work is passing it the the `done` keyword, otherwise it will finish before the data is emitted. 

You can then write your expectations inside of the the subscribe callback, then call `done()` when you're ready for the test to finish. 

```typescript
import { of } from 'rxjs';

test('the observable emits hello', done => {
  of('hello').subscribe( data => {
    expect(data).toBe('hola');
    done();
  });
});
```

The test above should fail because *hola !== hello*. 

## Testing a Complex Stream

RxJS is all about realtime streams. How might we test an observable the emits multiple values? For that, we will need to listen for the complete signal to be sent. If your Observable is a stream that never completes, you'll also want to pipe in an operator to force completion, like [takeWhile](https://www.learnrxjs.io/operators/filtering/takewhile.html), otherwise Jest will timeout after 5000ms. 

```typescript
import { from } from 'rxjs';

test('the observable interval emits 100 then 200 then 300', done => {
        let last = 100;
        from([100, 200, 300])
        .subscribe({
            next: val => {
                expect(val).toBe(last)
                last += 100
              },
            complete: () => done(),
        })
            
});
```
