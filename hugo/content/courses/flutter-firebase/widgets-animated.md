---
title: Animated Widgets
description: Use AnimatedContainer for automatic motion
weight: 16
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🐦
vimeo: 336198064
video_length: 2:42
---

## Example Code

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
import 'dart:math';


class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       body: Center(
         child: CoolBox(),
       )
     ),
   );
 }

}

class CoolBox extends StatefulWidget {
 const CoolBox({
   Key key,
 }) : super(key: key);

 @override
 _CoolBoxState createState() => _CoolBoxState();
}

class _CoolBoxState extends State<CoolBox> {

 double width = 100;
 double height = 100;
 Color color = Colors.green;

 @override
 Widget build(BuildContext context) {
   return AnimatedContainer(
     duration: Duration(seconds: 2),
     curve: Curves.bounceInOut,
     color: color,
     width: width,
     height: height,
     child: FlatButton(
       child: Text('Random'),
       onPressed: () {

         setState(() {
           width = Random().nextDouble() * 400;
           height = Random().nextDouble() * 400;

           int r = Random().nextInt(255);
           int b = Random().nextInt(255);
           int g = Random().nextInt(255);
           color = Color.fromRGBO(r, b, g, 1);
         });

        
       },
     )
   );
 }

 }

{{< /highlight >}}