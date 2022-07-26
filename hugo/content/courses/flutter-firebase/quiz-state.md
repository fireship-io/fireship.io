---
title: State Management with Provider
description: Use Provider to separte state from the parent widget
weight: 60
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: ✨
vimeo: 645855420
video_length: 4:09
chapter_start: Quiz UI
---

## Quiz State

Define a class that contains the data required by the UI. Add getters and setters for the data, making sure to call `notifyListeners()` when the data changes.

{{< file "flutter" "quiz/quiz_state.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:quizapp/services/models.dart';

class QuizState with ChangeNotifier {
  double _progress = 0;
  Option? _selected;

  double get progress => _progress;
  Option? get selected => _selected;

  set progress(double newValue) {
    _progress = newValue;
    notifyListeners();
  }

  set selected(Option? newValue) {
    _selected = newValue;
    notifyListeners();
  }
}
```

## Provider

Now that we have our state, we need to make it available to widgets that depend on it. At this point, we also use a `FutureBuilder` to fetch the quiz data from Firestore.

{{< file "flutter" "quiz/quiz_provider.dart" >}} 

{{< file "flutter" "quiz.dart" >}}
```dart
class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key, required this.quizId});  
  final String quizId;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => QuizState(),
      child: FutureBuilder<Quiz>(
        future: FirestoreService().getQuiz(quizId),
        builder: (context, snapshot) {
          var state = Provider.of<QuizState>(context);

          if (!snapshot.hasData || snapshot.hasError) {
            return Loader();
          } else {
            var quiz = snapshot.data!;

            return Scaffold();
          }
        },
      ),
    );
  }
}
```
