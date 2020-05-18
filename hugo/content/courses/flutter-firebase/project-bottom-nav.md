---
title: Bottom Navigation Bar
description: Create a shared bottom navigation bar
weight: 23
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🍫
vimeo: 407358897
video_length: 4:09
---

## About Screen

Create a basic screen.

{{< file "dart" "about.dart" >}}
```dart
import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('about'),
        backgroundColor: Colors.blue,
      ),
      body: Center(
        child: Text('About this app...'),
      ),
    );
  }
}
```

## Export the Widgets

You can export all your screens together using the following pattern:

{{< file "dart" "screens.dart" >}}
```dart
export 'login.dart';
export 'topics.dart';
export 'quiz.dart';
export 'profile.dart';
export 'about.dart';
```

You can then use them in other project files like so: `import 'screens/screens.dart';
`

## Bottom Navigation

Use a `BottomNavigationBar` to move between screens. 

{{< file "dart" "bottom_nav.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AppBottomNav extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: [
        BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.graduationCap, size: 20),
            title: Text('Topics')),
        BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.bolt, size: 20),
            title: Text('About')),
        BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.userCircle, size: 20),
            title: Text('Profile')),
      ].toList(),
      fixedColor: Colors.deepPurple[200],
      onTap: (int idx) {
        switch (idx) {
          case 0:
            // do nuttin
            break;
          case 1:
            Navigator.pushNamed(context, '/about');
            break;
          case 2:
            Navigator.pushNamed(context, '/profile');
            break;
        }
      },
    );
  }
}
```

Put it to use in a Scaffold. 

```dart
import 'package:quizapp/shared/bottom_nav.dart';

// example usage
Scaffold(
    bottomNavigationBar: AppBottomNav(),
)
```
