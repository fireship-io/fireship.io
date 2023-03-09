---
title: Gestures
description: Detect user interaction within your app
weight: 12
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐦
vimeo: 336025234
video_length: 2:13
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
//...
         child: GestureDetector(
           onTapDown: (details) => print(details.globalPosition.dx),
           child: Container(
             width: 100,
             height: 100,
             color: Colors.red
           ),
         ),
//...
```