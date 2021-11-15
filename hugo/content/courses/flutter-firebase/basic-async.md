---
title: Async Widgets
description: Use StreamBuilder & FutureBuilder to handle async data
weight: 11
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 👶
vimeo: 
video_length: 4:55
---

## Example of StreamBuilder

{{< file "flutter" "main.dart" >}}
```dart
class DemoApp extends StatelessWidget {
  const DemoApp({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<int>(
      stream: Stream.fromIterable([1,2,3,4]),
      builder: (context, snapshot) {
        var count = snapshot.data;

        // Add UI here

        return Text('$count');
      },
    );
  }
}
```