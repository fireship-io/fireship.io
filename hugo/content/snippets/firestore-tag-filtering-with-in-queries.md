---
title: Firestore Tag Filtering With in Queries
lastmod: 2019-11-13T07:51:38-07:00
publishdate: 2019-11-13T07:51:38-07:00
author: Jeff Delaney
draft: false
description: Query by tag or category labels in Firestore using IN and array-contains-any.  
tags: 
    - firebase
    - firestore

youtube: 
github: 
type: lessons
versions: 
    firebase: 7.3.0
---

With the release of the Firebase JS SDK version 7.3.0, we now have the ability to perform [IN queries](https://firebase.googleblog.com/2019/11/cloud-firestore-now-supports-in-queries.html). It provides two new options to use with the *where* method, including `in` and `array-contains-any`. 

A common use-case is tag or category filtering. For example, you may want to display a set of checkboxes, then run an inclusive query for any results that contain at least 1 checkbox.

## Firestore IN Query

### Option 1 - Document has ONE Tag

If the document can only have one tag or category at a time, you are likely looking for an `in` query. It takes an array of values (limited to a max of 10), then returns all matching documents. It is not perfectly analogous to SQL and you can also think of it as a logical OR query, i.e. **all documents where color == red OR white OR blue**


{{< figure src="/img/snippets/firestore-in-query.png" caption="Data format for IN query" >}}

{{< file "js" "in.js" >}}
{{< highlight javascript >}}
const db = firebase.firestore();

const ref = db.collection('products');

const query = ref.where('color', 'in', ['red', 'white', 'blue']);
{{< /highlight >}}



### Option 2 - Document has MANY Tags

In other cases, your documents may be tagged with many values in an array. You fetch all documents that have a at least one value in the array with `array-contains-any`. 

{{< figure src="/img/snippets/firestore-array-contains-any.png" caption="Data format for array-contains-any query" >}}

{{< file "js" "firestore.js" >}}
{{< highlight javascript >}}
const query = ref.where('colors', 'array-contains-any', ['red', 'white', 'blue']);
{{< /highlight >}}


Simple, yet powerful! 