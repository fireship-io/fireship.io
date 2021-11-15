---
title: Provider
description: Using Provider for state management
weight: 12
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🤝
vimeo: 645859684
video_length: 2:17
---

[Provider](https://pub.dev/packages/provider) is one of the most popular state management libraries in Flutter. It wraps `InheritedWidget` and provides an easy way to share data between widgets.

## 1. Define State

{{< file "flutter" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CounterState extends ChangeNotifier {

  int count = 0;

  updateCount() {
    count++;
    notifyListeners();
  }

}
```

## 2. Provide State

{{< file "flutter" "main.dart" >}}
```dart
class CounterApp extends StatelessWidget {
  const CounterApp({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {

    return ChangeNotifierProvider(
      create: (context) => CounterState(),
      child: const CountText(),
      
    );
  }
}
```

## 3. Read State

{{< file "flutter" "main.dart" >}}
```dart
class CountText extends StatelessWidget {
  const CountText({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {

    var state = context.watch<CounterState>();
    var state2 = Provider.of<CounterState>(context);

    return Text('${state.count}');
  }
}
```