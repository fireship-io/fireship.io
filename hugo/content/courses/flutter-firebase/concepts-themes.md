---
title: Themes
description: Styles, Themes, and InheritedWidget
weight: 17
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🎨
vimeo: 336138357
chapter_start: Flutter Concepts
video_length: 2:30
---

## Example Code

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(

     theme: ThemeData(
       brightness: Brightness.light,
       primaryColor: Colors.lightGreen,
       textTheme: TextTheme(
         body1: TextStyle(color: Colors.red, fontSize: 30),
         headline: TextStyle(color: Colors.blue, fontSize: 70)
       )
     ),

     home: HomeScreen(),
   );
 }
}

class HomeScreen extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return Scaffold(
     appBar: AppBar(),
     body: Center(
       child: Text('Hello World', style: Theme.of(context).textTheme.headline,),
     )
   );
 }
}
{{< /highlight >}}