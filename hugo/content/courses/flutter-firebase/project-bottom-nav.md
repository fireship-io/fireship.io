---
title: Bottom Navigation Bar
description: Create a shared bottom navigation bar
weight: 26
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🍫
vimeo: 645766428
video_length: 2:51
---

## Bottom Navigation

Use a `BottomNavigationBar` to move between screens in the `shared` folder.

{{< file "dart" "bottom_nav.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class BottomNavBar extends StatelessWidget {
  const BottomNavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const [
        BottomNavigationBarItem(
          icon: Icon(
            FontAwesomeIcons.graduationCap,
            size: 20,
          ),
          label: 'Topics',
        ),
        BottomNavigationBarItem(
          icon: Icon(
            FontAwesomeIcons.bolt,
            size: 20,
          ),
          label: 'About',
        ),
        BottomNavigationBarItem(
          icon: Icon(
            FontAwesomeIcons.circleUser,
            size: 20,
          ),
          label: 'Profile',
        ),
      ],
      fixedColor: Colors.deepPurple[200],
      onTap: (int idx) {
        switch (idx) {
          case 0:
            // do nothing
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
    bottomNavigationBar: BottomNavBar(),
)
```
