---
title: Operators
description: Review common operators in Dart
weight: 21
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629644932
youtube:
emoji: 🎯
video_length: 3:24
---

Let's take a look at some of the more interesting operators in Dart.

## Assignment

Use the assignment operator to assign a value to a variable, ONLY if it's not already assigned.

{{< file "dart" "main.dart" >}}
```dart
String? name;
name ??= 'Guest';
var z = name ?? 'Guest';
```

## Ternary Operator

Use a ternary to replace the if/else statement.

{{< file "dart" "main.dart" >}}
```dart
String color = 'blue';
var isThisBlue = color == 'blue' ? 'Yep, blue it is' : 'Nah, it aint blue';
```

## Cascade

Use the cascade operator to call methods on an object without having to create a new line of code. It can often eliminate the need to create a temporary variable, which is especially useful in with working in Flutter's widget tree.

{{< file "dart" "main.dart" >}}
```dart
// var paint = Paint();
// paint.color = 'black';
// paint.strokeCap = 'round';
// paint.strokeWidth = 5.0;

var paint = Paint()
    ..color = 'black'
    ..strokeCap = 'round'
    ..strokeWidth = 5.0;
```

## Typecast

In rare cases, you may need to cast a value to a different type.

{{< file "dart" "main.dart" >}}
```dart
var number = 23 as String;
number is String; // true
```