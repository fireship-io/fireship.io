---
title: switchMap
lastmod: 2018-12-29T08:28:56-07:00
publishdate: 2018-12-29T08:28:56-07:00
author: Jeff Delaney
draft: false
description: RxJS switchMap operator practical examples
tags:
    - rxjs
versions:
    - "rxjs": 6.3
---

`switchMap` is one of the most useful RxJS operators because it can compose Observables from an initial value that is unknown or that change. Conceptually, it is similar to chaining `then` functions with Promises, but operates on streams (Promises resolve once).

{{% box icon="abacus" %}}
Example: You have an Observable of a userID, then use it to *switch* to an HTTP request of all posts owned by that user.
{{% /box %}}


{{< file "js" "foo.js" >}}
{{< highlight javascript >}}
import { of } from 'rxjs'; // creates an Observable with a raw value
import { switchMap } from 'rxjs/operators';


const user$ = of({ userID: 'jeffd23' });

const boats$ = user$.pipe(
    switchMap(user => {
        // return an Observable or Promise here
        return fetch(`http://.../boats/${user.userID}`)
    })
)

boats$.subscribe(console.log);
// Logs response from the API
{{< /highlight >}}

Notice how we only need to subscribe to the `boats$` Observable. It will automatically subscribe to the `$user`, then use the emitted userID to create the final observable of boats.


{{% box icon="abacus" %}}
Example 2: You have 2 Observables, named as `ob1$` and `ob2$`. `ob1$` will emit numbers and `ob2$` will emit string. You want to get string from `ob2$` when `ob1$` emitted even numbers
{{% /box %}}


{{< file "js" "bar.js" >}}
{{< highlight typescript >}}

import { of, from } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

const ob1$ = from([1, 2, 3, 4, 5])
const ob2$ = from(['one', 'two', 'three'])

// when having multiples that depending on each other
// we often ended up nesting subscription
ob1$.subscribe(firstValue => {
  if(firstValue % 2 === 0) {
    ob2$.subscribe(secondValue => console.log(secondValue))
  }
})


// with switchMap, can be refactor as below
// switchMap will abandon the following values emitted from ob1$, and only take values from ob2$
ob1$.pipe(
  filter(value => value % 2 === 0),
  switchMap(value => ob2$)
).subscribe(value => console.log(value))
{{< /highlight >}}

Nesting subscriptions are not a good practice, most of the time it can be refactor with operators

