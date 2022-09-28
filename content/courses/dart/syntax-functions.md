---
title: Functions
description: First-class Functions and Functional Programming in Dart
weight: 22
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629644566
emoji: 🧮
video_length: 3:17
---

## Basic Functions

Function with positional parameters:

{{< file "dart" "functions.dart" >}}
```dart
  // Basic Function
  String takeFive(int number) {
    return '$number minus five equals ${number - 5}';
  }
```

Function with named parameters:

{{< file "dart" "functions.dart" >}}
```dart
  // Named parameters
  namedParams({required int a, int b = 5}) {
    return a - b;
  }

  namedParams(a: 23, b: 10);
```

## Arrow Functions

Arrow functions are useful when passing functions as parameters to other functions.

{{< file "dart" "functions.dart" >}}
```dart
  // Arrow Function
  String takeFive(int number) => '$number minus five equals ${number - 5}';
```

## Callback Functions

Many APIs in Dart use callback functions, often to handle events or gestures in Flutter.

{{< file "dart" "functions.dart" >}}
```dart
  // First-class functions
  callIt(Function callback) {
    var result = callback();

    return 'Result: $result';
  }
```


