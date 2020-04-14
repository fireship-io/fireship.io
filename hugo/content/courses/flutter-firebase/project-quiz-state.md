---
title: Quiz State Management
description: Advanced usage of the Provider package
weight: 53
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: ✔️
vimeo: 336425577
video_length: 2:08
---

## State Management with Provider

Manage the state of the quiz with the Provider `ChangeNotifier`. 

{{< file "dart" "main.dart" >}}
```dart
import '../services/services.dart';
import 'package:provider/provider.dart';

// Shared Data
class QuizState with ChangeNotifier {
  double _progress = 0;
  Option _selected;

  final PageController controller = PageController();

  get progress => _progress;
  get selected => _selected;

  set progress(double newValue) {
    _progress = newValue;
    notifyListeners();
  }

  set selected(Option newValue) {
    _selected = newValue;
    notifyListeners();
  }

  void nextPage() async {
    await controller.nextPage(
      duration: Duration(milliseconds: 500),
      curve: Curves.easeOut,
    );
  }
}
```