---
title: Throttle and Debounce with Dart
lastmod: 2019-11-28T19:10:14-07:00
publishdate: 2019-11-28T19:10:14-07:00
author: Jeff Delaney
draft: true
description: How to Throttle and Debounce Events in Dart and Flutter
tags: 
    - dart
    - flutter

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

versions: 
    - dart: 2.6
---

In many cases, you Flutter may send you more events that actually want to handle. The following snippet contains Dart examples for `Throttle` and `Debounce` to control frequency or "backpressure" of events in your app. Learn more about Throttle and Debounce in this excellent [breakdown](https://css-tricks.com/debouncing-throttling-explained-examples/) for JavaScript. 


## Throttle

The [Throttle](https://lodash.com/docs/4.17.15#throttle) class ensures that the callback function provided will only be called at most once per duration. It calls the first attempt, then waits for the timer to expire before calling calling the next attempt, *first in first out*. 

### Dart Throttle Example

{{< file "dart" "throttle.dart" >}}
{{< highlight dart >}}
class Throttle {
  final Duration duration;
  bool _canRun = true;

  Throttle({this.duration});

  run(Function callback, [List positionalArgs, Map namedArgs]) {
    if (_canRun) {
      Function.apply(callback, positionalArgs, namedArgs);

      _canRun = false;
      Timer(duration, () => _canRun = true);
    }
  }

}
{{< /highlight >}}

### Usage in Flutter

Usage in a Flutter `StatefulWidget` (notice how the arguments are passed as arguments): 

{{< file "dart" "widget.dart" >}}
{{< highlight dart >}}

var panThrottle = Throttle(duration: Duration(milliseconds: 500));

Widget build(BuildContext context) {

    GestureDetector(
        onPanStart: (DragStartDetails event) => panThrottle.run(print, [event]),
    )
}
{{< /highlight >}}


Keep in mind, this implementation does not handle leading or trailing edges, so only events after the throttle duration will fire.

## Debounce

[Debounce](https://lodash.com/docs/4.17.15#debounce) waits for a certain duration after an event starts before invoking the last observed callback. Think of it as grouping multiple events together where only the last event fires, *last in first out*. 

### Dart Debounce Example

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class Debounce {
  final Duration duration;
  Timer _timer;
  Function _functionToCall;

  Debounce({this.duration});

  run(Function callback, [List positionalArgs, Map namedArgs]) {

      _functionToCall = () => Function.apply(callback, positionalArgs, namedArgs);
      if (_timer == null || !_timer.isActive) {
        _timer = Timer(duration, _functionToCall);
      }
    }

}
{{< /highlight >}}

