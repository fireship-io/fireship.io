---
title: Text
description: Working with the Text widget
weight: 11
lastmod: 2019-07-13T10:13:30-04:00
draft: false
emoji: 🐦
vimeo: 336025807
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
         child: Row(
           children: <Widget>[
             Expanded(
               child: Container(
                 height: 100,
                 child: Text(
                   'Hello World this is too long',
                   overflow: TextOverflow.ellipsis,
                   style: TextStyle(
                     fontSize: 50,
                     fontWeight: FontWeight.bold,
                   ),
                 ),
               ),
             ),
           ],
         ),
       ),
     ),
   );
 }
}

{{< /highlight >}}