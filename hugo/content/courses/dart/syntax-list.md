---
title: List
description: Use the array-like Dart List to manage a collection of objects
weight: 23
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629644674
emoji: 🍇
video_length: 3:01
---

## Basic Lists

{{< file "dart" "lists.dart" >}}
```dart
List<int> list = [1, 2, 3, 4, 5];

list[0]; // 1

list.length; // 5
list.last; // 5
list.first; // 1
```

## Loops

{{< file "dart" "lists.dart" >}}
```dart
  for (int n in list) {
    print(n);
  }

list.forEach((n) => print(n));

var doubled = list.map((n) => n * 2);
```

## Spread Syntax

{{< file "dart" "lists.dart" >}}
```dart
var combined = [...list, ...doubled];
combined.forEach(print);
```

## Conditions in Lists

{{< file "dart" "lists.dart" >}}
```dart
bool depressed = false;
var cart = [
    'milk', 
    'eggs', 
    if (depressed) 'Vodka'
];
```