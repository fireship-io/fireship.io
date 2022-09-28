---
title: Future
description: Use a Future to handle a single async event
weight: 41
lastmod: 2021-10-08T11:11:30-09:00
draft: false
vimeo: 629641932
emoji: ⏲️
video_length: 2:35
---

## Create a Future

Many APIs in Dart/Flutter return Futures. To simulate an async event, we can create a future that will resolve after a 5 second delay. 

{{< file "dart" "futures.dart" >}}
```dart
var delay = Future.delayed(Duration(seconds: 5));
```

## Handle a Future

A future can either be a *success* or a *error*. Use then `then` to handle a successful resolution and `catchError` to handle an error.

{{< file "dart" "futures.dart" >}}
```dart
  delay
      .then((value) => print('I have been waiting'))
      .catchError((err) => print(err));
```

## Async Await Syntax

Async-await provides a cleaner (arguably) syntax for writing asynchronous code. The `async` keyword tells Dart to return a Future, while `await` pauses the execution of the function until the Future resolves.

{{< file "dart" "futures.dart" >}}
```dart
Future<String> runInTheFuture() async {
  var data = await Future.value('world');

  return 'hello $data';
}
```