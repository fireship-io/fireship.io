---
title: Map
description: Use the dictionary-like Dart Map to manage key-value pairs
weight: 24
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629644781
emoji: 📙
video_length: 1:28
---

## Basic Maps

{{< file "dart" "maps.dart" >}}
```dart
  Map<String, dynamic> book = {
    'title': 'Moby Dick',
    'author': 'Herman Melville',
    'pages': 752,
  };

  book['title'];
  book['published'] = 1851;
```

## Loop over a Map

{{< file "dart" "maps.dart" >}}
```dart
  book.keys;
  book.values;
  book.values.toList();

  for (MapEntry b in book.entries) {
    print('Key ${b.key}, Value ${b.value}');
  }

  book.forEach((k, v) => print("Key : $k, Value : $v"));
```