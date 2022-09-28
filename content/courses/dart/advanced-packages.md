---
title: Packages
description: Deal with name conflicts when importing packages
weight: 40
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642157
emoji: 📦
video_length: 1:27
chapter_start: Advanced Dart
---

## Namespace packages

The easiest way to deal with name conflicts is to use a namespace package.

{{< file "dart" "packages.dart" >}}
```dart
import 'somewhere.dart' as External;
```

## Exclude code from a package

Exclude code from a package with the `hide` keyword.

{{< file "dart" "packages.dart" >}}
```dart
import 'somewhere.dart' hide Circle;
```

## Isolate code from a package

Import individual classes from a package with the `show` keyword.

{{< file "dart" "packages.dart" >}}
```dart
import 'somewhere.dart' show Rectangle;
```