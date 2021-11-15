---
title: Stream Provider
description: Listen to a realtime Firestore document globally with Provider
weight: 52
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 👂
vimeo: 645859429
video_length: 2:16
---

## Stream Provider

Update the `main.dart` file to wrap the `MaterialApp` with a `StreamProvider` widget. It will listen to the Firestore document and update the widget tree when the document's data changes.

{{< file "flutter" "main.dart" >}}
```dart
// ...
import 'package:provider/provider.dart';
import 'package:quizapp/services/services.dart';

// ...

    return StreamProvider(
            create: (_) => FirestoreService().streamReport(),
            initialData: Report(),
            child: MaterialApp(
                // ..
            ),
          );
```