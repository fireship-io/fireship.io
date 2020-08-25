---
title: Access the Index on Dart List.map()
lastmod: 2019-11-24T07:55:05-07:00
publishdate: 2019-11-24T07:55:05-07:00
author: Jeff Delaney
draft: false
description: How to access the index when using the map method on a Dart List.
tags: 
    - flutter
    - dart

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The following snippet demonstrates how to access the iteration index when using [List.map](https://api.dartlang.org/stable/2.6.1/dart-core/Iterable/map.html). It is a common need in Flutter when looping over or mapping a list of values to widgets. 


## Problem

Unlike JavaScript, one cannot simply access the index of a list during a `List.map` operation in Dart. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
List myList = ['a', 'b', 'c'];

myList.map( (val, index) {
    // This does not work!
    // Which index am I on?
})
{{< /highlight >}}

## Solutions

There are several ways to access the index when looping over a List. 

### Use Map Entries

Convert the `List` to a `Map`, then map the [entries](https://api.dartlang.org/stable/2.0.0/dart-core/Map/entries.html) containing the key/value pairs. Each key in the map is the index of the original list. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
myList.asMap().entries.map((entry) {
    int idx = entry.key;
    String val = entry.value;

    return something;
}
{{< /highlight >}}


### Generate a Fixed Range List

If you are looping over many lists that have a fixed length, it may be more efficient to generate a single list once. For example, the we create a ranged list that is the same length as the original, i.e. `[0, 1, 2, ..., n]`

{{< highlight dart >}}
final List fixedList = Iterable<int>.generate(myList.length).toList();


fixedList.map((idx) {
    String val = myList[idx];

    return something;
}
{{< /highlight >}}


### Grab the Index of Unique Values

You can access the index of a specific value by searching for it with [List.indexOf](https://api.dartlang.org/stable/2.6.1/dart-core/List/indexOf.html), which returns the index of the first match. This approach is most predictable when all values are unique. A [Set](https://api.dartlang.org/stable/2.6.1/dart-core/Set-class.html) can ensure uniqueness throughout the list. 

{{< highlight dart >}}
final List uniqueList = Set.from(myList).toList();


uniqueList.map((val) {
    String idx = uniqueList.indexOf(val);

    return something;
}
{{< /highlight >}}
