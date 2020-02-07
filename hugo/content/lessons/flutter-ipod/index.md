---
title: Build the Classic iPod UI in Flutter
publishdate: 2019-12-01T09:12:43-07:00
lastmod: 2019-12-02T09:12:43-07:00
author: Jeff Delaney
draft: false
description: Build a throwback iPod UI with a click wheel scroller using Flutter.
tags: 
    - flutter

youtube: A8dvbFby-s0
github: https://github.com/fireship-io/216-flutter-ipod
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

An awesome [tweet](https://t.co/zVk5YJj0rh) was making the rounds last week that recreates the [iPod Classic](https://en.wikipedia.org/wiki/IPod_Classic) UI with SwiftUI. It features a *click wheel* that scrolls through a list of items when rotated and makes a excellent Flutter UI challenge. 

<div class="flex-center"> 
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Turned my iPhone into an iPod Classic with Click Wheel and Cover Flow with <a href="https://twitter.com/hashtag/SwiftUI?src=hash&amp;ref_src=twsrc%5Etfw">#SwiftUI</a> <a href="https://t.co/zVk5YJj0rh">pic.twitter.com/zVk5YJj0rh</a></p>&mdash; Elvin (@elvin_not_11) <a href="https://twitter.com/elvin_not_11/status/1199717678908366854?ref_src=twsrc%5Etfw">November 27, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Creating an animated scrolling list with Flutter is a piece of cake, but calculating scroll direction/velocity from the pan events on the wheel is a bigger challenge. The following lesson demonstrates how to build UI elements with Flutter inspired by the iPod Classic. 

{{< box icon="bird" class="box" >}}
Checkout this [rotational pan widget](/snippets/circular-drag-flutter) snippet if you're looking for a Flutter widget that is aware of clockwise rotation, like a knob or radial dial. 
{{< /box >}}


## Demo

Notice how the user has three different ways to change the scroll position. 

1. Drag the PageView.
2. Tap the `>>` or `<<` icon buttons on the wheel.
3. Pan the wheel clockwise or counterclockwise. 

{{< vimeo 376306674 >}}

## Page View

The album covers are scrolled in a [PageView](https://api.flutter.dev/flutter/widgets/PageView-class.html) widget. Watch the video below for a quick introduction. 

<div class="vid vid-center">
{{< youtube J1gE9xvph-A >}}
</div>

### Controller

The control provides information about the current scroll position, as well as methods to change its position. We use a listener to react to every position change that occurs in the PageView. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class IPod extends StatefulWidget {
  IPod({Key key}) : super(key: key);

  @override
  _IPodState createState() => _IPodState();
}

class _IPodState extends State<IPod> {
  final PageController _pageCtrl = PageController(viewportFraction: 0.6);

  double currentPage = 0.0;

  @override
  void initState() {
    _pageCtrl.addListener(() {
      setState(() {
        currentPage = _pageCtrl.page;
      });
    });
    super.initState();
  }
}
{{< /highlight >}}

### Horizonal Scrolling Album Covers

The `PageView.builder` creates a view that only builds the children when they are visible, similar to virtual scrolling on the web. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
 @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: <Widget>[
          Container(
            height: 300,
            color: Colors.black,
            child: PageView.builder(
              controller: _pageCtrl,
              scrollDirection: Axis.horizontal,
              itemCount: 9, //Colors.accents.length,
              itemBuilder: (context, int currentIdx) {
                return AlbumCard(
                  color: Colors.accents[currentIdx],
                  idx: currentIdx,
                  currentPage: currentPage,
                );
              },
            ),
          ),
        ]
      )
    )
  }
{{< /highlight >}}

### 3D Transform

The builder for the PageView references a custom widget named `AlbumCard`. It represents the UI for a single page or item in the list. 

The albums off center should be scaled down slightly and tilted along the y-axis. We can make that happen with a Transform widget that sets perspective on a 4x4 matrix. Learn more about transforms by watching the video below: 

<div class="vid vid-center">
{{< youtube 9z_YNlRlWfA >}}
</div>


{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class AlbumCard extends StatelessWidget {
  final Color color;
  final int idx;
  final double currentPage;
  AlbumCard({this.color, this.idx, this.currentPage});

  @override
  Widget build(BuildContext context) {
    double relativePosition = idx - currentPage;

    return Container(
      width: 250,
      child: Transform(
        transform: Matrix4.identity()
          ..setEntry(3, 2, 0.003) // add perspective
          ..scale((1 - relativePosition.abs()).clamp(0.2, 0.6) + 0.4)
          ..rotateY(relativePosition),
        // ..rotateZ(relativePosition),
        alignment: relativePosition >= 0
            ? Alignment.centerLeft
            : Alignment.centerRight,
        child: Container(
          margin: EdgeInsets.only(top: 20, bottom: 20, left: 5, right: 5),
          padding: EdgeInsets.all(10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: color,
            image: DecorationImage(
              fit: BoxFit.cover,
              image: NetworkImage(images[idx]),
            ),
          ),
        ),
      ),
    );
  }
}

{{< /highlight >}}


## Click Wheel

The most difficult aspect of this demo is building a circular shape that controls the PageView. While the user drags clockwise it should scroll the view to the right, or to the left when dragged counterclockwise. It must also have buttons that can animate between individual items. 

### Doughnut-shaped Gesture Detector

The GestureDetector should only fire events when the outer ring or doughnut is panned across. Placing the widgets in a [Stack](/courses/flutter-firebase/widgets-stack/) allow a smaller circle to be placed on top, which blocks the detection of events in this areas. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
// Add this to the Column list
Center(
    child: Stack(
        alignment: Alignment.center,
        children: [
        GestureDetector(
            onPanUpdate: _panHandler, // Not implemented yet, see next steps
            child: Container(
            height: 300,
            width: 300,
                decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.black,
                ),
            ),
        ),
        Container(
            height: 100,
            width: 100,
                decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white38,
            ),
        ),
    ]),
),
{{< /highlight >}}

### Add Buttons to the Wheel

The code below represents a single click button in the wheel. Reference the full [source code](https://github.com/fireship-io/216-flutter-ipod/blob/master/lib/main.dart) to see them all. 

Notice how it uses the PageController to animate to a new position on a button press event. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
    Container(
        child: IconButton(
            icon: Icon(Icons.fast_forward),
            iconSize: 40,
            onPressed: () => _pageCtrl.animateToPage(
                (_pageCtrl.page + 1).toInt(),
                duration: Duration(milliseconds: 300),
                curve: Curves.easeIn
            ),
        ),
        alignment: Alignment.centerRight,
        margin: EdgeInsets.only(right: 30),
    ),
{{< /highlight >}}


### Handle Rotational Pan Movement

Building a rotation-aware widget requires some calculations. Checkout the [draggable rotating wheel in Flutter](/snippets/circular-drag-flutter) snippet for a more detailed explanation of these calculations. Basically, this gives us a way to detect clockwise or counter-clockwise movement. 

{{< vimeo 376862979 >}}

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
  void _panHandler(DragUpdateDetails d) {

    double radius = 150;

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
    double rotationalChange = (verticalRotation + horizontalRotation) * (d.delta.distance * 0.2); 


    // Move the page view scroller 
    _pageCtrl.jumpTo(_pageCtrl.offset + rotationalChange);
  }
{{< /highlight >}}