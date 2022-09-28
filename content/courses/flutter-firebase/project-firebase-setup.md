---
title: Firebase setup
description: Add Firebase to Flutter for iOS & Android
weight: 21
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🔥
vimeo: 645766493
video_length: 4:30
---

## Tasks

1. Create a Firebase Project
1. Add an iOS app to your project
1. Add an Android app to your project
1. Use the keytool to generate an SHA Certificate. See my [Flutter Firebase SHA guide](https://fireship.io/snippets/install-flutterfire/#project-id-and-sha1-certificate) if you get stuck at this part. 

Also reference the latest [Official FlutterFire Setup Docs](https://firebase.flutter.dev/docs/overview)

## How to Get SHA-1 Certificate

Get the SHA1 certificate from the Android app.

{{< file "terminal" "command line" >}}
```bash
cd android
./gradlew signingReport
```

Copy the SHA-1 value and paste it into the Firebase Android App config.


## Default Firebase App

Paste this boilerplate into your `main.dart` file:

{{< file "flutter" "main.dart" >}}
```dart
import 'package:flutter/material.dart';

// Import the firebase_core plugin
import 'package:firebase_core/firebase_core.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(App());
}

/// We are using a StatefulWidget such that we only create the [Future] once,
/// no matter how many times our widget rebuild.
/// If we used a [StatelessWidget], in the event where [App] is rebuilt, that
/// would re-initialize FlutterFire and make our application re-enter loading state,
/// which is undesired.
class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  /// The future is part of the state of our widget. We should not call `initializeApp`
  /// directly inside [build].
  final Future<FirebaseApp> _initialization = Firebase.initializeApp();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      // Initialize FlutterFire:
      future: _initialization,
      builder: (context, snapshot) {
        // Check for errors
        if (snapshot.hasError) {
          return Text('error');
        }

        // Once complete, show your application
        if (snapshot.connectionState == ConnectionState.done) {
          return MaterialApp();
        }

        // Otherwise, show something whilst waiting for initialization to complete
        return Text('loading');
      },
    );
  }
}
```

## Bonus Video

Looking for a more advanced setup guide? Checkout my [FlutterFire Setup for Power Users](https://fireship.io/snippets/install-flutterfire/) guide for additional tools like Analytics and Crash Reporting.