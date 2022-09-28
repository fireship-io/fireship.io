---
title: Mixin
description: Use mixins to extend specific behaviors to classes
weight: 34
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642659
emoji: 🎛️
video_length: 1:07
---


## What are mixins?

A mixin is just like a class, it can have methods and properties, but it can't be instantiated.

{{< file "dart" "mixins.dart" >}}
```dart
mixin Strong {
  bool doesLift = true;

  void benchPress() {
    print('doing bench press...');
  }
}

mixin Fast {
  bool doesRun = true;

  void sprint() {
    print('running fast...');
  }
}
```

## What are mixins used for?

Mixins are used to extend specific behaviors to classes with the `with` keyword. Certain Flutter libaries use mixins to extend shared behaviors to classes.

{{< file "dart" "mixins.dart" >}}
```dart
class Human {}

class SuperHuman extends Human with Strong, Fast {}
```