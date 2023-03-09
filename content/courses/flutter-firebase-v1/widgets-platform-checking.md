---
title: Platform Checking
description: Material vs Cupertino Widgets
weight: 7
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐦
vimeo: 336025307
video_length: 2:18
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'dart:io' show Platform;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       body: Center(
         child: Platform.isAndroid
             ? Switch(value: true, onChanged: (v) => null)
             : CupertinoSwitch(value: true, onChanged: (v) => null),
       ),
     ),
   );
 }
}
```
