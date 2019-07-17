---
title: State Management
description: Handle shared Firebase data with Provider
weight: 20
lastmod: 2019-07-13T10:13:30-04:00
draft: false
emoji: 🌊
vimeo: 336144998
---

## Example Code

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:provider/provider.dart';

void main() => runApp(MyApp());

class UserModel {
 String name = 'Bob';
}

var stream = Stream.fromIterable([UserModel()]);

class MyApp extends StatelessWidget {
 @override
 Widget build(BuildContext context) {
   return StreamProvider<UserModel>.value(
     stream: stream,
     child: MaterialApp(
       home: HomeScreen(),
     ),
   );
 }
}

class HomeScreen extends StatelessWidget {
 final Firestore db = Firestore.instance;

 @override
 Widget build(BuildContext context) {

   var user = Provider.of<UserModel>(context);

   return Scaffold(
     body: Center(
       child: Text(user.name),
     ),
   );
 }
}

{{< /highlight >}}