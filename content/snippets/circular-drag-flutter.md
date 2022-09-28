---
title: Handle Radial Pan Events in Flutter
lastmod: 2019-12-02T09:19:58-07:00
publishdate: 2019-12-02T09:19:58-07:00
author: Jeff Delaney
draft: false
description: Calculate the rotation of a wheel in Flutter from user pan gestures.
tags: 
    - flutter
    - ui
    - dart

# youtube: 
github: https://github.com/fireship-io/216-flutter-ipod/blob/master/lib/wheel.dart
# disable_toc: true
# disable_qna: true
type: lessons

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

A UI element that is not currently supported out of the box with Flutter is a click wheel, or knob, or radial control, rotatable circle, or whatever you want to call it. The following snippet demonstrates how to take a circular container, then detect which direction the user is rotating (clockwise or counter clockwise) and its velocity. 

{{< vimeo 376862979 >}}

Full [wheel demo source code](https://github.com/fireship-io/216-flutter-ipod/blob/master/lib/wheel.dart). 

## Flutter Circular Pan Wheel

### Detect Pan Gestures
 
Use a [GestureDetector](https://api.flutter.dev/flutter/widgets/GestureDetector-class.html) to wrap a container with a BoxShape.circle. Every pan event on the circle will emit data with information about the user's movement. 

{{< file "dart" "main.dart" >}}
```dart
int radius = 250;

GestureDetector(
    onPanUpdate: _panHandler,
    child: Container(
        height: radius * 2,
        width: radius * 2,
        decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.red,
        ),
    )
)
```

### Calculate Rotational Movement

Think of a wheel as four separate quadrants like topRight, bottomRight, bottomLeft, and topLeft. For each quadrant, then are four different directions the user can move: up, down, left, or right. We can calculate the change in the user's movement by looking at the *delta*, then adjust it based on the quadrant in which it occurred. 

The final value is `rotationalChange`. If the value is positive, the wheel is rotating clockwise, if negative it is moving counterclockwise. Use this value to change something meaningful in the UI. 

{{< file "dart" "main.dart" >}}
```dart
  void _panHandler(DragUpdateDetails d) {

    /// Pan location on the wheel
    bool onTop = d.localPosition.dy <= radius;
    bool onLeftSide = d.localPosition.dx <= radius;
    bool onRightSide = !onLeftSide;
    bool onBottom = !onTop;

    /// Pan movements
    bool panUp = d.delta.dy <= 0.0;
    bool panLeft = d.delta.dx <= 0.0;
    bool panRight = !panLeft;
    bool panDown = !panUp;

    /// Absoulte change on axis
    double yChange = d.delta.dy.abs();
    double xChange = d.delta.dx.abs();

    /// Directional change on wheel
    double verticalRotation = (onRightSide && panDown) || (onLeftSide && panUp)
        ? yChange
        : yChange * -1;

    double horizontalRotation = (onTop && panRight) || (onBottom && panLeft) 
        ? xChange 
        : xChange * -1;

    // Total computed change
    double rotationalChange = verticalRotation + horizontalRotation; 

    bool movingClockwise = rotationalChange > 0;
    bool movingCounterClockwise = rotationalChange < 0;

    // Now do something interesting with these computations!
  }
```

### Add Velocity

Adding velocity will make this UI element feel more natural if it controls a scrollable view. The faster the user pans, the higher the velocity. Simply multiply the rotational change by the delta distance. 

{{< file "dart" "main.dart" >}}
```dart
double rotationalChange = (horz + vert) * d.delta.distance;
```
