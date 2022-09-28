---
title: Flutter Drag and Drop Basics
lastmod: 2019-04-30T11:45:14-07:00
publishdate: 2019-04-30T11:45:14-07:00
author: Jeff Delaney
draft: false
description: Learn how to create an interactive drag-and-drop UI in Flutter. 
tags: 
    - flutter

youtube: KOh6CkX-d6U
github: https://github.com/fireship-io/183-flutter-draggable-game
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---



The following lesson will teach you how to build a simple drag-and-drop UI with the [Draggable](https://docs.flutter.io/flutter/widgets/Draggable-class.html) and [DragTarget](https://docs.flutter.io/flutter/widgets/DragTarget-class.html) widgets. The demo app is a kid's game (ages 2 to 4) that requires the user to drag a fruit emoji 🍋 from the left column to the matching color on the right. If successfully dropped it will mark that item complete ✅ and the score will increase by one. The user can also reset the game at any time by pressing on the floating action button. 


{{< vimeo 333404934 >}}

## Initial Setup

In most cases, you will need your widgets organized within a `StatefulWidget` to render changes to the UI when certain drag/drop events take place. 

{{< file "dart" "main.dart" >}}
```dart
class DragScreen extends StatefulWidget {
  DragScreen({Key key}) : super(key: key);
  createState() => ColorGameState();
}

class DragScreenState extends State<DragScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold( 
        body: Row(
        children: [
          Column(
              // draggable widgets here
          ),
          Column(
            // droppable widgets here
          )
        ],
      ),
    );
  }
}
```

## How to Drag Widgets

### Draggble
There are three different visual states to consider when building a draggable widget. 

1. *child* - This is the child that is initially present. 
2. *childWhenDragging* - This is the widget that gets left behind after user starts dragging. 
3. *feedback* - This is the widget that moves or sticks to the user's finger. It may be identical to the child, or you may want to add some extra shadow to increase the realism of movement. 

{{< figure src="img/draggable-parts.png" caption="The different parts of a Draggable widget after the user starts dragging"  >}}

{{< file "dart" "main.dart" >}}
```dart
Draggable(
    data: // optional data to send to the drag target in next step,
    child: // widget
    feedback: // widget
    childWhenDragging: // widget
);
```




## How to Drop Widgets

### DragTarget

Now that we have a Draggable widget, we need to give it a "drop zone" using the *DragTarget* widget. It provides a builder function that gives you access to both the incoming and rejected data. 

There are several functions that can be used to listen to the various drag/drop events:

- *builder* constructs the UI for the DragTarget. 
- *onWillAccept* fires when the user starts hovering, it must return a boolean to decide whether or not the user can drop the widget here.
- *onAccept* fires when the user drops and onWillAccept returns `true`.
- *onLeave* fires if the user leaves without dropping or onWillAcccept returns `false`;


{{< file "dart" "main.dart" >}}
```dart
// Prop on StatefulWidget
bool successfulDrop;

// Used inside build method
DragTarget<String>(
      builder: (BuildContext context, List<String> incoming, List rejected) {
        if (successfulDrop == true) {
            return Text('Dropped!')
        } else {
          return Text('Empty dropzone');
        }
      },
 
      onWillAccept: (data) => data == 'GOOD',

      onAccept: (data) {
        setState(() {
          successfulDrop = true;
        });
      },

      onLeave: (data) {

      },
    );
```
