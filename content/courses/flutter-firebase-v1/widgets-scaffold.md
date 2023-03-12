---
title: Material App & Scaffold
description: High-level UI widgets
weight: 8
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐦
vimeo: 336025384
video_length: 2:35
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       appBar: AppBar(title: Text('My Cool App'),),
       body: Center(child: Icon(Icons.cake),),
       floatingActionButton: FloatingActionButton(onPressed: () {}),
       drawer: Drawer(),
       bottomNavigationBar: BottomNavigationBar(items: [
          BottomNavigationBarItem(label: 'foo', icon: Icon(Icons.call)),
          BottomNavigationBarItem(label: 'bar', icon: Icon(Icons.cached))
       ]),
     ),
   );
 }
}
```
