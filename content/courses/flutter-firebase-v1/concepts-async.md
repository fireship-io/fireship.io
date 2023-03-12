---
title: Async Widgets
description: Handle Streams and Futures
weight: 19
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🌊
vimeo: 336145707
video_length: 4:25
---

## Example Code

{{< file "dart" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:async';



void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return MaterialApp(
     home: HomeScreen(),
   );
 }
}

class HomeScreen extends StatelessWidget {

 final Firestore db = Firestore.instance;

 @override
 Widget build(BuildContext context) {
   return Scaffold(
     appBar: AppBar(title: Text('Home')),
     body: Center(
       child: StreamBuilder<DocumentSnapshot>(
         stream: db.collection('users').document('mB6sGaFBczfIW50DJyvGDcQWOvW2').snapshots(),
         builder: (context, snapshot) {
          
           if (snapshot.hasData) {

             var data = snapshot.data.data;

             return Column(
               crossAxisAlignment: CrossAxisAlignment.center,
               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
               children: <Widget>[

                 Image.network(data['photoURL']),
                 Text(data['username'], style: Theme.of(context).textTheme.display1,),


               ],
             );
           } else {
             return Container();
           }

          
         }
       ),
     )
   );
 }
}
```
