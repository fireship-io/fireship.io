---
title: Flutter Basics Tutorial
description: The ultimate beginner's guide to learning Flutter
weight: 10
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🐣
vimeo: 
free: true
video_length: 12:05
chapter_start: Basic Training
youtube: 1xipg02Wu8s
---

Before we build our first app, let's get familiar with the core UI building blocks of [Flutter](https://flutter.dev/). This tutorial is a quick introduction to the basic building blocks of Flutter that we'll be using throughout the rest of the course. Play around with these code samples to get a feel for how UI design in Flutter works.

## Main Function

Flutter will inflate the widget passed to `runApp` into the root widget of the application.

{{< file "flutter" "main.dart" >}}
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}
```

## Stateless Widgets

[Stateless Widgets](https://api.flutter.dev/flutter/widgets/StatelessWidget-class.html) are building blocks for the UI. They do not depend on any internal state or data. They have a `build` method that returns a widget - Flutter will call this method whenever the UI needs to be rendered. 

{{< file "flutter" "main.dart" >}}
```dart
class MyApp extends StatelessWidget {
  const MyApp({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // return a widget here
  }
}
```

## Material App

The `MaterialApp` is the root of your Flutter app. It is required to work with many built-in widgets. It also allows you to configure global routes and themes. 

```dart
MaterialApp(
  theme: ThemeData(),
  routes: myRoutes,
  home: const MyHomePage(),
)
```

## Container

A `Container` is a is the most layout widget. It takes a single child and allows you to control alignment, padding, margin, width, height, and more. 

Tip: Use widgets like `SizedBox` and `Padding` instead of a container to make your code more readable.

```dart
Container(
  margin: EdgeInsets.all(10),
  padding: EdgeInsets.all(10),
  width: 100,
  height: 100,
  decoration: BoxDecoration(
    color: Colors.red,
    border: Border.all(
      color: Colors.black,
      width: 5,
    ),
  ),
  child: Text('Hello World'),
)
```

## Flex Layout

[Flex layout](https://flutter.dev/docs/development/ui/layout) allows you to arrange widgets in a `Row` or a `Column`. It's very similar to CSS flexbox where the parent widget controls the flow of its children. You can control individual children using the `Expanded` and `Flexible` widgets.

```dart
Col(
    children: [
        Expanded(
            child: Container(
            color: Colors.red,
            height: 100,
            ),
        ),
        Expanded(
            child: Container(
            color: Colors.green,
            height: 100,
            ),
        ),
    ]
)
```

## Stack

A `Stack` is a layout widget that allows you to position widgets on top of each other. The last item in the stack will be on top.

```dart
Stack(
    children: [
        Container(
            color: Colors.red,
            width: 100,
            height: 100,
        ),
        Icon(Icons.verified)
    ],
)
```

## List View

A `ListView` is a widget that displays a list of children in a scrollable view. You can control the scroll direction, physics, and more. 

Create a dynamic list of items using a `ListView.builder`, for example: 

```dart
import 'dart:math';

randomColor() {
  return Color((Random().nextDouble() * 0xFFFFFF).toInt()).withOpacity(1.0);
}

/// ...

ListView.builder(
    itemBuilder: (_, index) {
        return Container(
            color: randomColor(),
            width: 500,
            height: 500,
        );
    },
),
```

## Stateful Widgets

Stateful widgets provide widgets with state, which is just data that changes. Use the `setState()` method to update the state of a widget and it will be re-rendered with the latest data. 

```dart
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.add),
          onPressed: () {
            setState(() {
              count++;
            });
          },
        ),
        body: Center(
          child: Text('$count'),
        ),
      ),
    );
  }
}
```

## Basic Navigation

Use the `Navigator` to push and pop widgets on the [navigation stack](https://flutter.dev/docs/cookbook/navigation/navigation-basics). The `Scaffold` class will automatically handle the back button for you.

```dart
class HomeScreen extends StatelessWidget {
  const HomeScreen({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.green,
        title: const Text('Flutter is Fun!'),
      ),
      body: ElevatedButton(
        child: Text('Navigate'),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AboutScreen(),
            ),
          );
        },
      ),
    );
  }
}

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('about'),
      ),
    );
  }
}
```
