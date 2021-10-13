---
title: Extend
description: How inheritance works in in Dart
weight: 33
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642516
emoji: 👩‍👦
video_length: 1:51
---

## Superclass

The superclass or parent class contains the behaviors that is shared by all subclasses. The `abstract` keyword is used to indicate that the class is not meant to be instantiated, but rather to be inherited from. 

{{< file "dart" "extend.dart" >}}
```dart
abstract class Dog {
  void walk() {
    print('walking...');
  }
}
```

## Subclass

The subclass can `@override` the behavior of the superclass.

{{< file "dart" "extend.dart" >}}
```dart
class Pug extends Dog {
  String breed = 'pug';

  @override
  void walk() {
    super.walk();
    print('I am tired. Stopping now.');
  }
}
```


