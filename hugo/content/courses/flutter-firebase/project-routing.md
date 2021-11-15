---
title: Routing
description: Configure named routes for each screen
weight: 23
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🚆
vimeo: 645766831
video_length: 3:32
---

## Routing Configuration

Create a file named _routes.dart_ in the _lib_ directory of your project.

{{< file "dart" "routes.dart" >}}
```dart
import 'package:quizapp/about/about.dart';
import 'package:quizapp/profile/profile.dart';
import 'package:quizapp/login/login.dart';
import 'package:quizapp/topics/topics.dart';
import 'package:quizapp/home/home.dart';

var appRoutes = {
  '/': (context) => const HomeScreen(),
  '/login': (context) => const LoginScreen(),
  '/topics': (context) => const TopicsScreen(),
  '/profile': (context) => const ProfileScreen(),
  '/about': (context) => const AboutScreen(),
};
```

Register the `appRoutes` with the `MaterialApp` in the `main.dart` file.

{{< file "dart" "main.dart" >}}
```dart
import 'package:quizapp/routes.dart';

// ...

  return MaterialApp(
    routes: appRoutes,
  );
```

## Basic Navigation between Scaffolds

Push a new screen on to the stack. 

{{< file "dart" "home.dart" >}}
```dart
class HomeScreen extends StatelessWidget {
  const HomeScreen({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          child: Text('about'),
          onPressed: () => Navigator.pushNamed(context, '/about'),
        ),
      ),
    );
  }
```

The `appBar` will automatically have a back button. 

{{< file "dart" "about.dart" >}}
```dart
class AboutScreen extends StatelessWidget {
  const AboutScreen({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      
    );
  }
}
```