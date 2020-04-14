---
title: Routing & Firebase Analytics
description: Configure Flutter screen routing for Firebase Analytics
weight: 22
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🚆
vimeo: 407358481
video_length: 2:03
---

## Firebase Analytics and Routing

Add Firebase Analytics to keep track of the user's navigation between screens. 

{{< file "dart" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:firebase_analytics/observer.dart';
import 'package:firebase_analytics/firebase_analytics.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        // Firebase Analytics
        navigatorObservers: [
          FirebaseAnalyticsObserver(analytics: FirebaseAnalytics()),
        ],

        routes: {
          '/': (context) => LoginScreen(),
          '/topics': (context) => TopicsScreen(),
          '/profile': (context) => ProfileScreen(),
          '/about': (context) => AboutScreen(),
        },

        // Theme
        theme: ThemeData(
            // your customizations here
            brightness: Brightness.dark,
          ),
        ),
      );
  }
}

```