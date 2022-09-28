---
title: Themes
description: Customize the Theme of the app
weight: 24
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🎨
vimeo: 645766959
video_length: 2:14
---

Create a file named `theme.dart` in the root of the project

## Example Code

{{< file "flutter" "theme.dart" >}}
```dart
import 'package:flutter/material.dart';

var appTheme = ThemeData(
  bottomAppBarTheme: const BottomAppBarTheme(
    color: Colors.black87,
  ),
  brightness: Brightness.dark,
  textTheme: const TextTheme(
    bodyText1: TextStyle(fontSize: 18),
    bodyText2: TextStyle(fontSize: 16),
    button: TextStyle(
      letterSpacing: 1.5,
      fontWeight: FontWeight.bold,
    ),
    headline1: TextStyle(
      fontWeight: FontWeight.bold,
    ),
    subtitle1: TextStyle(
      color: Colors.grey,
    ),
  ),
  buttonTheme: const ButtonThemeData(),
);
```

Apply it to the `MaterialApp` in the `main.dart` file

{{< file "dart" "main.dart" >}}
```dart
import 'package:quizapp/theme.dart';

// ...

  return MaterialApp(
    theme: appTheme,
  );
```