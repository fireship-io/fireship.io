---
title: Dynamic Screens
description: Use a PageView to navigate through a series of questions.
weight: 61
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 📃
vimeo: 645855281
video_length: 3:47
---

## Page View

In the quiz screen, update the Scaffold to use a PageView. 

{{< file "flutter" "quiz.dart" >}}
```dart
    return Scaffold(
        appBar: AppBar(
        title: AnimatedProgressbar(value: state.progress),
        leading: IconButton(
            icon: const Icon(FontAwesomeIcons.xmark),
            onPressed: () => Navigator.pop(context),
        ),
        ),
        body: PageView.builder(
        physics: const NeverScrollableScrollPhysics(),
        scrollDirection: Axis.vertical,
        controller: state.controller,
        onPageChanged: (int idx) =>
            state.progress = (idx / (quiz.questions.length + 1)),
        itemBuilder: (BuildContext context, int idx) {
            if (idx == 0) {
            return StartPage(quiz: quiz);
            } else if (idx == quiz.questions.length + 1) {
            return CongratsPage(quiz: quiz);
            } else {
            return QuestionPage(question: quiz.questions[idx - 1]);
            }
        },
    ),
);
```

## Update Quiz State

Add the page controller to the Quiz state so that it can be shared across multiple children easily. 

{{< file "flutter" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:quizapp/services/models.dart';

class QuizState with ChangeNotifier {

  final PageController controller = PageController();


  void nextPage() async {
    await controller.nextPage(
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeOut,
    );
  }
}

```

## Dynamic Pages

The PageView will generate one of three possible pages:

- StartPage
- QuestionPage
- CongratsPage

View the [full source code](https://github.com/fireship-io/flutter-firebase-quizapp-course/tree/master/lib) to review the code for these pages. 

