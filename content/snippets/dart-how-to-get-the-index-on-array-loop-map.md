---
title: Access the Index on Dart List.map()
lastmod: 2021-11-24T07:55:05-07:00
publishdate: 2019-11-24T07:55:05-07:00
author: Jeff Delaney
draft: false
description: How to access the index when using the map method on a Dart List.
type: lessons
tags: 
    - flutter
    - dart
---

The following snippet demonstrates how to access the iteration index when using [List.map](https://api.dartlang.org/stable/2.6.1/dart-core/Iterable/map.html). It is a common need in Flutter when looping over or mapping a list of values to widgets. 


## Problem

Unlike JavaScript, one cannot simply access the index of a list during a `List.map` operation in Dart. 

{{< file "dart" "main.dart" >}}
```dart
final myList = ['a', 'b', 'c'];

myList.map( (val, index) {
    // This does not work!
    // Which index am I on?
});
```

## Solutions

There are several ways to access the index when looping over a List. 

### Use `indexed`

Every `Iterable` has an [`indexed`](https://api.dart.dev/dart-collection/IterableExtensions/indexed.html) extension available, you can call it to have a new `Iterable` of `(int, E)`.

{{< file "dart" "main.dart" >}}
```dart
myList.indexed.map((entry) {
    int idx = entry.$1;
    String val = entry.$2;

    return something;
});
```

### Use Map Entries

Convert the `List` to a `Map`, then map the [entries](https://api.dart.dev/dart-core/Map/entries.html) containing the key/value pairs. Each key in the map is the index of the original list. 

{{< file "dart" "main.dart" >}}
```dart
myList.asMap().entries.map((entry) {
    int idx = entry.key;
    String val = entry.value;

    return something;
});
```


### Generate a Fixed Range List

If you are looping over many lists that have a fixed length, it may be more efficient to generate a single list once. For example, the we create a ranged list that is the same length as the original, i.e. `[0, 1, 2, ..., n]`

```dart
final fixedList = List.generate(myList.length, (i) => i);


fixedList.map((idx) {
    String val = myList[idx];

    return something;
});
```


### Grab the Index of Unique Values

You can access the index of a specific value by searching for it with [List.indexOf](https://api.dart.dev/dart-core/List/indexOf.html), which returns the index of the first match. This approach is most predictable when all values are unique. A [Set](https://api.dart.dev/dart-core/Set-class.html) can ensure uniqueness throughout the list. 

```dart
final uniqueList = Set.of(myList).toList();


uniqueList.map((val) {
    String idx = uniqueList.indexOf(val);

    return something;
});
```
