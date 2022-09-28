---
title: Flutter Create
description: Create a new flutter app with a bundle ID & dependencies
weight: 4
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🏁
vimeo: 645766000
video_length: 3:06
---

## Create an App

Create an app with a bundle ID. Choose any bundle ID you'd like, following the reverse domain naming convention.

{{< file "terminal" "command line" >}}
```bash
flutter create --org io.fireship myapp
```

## Dependencies

The current version of this course uses the following dependencies. For the most reliable results, you should use the same versions.

Flutter & Firebase regularly update these packages and later versions may break the code in this course, so update them at your own risk. 

{{< file "flutter" "pubspec.yaml" >}}
```yaml
name: REPLACE_WITH_YOUR_APP_NAME
description: A new Flutter project.
publish_to: 'none'


version: 1.0.0+1

environment:
  sdk: ">=2.12.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.5
  # firebase_core: 1.18.0
  # cloud_firestore: 3.1.18
  # firebase_auth: 3.3.20
  # google_sign_in: 5.3.3
  # sign_in_with_apple: 4.0.0
  # crypto: 3.0.1
  # font_awesome_flutter: 10.1.0
  # google_fonts: 3.0.1
  # provider: 6.0.3
  # rxdart: 0.27.4
  # json_annotation: 4.5.0

dev_dependencies:
  flutter_test:
    sdk: flutter

  flutter_lints: ^1.0.0

  # build_runner: 2.1.11
  # json_serializable: 6.2.0

flutter:
  uses-material-design: true

  # To add assets to your application, add an assets section, like this:
  # assets:
  #   - assets/
  #   - assets/covers/
  #   - assets/congrats.gif
```