---
title: Interfaces
description: How implicit interfaces work in Dart
weight: 32
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642597
emoji: 🧬
video_length: 1:22
---

An interface is a contract that a class must follow. Prefixing a method or variable with `_` makes it private, so it won't be visible when imported from a different file. 

{{< file "dart" "interfaces.dart" >}}
```dart
class Elephant {
  // Public interface
  final String name;

  // In the interface, but visible only in this library. (private)
  final int _id = 23;

  // Not in the interface, since this is a constructor.
  Elephant(this.name);

  // Public method.
  sayHi() => 'My name is $name.';

  // Private method.
  _saySecret() => 'My ID is $_id.';
}
```