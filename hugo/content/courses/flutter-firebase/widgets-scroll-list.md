---
title: Scroll
description: ListView and GridView for scrollable widgets
weight: 15
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🐦
vimeo: 336025503
video_length: 3:04
---

## Example Code

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       body: ListView(
         scrollDirection: Axis.horizontal,
         children: _cards(),
       )
     ),
   );
 }

 List<Widget> _cards() {
   return [1,2,3,4,5,6,7,8,9].map((v) => Container(
       color: Colors.blue,
       margin: EdgeInsets.all(20),
       height: 100,
       child: Text('$v'),
     )
   ).toList();
 }

{{< /highlight >}}