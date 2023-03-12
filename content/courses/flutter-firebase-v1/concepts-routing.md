---
title: Navigation
description: Screen routing with a navigation stack
weight: 18
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🚎
vimeo: 336145347
video_length: 3:57
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(

    
     routes: {
       '/home': (context) => HomeScreen(),
       '/slideshow': (context) => SlideshowScreen()
     },

     home: HomeScreen(),
   );
 }
}

class HomeScreen extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return Scaffold(
     appBar: AppBar(title: Text('Home'), backgroundColor: Colors.red,),
     body: Center(
       child: Row(
         mainAxisAlignment: MainAxisAlignment.center,
         children: <Widget>[
           FlatButton(child: Text('push'), color: Colors.green, onPressed: () {

             // Navigator.push(
             //   context,
             //   MaterialPageRoute(builder: (context) => SlideshowScreen(name: 'Jeff'))
             // );


           //  Navigator.pushNamed(
           //     context,
           //     '/slideshow'
           //   );

             Navigator.pushNamed(
               context,
               '/slideshow'
             );

           },),

         ],
       ),
     ),
   );
 }
}
```
