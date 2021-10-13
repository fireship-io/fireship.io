---
title: Generics
description: Use generics to parameterize types
weight: 35
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642586
emoji: 🎁
video_length: 1:06
---

## What are Generics?

Generics are a way to parameterize types. They allow a class to wrap a type, and then use that type in multiple places. For example, we can have a `Box` class that wraps an `double` or `String` type.

{{< file "dart" "generics.dart" >}}
```dart
Box<String> box1 = Box('cool');
Box<double> box2 = Box(2.23);
```


## Using Generics in a Class

A generic type is a type that can be used as a substitute for a type parameter. 

{{< file "dart" "generics.dart" >}}
```dart
class Box<T> {
  T value;

  Box(this.value);

  T openBox() {
    return value;
  }
}
```