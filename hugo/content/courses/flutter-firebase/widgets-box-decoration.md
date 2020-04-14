---
title: Box Decoration
description: Make containers look awesome
weight: 10
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 🐦
vimeo: 336025062
video_length: 2:09
---

## Example Code

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: Scaffold(
       body: Center(
         child: Container(
           alignment: Alignment.center,
           decoration: BoxDecoration(
             color: Colors.blue,
             border: Border.all(width: 5),
             boxShadow: [
               BoxShadow(offset: Offset(40, 40), color: Colors.pink),
               BoxShadow(offset: Offset(20, 20), color: Colors.yellow),
             ],
             gradient: RadialGradient(colors: [Colors.yellow, Colors.pink])
           ),
         )
       ),
     ),
   );
 }
}
{{< /highlight >}}