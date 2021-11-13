---
title: Loading Indicator
description: Show a loading indicator or loading screen
weight: 26
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 💫
vimeo: 407359265
video_length: 1:02
---

Use the `Loader` when an individual UI element is loading, or `LoadingScreen` when an entire screen is loading. 

{{< file "dart" "loader.dart" >}}
```dart
import 'package:flutter/material.dart';


class Loader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      height: 250,
      child: CircularProgressIndicator(),
    );
  }
}

class LoadingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Center(
        child: Loader(),
      ),
    );
  }
}
```