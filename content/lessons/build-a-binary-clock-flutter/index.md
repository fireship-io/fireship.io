---
title: Build a Binary Clock with Flutter
lastmod: 2019-11-21T12:40:31-07:00
publishdate: 2019-11-21T12:40:31-07:00
author: Jeff Delaney
draft: false
description: "Learn how to build a binary clock with Flutter for the #FlutterClock competition"
tags: 
    - flutter
    - compsci

youtube: VkTj1U_exwA
github: https://github.com/fireship-io/214-flutter-binary-clock
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---


The Flutter Clock [Contest](https://flutter.dev/clock) is currently running with a submission deadline of Jan 20th, 2020. The following lesson will teach you how to build a basic clock with Flutter. 

## Binary Clock Basics

We are building the [binary clock](https://en.wikipedia.org/wiki/Binary_clock) shown in the demo video below. Notice how the clock ticks once-per-second and updates the highlighted boxes in the UI. The actual time is shown in big plain digits at the bottom, with the binary value for each number under it. 

Each **column** represents a digit of time in `hh:mm:ss` format. Each **row** represents a binary value of 1, 2, 4, or 8 (or 0 if no boxes are colored). You calculate each digit in regular time by adding all the values (or bits) in a column.  


<div class="vid-center">
{{< vimeo 374741877 >}}
</div>

## Initial Setup


### Create a Flutter App

Get started by creating a new Flutter app by running `flutter create my_awesome_clock`. The initial app will import a few dependencies and wrap the `Clock` widget inside of Scaffold. 

{{< file "dart" "main.dart" >}}
```dart
import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show SystemChrome, DeviceOrientation;
import 'package:intl/intl.dart' show DateFormat;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Clock(),
      ),
    );
  }
}

```


### Force the App to Run in Landscape Mode

The Flutter Clock contest requires the app to run in landscape mode. You can tell Flutter to whitelist specific device orientations with the SystemChrome class. In our case, we will allow `landscapeLeft` or `landscapeRight` by updating the main function. 

{{< file "dart" "main.dart" >}}
```dart
void main() {
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeRight,
    DeviceOrientation.landscapeLeft,
  ]);
  runApp(MyApp());
}
```

## Working with Time

### Make the Clock Tick

The only state that ever changes on the clock is the time, which should update once-per-second. Simply create a [DateTime](https://api.dartlang.org/stable/2.6.1/dart-core/DateTime-class.html) property and update it every second with a periodic timer. 

{{< file "dart" "main.dart" >}}
```dart
class Clock extends StatefulWidget {
  Clock({Key key}) : super(key: key);

  @override
  _ClockState createState() => _ClockState();
}

class _ClockState extends State<Clock> {

  DateTime _now = DateTime.now(); // or BinaryTime see next step

  // Tick the clock
  @override
  void initState() {
    Timer.periodic(Duration(seconds: 1), (v) {
      setState(() {
        _now = DateTime.now(); // or BinaryTime see next step
      });
    });
    
    super.initState();
  }

  
}

```

### Converting Integers to Binary Strings

A clock displays time on a format that looks like `14:23:55` or `hh:mm:ss`. In order to keep business logic out of the widget, a custom class called `BinaryTime` provides the values we need for the main UI. 


{{< file "dart" "main.dart" >}}
```dart
/// Utility class to access values as binary integers
class BinaryTime {
  List<String> binaryIntegers;

  BinaryTime() {
    DateTime now = DateTime.now();
    String hhmmss = DateFormat("Hms").format(now).replaceAll(':', '');

    binaryIntegers = hhmmss
        .split('')
        .map((str) => int.parse(str).toRadixString(2).padLeft(4, '0'))
        .toList();
  }

  get hourTens => binaryIntegers[0];
  get hourOnes => binaryIntegers[1];
  get minuteTens => binaryIntegers[2];
  get minuteOnes => binaryIntegers[3];
  get secondTens => binaryIntegers[4];
  get secondOnes => binaryIntegers[5];
}
```


## Clock UI

### Columns for Each Clock Digit

Each column in the binary clock represents a digit in normal base-10 time. The Clock widget implements six fixed columns for each digit. 

{{< file "dart" "main.dart" >}}
```dart

class Clock extends StatefulWidget {
  Clock({Key key}) : super(key: key);

  @override
  _ClockState createState() => _ClockState();
}

class _ClockState extends State<Clock> {
  BinaryTime _now = BinaryTime();

  // Tick the clock
  @override
  void initState() {
    Timer.periodic(Duration(seconds: 1), (v) {
      setState(() {
        _now = BinaryTime();
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(50),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Columns for the clock
          ClockColumn(
            binaryInteger: _now.hourTens,
            title: 'H',
            color: Colors.blue,
            rows: 2,
          ),
          ClockColumn(
            binaryInteger: _now.hourOnes,
            title: 'h',
            color: Colors.lightBlue,
          ),
          ClockColumn(
            binaryInteger: _now.minuteTens,
            title: 'M',
            color: Colors.green,
            rows: 3,
          ),
          ClockColumn(
            binaryInteger: _now.minuteOnes,
            title: 'm',
            color: Colors.lightGreen,
          ),
          ClockColumn(
            binaryInteger: _now.secondTens,
            title: 'S',
            color: Colors.pink,
            rows: 3,
          ),
          ClockColumn(
            binaryInteger: _now.secondOnes,
            title: 's',
            color: Colors.pinkAccent,
          ),
        ],
      ),
    );
  }
}
```



### Individual Clock Column

At this point, each column must be split into four cells, where a cell represents a single bit. The code below loops over the digits in a binary integer, then colors them if the cell is active (has a value of 1).

{{< file "dart" "main.dart" >}}
```dart
/// Column to represent a binary integer.
class ClockColumn extends StatelessWidget {
  String binaryInteger;
  String title;
  Color color;
  int rows;
  List bits;

  ClockColumn({this.binaryInteger, this.title, this.color, this.rows = 4}) {
    bits = binaryInteger.split('');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        ...[
          Container(
            child: Text(
              title,
              style: Theme.of(context).textTheme.display1,
            ),
          )
        ],
        ...bits.asMap().entries.map((entry) {
          int idx = entry.key;
          String bit = entry.value;

          bool isActive = bit == '1';
          int binaryCellValue = pow(2, 3 - idx);

          return AnimatedContainer(
            duration: Duration(milliseconds: 475),
            curve: Curves.ease,
            height: 40,
            width: 30,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(5)),
              color: isActive
                  ? color
                  : idx < 4 - rows
                      ? Colors.white.withOpacity(0)
                      : Colors.black38,
            ),
            margin: EdgeInsets.all(4),
            child: Center(
              child: isActive
                  ? Text(
                      binaryCellValue.toString(),
                      style: TextStyle(
                        color: Colors.black.withOpacity(0.2),
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    )
                  : Container(),
            ),
          );
        }),
        ...[
          Text(
            int.parse(binaryInteger, radix: 2).toString(),
            style: TextStyle(fontSize: 30, color: color),
          ),
          Container(
            child: Text(
              binaryInteger,
              style: TextStyle(fontSize: 15, color: color),
            ),
          )
        ]
      ],
    );
  }
}


```