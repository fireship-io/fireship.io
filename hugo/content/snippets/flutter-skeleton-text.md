---
title: Flutter Skeleton Text with Shimmer Animation
publishdate: 2019-03-19T09:35:09-07:00
lastmod: 2019-01-02T09:35:09-07:00
draft: false
type: lessons
author: Jeff Delaney
description: Build a Skeleton Text placeholder widget in Flutter with a looping shimmer animation. 
tags:
    - flutter
---

Skeleton text is a strategy that improves the perceived load time of content by rendering a blank placeholder that roughly matches the size of the expected content. This method was originally made popular by Facebook, but is now used on many popular apps and websites. 

{{< figure src="/img/snippets/flutter-skeleton-text-demo.gif" caption="Use this skeleton text widget as a placeholder when loading data from an external source." >}}

## Flutter Skeleton Text Widget

The *skeleton text* effect can be created in Flutter with an animated loop over a color gradient. It simply moves the starting point of the gradient from left to right.  In addition, it makes the height and width configurable to fit different content types. 

{{< file "dart" "skeleton.dart" >}}
{{< highlight dart >}}
class Skeleton extends StatefulWidget {
  final double height;
  final double width;

  Skeleton({Key key, this.height = 20, this.width = 200 }) : super(key: key);

  createState() => SkeletonState();
}

class SkeletonState extends State<Skeleton> with SingleTickerProviderStateMixin {
  AnimationController _controller;

  Animation gradientPosition;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: Duration(milliseconds: 1500), vsync: this);

    gradientPosition = Tween<double>(
      begin: -3,
      end: 10,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.linear
      ),
    )..addListener(() {
      setState(() {});
    });

    _controller.repeat();
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        width:  widget.width,
        height: widget.height, 
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment(gradientPosition.value, 0),
            end: Alignment(-1, 0),
            colors: [Colors.black12, Colors.black26, Colors.black12]
          )
        ),
    );
  }
}
{{< /highlight >}}