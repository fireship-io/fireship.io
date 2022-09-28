---
title: Stream
description: Use a Stream to handle multiple async events
weight: 42
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629642256
emoji: 🌊
video_length: 2:22
---

## Create a Stream

A Stream provides a way to handle multiple async events. Simulate a stream of events by creating one from a list of numbers.

{{< file "dart" "streams.dart" >}}
```dart
var stream = Stream.fromIterable([1, 2, 3]);
```

By default, a Stream can only have one listener. If you intend to have multiple listeners convert it to a broadcast stream. 

{{< file "dart" "streams.dart" >}}
```dart
var stream = Stream.fromIterable([1, 2, 3]).asBroadcastStream();
```

## Listen to a Stream

Listen to a Stream by subscribing to it with the `listen` method. The callback function will be fired for each event emitted by the Stream. 

{{< file "dart" "streams.dart" >}}
```dart
stream.listen((event) => print(event));
```

## Async For Loop

We can also use the async/await syntax to listen to a stream - think of it like a for loop that unfolds over the dimension of time. 

{{< file "dart" "streams.dart" >}}
```dart
streamFun() async {
  var stream = Stream.fromIterable([4, 5, 6]);

  await for (int value in stream) {
    print(value);
  }
}
```
