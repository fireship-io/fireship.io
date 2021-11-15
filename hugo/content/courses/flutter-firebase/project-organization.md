---
title: Project Organization
description: How to structure a complex Flutter app
weight: 22
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🍱
vimeo: 645766751
video_length: 3:19
---

## Task 

Create a directory and file for each screen in the app. 

- about
- home
- login
- profile
- quiz
- topics

Provide each file with a Stateless Widget. For example:

{{< file "flutter" "home.dart" >}}
```dart
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      
    );
  }
}
```

## Project Structure

- `login/`, `quiz/`, etc. contains the app's main UI features or screens.
- `shared/` contains the app's shared UI, like navigation menus and loading indicators. 
- `services/` contains the app's shared business logic, like user auth and database code.