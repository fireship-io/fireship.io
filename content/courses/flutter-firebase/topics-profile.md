---
title: User Profile
description: Create a profile page with the total quiz score
weight: 54
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🤹‍♀️
vimeo: 645880283
video_length: 1:33
---

## Profile Page

Customize your profile screen with the total quiz score.

{{< file "flutter" "profile.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:quizapp/services/services.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {

    var report = Provider.of<Report>(context);
    var user = AuthService().user;

    if (user != null) {
     // add your UI here
    } 
  }
}

```