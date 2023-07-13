---
title: Null Safety Explained
description: A practical guide to null safety in Dart
weight: 14
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629643814
youtube:
emoji: 🦺
video_length: 2:53
free: true
---

Sound [null safety](https://dart.dev/null-safety) is a feature added to Dart 2.0. It means variables can no longer be assigned `null` by default. This reduces the risk of runtime bugs and general makes our code more concise because "null checking" is no longer necessary.

## Non-Nullable by Default

Variables cannot be `null` by default. Attempting to assign a null value will result in a compile-time error.

{{< file "dart" "main.dart" >}}
```dart
int age = 75; // non-nullable
int age = null; // error
```

## Allow Null

In some cases, it is useful to allow a variable to be null, which is achieved by adding question mark to the end of the variable's type.

{{< file "dart" "main.dart" >}}
```dart
int? age; // nullable
```

## Late Variable Initialization

In many cases, we can't set the value of a variable during initialization, BUT we know that it WILL be assigned at runtime. This is known as late variable initialization and can be achieved by adding an `late` keyword to the variable's declaration. This is also known as a "lazy" variable and should only be used when absolutely necessary.


{{< file "dart" "main.dart" >}}
```dart
class Animal {
  late final String _size;

  void goBig() {
    _size = 'big';
    print(_size);
  }
}
```


## Assertion Operator

Another possible situation is that you want to assign a *nullable value* TO a *non-nullable variable*. Dart will not allow this by default, but you can use the assertion operator `!` to force the compiler to think the value it is non-null.


{{< file "dart" "main.dart" >}}
```dart
String? answer;

String result = answer; // error

String result = answer!; // works
```

