---
title: Variables
description: Fundamentals of variables and common data types in Dart
weight: 13
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629643910
youtube:
emoji: 🧰
video_length: 4:49
---

## Basic data types

Declare a variable by putting the data type in front of the variable name.

{{< file "dart" "main.dart" >}}
```dart
int num1 = 2;
double num2 = 3.0;
bool isTrue = true;
String str = 'Hello';
```

## Runtime Type Checking

You can check the runtime type of a variable using the `is` keyword, or via its `runtimeType` property.


{{< file "dart" "main.dart" >}}
```dart
(num1 + num2) is int
(num1 + num2).runtimeType
```

## Var Keyword

The `var` keyword is like saying I don't care to annotate the variable with a type. If you don't specify a value, it will be automatically inferred as `dynamic` (try to avoid this).

{{< file "dart" "main.dart" >}}
```dart
var username; // dynamic
var username = 'fireship'; // String
```

## Final vs Const

The `final` keyword is used to declare a variable that cannot be reassigned. It's a good practice to use final whenever possible.

{{< file "dart" "main.dart" >}}
```dart
final String fullname = 'Jeffrey';
fullname = 'Jefferson' // error;
```

The `const` keys is almost identical to `final`, but it creates an immutable compile-time constant. It may improve app performance, but can only be used for values known at compile time.

{{< file "dart" "main.dart" >}}
```dart
const int age = 75;
const int favNumber = num1 + 5; // error
```

See more in the [official](https://dart.dev/guides/language/language-tour#final-and-const) docs
