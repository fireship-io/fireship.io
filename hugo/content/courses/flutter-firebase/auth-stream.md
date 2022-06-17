---
title: Auth Stream
description: Listen to the current Firebase user
weight: 30
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🌊
vimeo: 645765099
video_length: 3:18
chapter_start: User Authentication
---

# Auth Service

Create a file named `auth.dart` in the `services` directory.

{{< file "flutter" "services/auth.dart" >}}
```dart
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final userStream = FirebaseAuth.instance.authStateChanges();
  final user = FirebaseAuth.instance.currentUser;
}
```

## Listen to Current User

Use the home page to render a different set of UI elements based on the user's auth state in Firebase. If the user is signed in, show the topics screen. If the user is not signed in, show the login screen.

{{< file "flutter" "home.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:quizapp/login/login.dart';
import 'package:quizapp/shared/shared.dart';
import 'package:quizapp/topics/topics.dart';
import 'package:quizapp/services/auth.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: AuthService().userStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const LoadingScreen();
        } else if (snapshot.hasError) {
          return const Center(
            child: ErrorMessage(),
          );
        } else if (snapshot.hasData) {
          return const TopicsScreen();
        } else {
          return const LoginScreen();
        }
      },
    );
  }
}
```

## Login Screen

Update the login screen with a Scaffold. 

{{< file "flutter" "main.dart" >}}
```dart
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Login'),
        ),
    );
  }
}
```