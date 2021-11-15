---
title: Google Fonts
description: Add and hot reload any font from Google Fonts
weight: 25
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🗛
vimeo: 645766700
video_length: 0:45
---

Add the Google Fonts package to your `pubspec.yaml` file.

# Customize the Global Font

{{< file "flutter" "theme.dart" >}}
```dart
import 'package:google_fonts/google_fonts.dart';

var appTheme = ThemeData(
  fontFamily: GoogleFonts.nunito().fontFamily,
  // ...
);
```