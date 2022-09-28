---
title: Constructors
description: How to use Dart class constructors
weight: 31
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642413
emoji: 🐣
video_length: 1:39
---

## Constructor Basics

The `this` keyword is used to refer to the current instance of a class and is optional unless there is a name collision. 

{{< file "dart" "constructors.dart" >}}
```dart
class Rectangle {
  final int width;
  final int height;
  String? name;
  late final int area;

  Rectangle(this.width, this.height, [this.name]) {
    area = width * height;
  }
}
```


## Named Parameters

In Flutter, all widgets used named parameters. 

{{< file "dart" "constructors.dart" >}}
```dart
class Circle {
  const Circle({required int radius, String? name});
}

const cir = Circle(radius: 50, name: 'foo');
```

## Named Constructors

It is also possible for a class to have multiple named constructors. This is useful when different datatypes can be used to initialize the same class.

{{< file "dart" "constructors.dart" >}}
```dart
class Point {
  double lat = 0;
  double lng = 0;

  // Named constructor
  Point.fromMap(Map data) {
    lat = data['lat'];
    lng = data['lng'];
  }

  Point.fromList(List data) {
    lat = data[0];
    lng = data[1];
  }
}

var p1 = Point.fromMap({'lat': 23, 'lng': 50});
var p2 = Point.fromList([23, 50]);
```