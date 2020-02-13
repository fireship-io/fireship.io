---
title: Custom Rxjs Operators by Example
lastmod: 2018-08-26T17:28:28-07:00
publishdate: 2018-08-26T17:28:28-07:00
author: Jeff Delaney
draft: false
description: Examples of custom RxJS Pipeable Operators
tags: 
    - rxjs

youtube: JWjXBWINlzU
github: https://stackblitz.com/edit/custom-operators
# youtube: 
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Understanding how to build [custom RxJS operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) will provide a huge boost to your knowledge of [reactive programming](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) and Observables. Not to mention, they have a wide variety of practical use cases and provide excellent code reuse. The following lesson will show you how to build a handful of custom pipeable operators from scratch. 

## What is an RxJS Operator?

An operator is just a [pure function](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976) that takes the source Observable as it's input and returns an Observable as its output, usually modified in some way. Basically it's just like *valve* in your plumbing, or a *checkpoint* on the highway, or a *step* in an factory assembly line. In most cases, custom operators will map and filter values in the stream, but they can also be used to produce a side-effects like logging. In brief, a pipeable operator is just *a function that takes a source Observable and returns an Observable*, for example:

```js
const myOperator = () => (sourceObservable) => new Observable()
```

Here are a few common use cases for custom operators:

- Abstract complex code into understandable pure functions
- Implement logging and debugging
- Implement custom error handling
- Create utilities (possibly by combining Lodash)


### An Explicit Example

Let's start by looking at a full explicit example of a custom operator. In most cases, this code is overkill, but it helps to understand the entire process end-to-end. 

The operator `pow(n: number)` below will raise the emitted value to the power of n. 

```js
import { Observable, from } from 'rxjs';

// Long Version
const pow = (n: number) => (source: Observable<any>) =>
  new Observable(observer => {
    return source.subscribe({
      next(x) {
        observer.next(
          Math.pow(x, n)
        );
      },
      error(err) { observer.error(err); },
      complete() { observer.complete(); }
    });
  });
```

Now we can use our operator to raise numbers to the *power of n*. 

```js
from([1,2,3,4,5]).pipe(pow(3)).subscribe(console.log);

// Output

// 1
// 3
// 8
// 27
// 64
// 125
```

### The Concise Version

In most cases, you can piggyback on existing RxJS operators to reduce the amount of code required to write an operator. The `pow` operator above is really just mapping the input to a new output. RxJS already has a [map](http://rxjsdocs.com/#/operators/map) operator, so let's make use of it. 

```js
import { map } from 'rxjs/operators';

const pow2 = (n: number) => map(x =>
    Math.pow(x, n)
);
```

Much easier to read and maintain. 

## Lodash Operator

Lodash is a functional library that can easily be combined with RxJS to create utilities for your streams.

```
npm i lodash
```

Let's create an operator that can filter an Observable object to only properties the contain numbers. 

```js
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

// Operator
const pickNumbers = () => map(x =>
    _.pickBy(x, _.isNumber)
);

// Usage
const obs = of( { 'foo': 1, 'bar': 'str', 'baz': 3 });
obs.pipe(pickNumbers()).subscribe(console.log)

// Output

// { 'foo': 1, 'baz': 3 }
```

Now let's create the most concise customer operator ever that will filter any value that is NOT a number from the stream. 

```js
import { filter } from 'rxjs/operators';

// Operator
const numbersOnly = () => filter(_.isNumber);

// Usage
const obs = from([1, 2, '3', '4', 5]);
obs.pipe(numbersOnly()).subscribe(console.log)

// Output

// 1
// 2
// 5
```

## Using Data Across Multiple Operators

When you create a custom operator, you have an isolated context where you can maintain stateful information - i.e between emitted values and/or among multiple internal operators. For example, you might have a long operator chain and need to share data across multiple RxJS operators. Mutating/reading data from an external function violates the *pure* function principle, so there are some caveats to consider. The accepted answer is from [Cartant](https://medium.com/@cartant) in this StackOverflow question about [saving variables inside an operator](https://stackoverflow.com/questions/52020354/rxjs-custom-operator-internal-variables) explains these tradeoffs very well. 

The operator below is wrapped in `defer` to ensure that the stateful data inside is created on a per-subscription basis. This makes our operator more predictable - especially with synchronous data and late subscribers. Also, notice how we return a `pipe` from this operator, which allows us to compose multiple existing operators together. 


```typescript
import { Observable, pipe, interval, defer } from 'rxjs';
import { map, share } from 'rxjs/operators';

const stateful = () => {
  return source => defer(() => {
  let state = Math.random().toString();
    return source.pipe(
      map(next => {
        state = state + '--' + next;
        return state
      }),
      // tap( ...do something with state ),
      // switchMap( ...do something with state),
      // filter( ...do something with state )
    )

  })
}
```

Currently, each subscriber will see a different random number in the internal state. If you need to share this data across all subscribers, you can pipe in the share operator.

```typescript
const obs = interval(1000).pipe(stateful(), share())

obs.subscribe(console.log)
obs.subscribe(console.log)
```

## The End

RxJS operators can be extremely useful in wide variety of situations. Use them as small utility functions, or create abstractions for complex business logic. In the next lesson, we will look into an advanced use case that [joins Firestore collections](/lessons/firestore-joins-similar-to-sql/) together with a single custom RxJS operator. 