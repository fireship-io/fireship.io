---
title: Control Flow
description: Review conditional statements, loops, and assertions
weight: 20
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629644501
youtube:
emoji: 🚈
video_length: 2:19
chapter_start: Syntax & Data Types
---

## Conditional Statements

{{< file "dart" "control-flow.dart" >}}
```dart
  String color = 'blue';

  if (color == 'blue') {
    //
  } else if (color == 'green') {
    //
  } else {
    // default
  }

  // One liner
  if (color == 'red') print('hello red!');
```

## Loops

{{< file "dart" "control-flow.dart" >}}
```dart
  for (var i = 0; i < 5; i++) {
    print(i);
    // break;
    // continue;
  }

  int i = 0;
  while (i < 5) {
    print(i);
    i++;
  }

  i = 0;
  do {
    print(i);
  } while (i < 5);

```

## Assertions

{{< file "dart" "control-flow.dart" >}}
```dart
  // Assert
  var txt = 'good';
  assert(txt != 'bad');
```
