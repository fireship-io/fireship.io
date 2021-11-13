---
title: Installation and Setup
description: Install Flutter and native IDEs
weight: 3
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 👶
vimeo: 336023165
video_length: 5:37
---

## Tasks

1. Install Flutter and run `flutter doctor`.
1. Add Flutter to your Path
1. Download Android Studio and configure an Emulator.
1. Download XCode (MacOS)

## Dependencies

The current version of this course uses the following dependencies. For the most reliable results, you should use the same versions.

Flutter & Firebase regularly update these packages and later versions may break the code in this course, so update them at your own risk. 

{{< file "dart" "pubspec.yaml" >}}
```yaml
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^0.1.2

  firebase_core: 0.4.4+3
  firebase_analytics: 5.0.11

  cloud_firestore: 0.13.4+2

  firebase_auth: 0.15.5+3
  google_sign_in: 4.4.1
  apple_sign_in: 0.1.0

  rxdart: 0.23.1
  provider: 4.0.5
  font_awesome_flutter: 8.8.1
```

