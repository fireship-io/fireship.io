---
title: Stack
description: Position widgets on a Stack
weight: 14
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐦
vimeo: 336025721
video_length: 1:44
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       body: SizedBox.expand(
         child: Stack(
           children: <Widget>[
             Icon(
               Icons.camera,
               size: 100,
               color: Colors.red,
             ),
             Align(
                 alignment: Alignment.center,
                 child: Icon(
                   Icons.camera,
                   size: 100,
                   color: Colors.blue,
                 )),
             Positioned(
                 bottom: 20,
                 left: 100,
                 child: Icon(
                   Icons.camera,
                   size: 100,
                   color: Colors.green,
                 ))
           ],
         ),
       ),
     ),
   );
 }
}
```