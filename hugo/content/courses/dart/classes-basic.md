---
title: Classes
description: Code your first Dart class
weight: 30
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642340
emoji: 🥚
video_length: 3:05
chapter_start: Classes
---

## Create a Class

Classes are a way to group data and behavior together, like a blueprint for an Object.

{{< file "dart" "classes.dart" >}}
```dart
class Basic {
  int id;

  Basic(this.id);

  doStuff() {
    print('Hello my ID is $id');
  }
}
```

## Create an Object

Use the class to instantiate an Object. The `new` keyword is optional.

{{< file "dart" "classes.dart" >}}
```dart
Basic thing = new Basic(55);
thing.id;
thing.doStuff();
```

## Static Methods

You can call static methods on the class itself without creating a new object. 

{{< file "dart" "main.dart" >}}
```dart
class Basic {

  static globalData = 'global';
  static helper() {
      print('helper');
  }
}

Basic.globalData;
Basic.helper();

```



