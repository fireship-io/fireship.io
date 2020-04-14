---
title: Hero Animation
description: Create beautiful transitions between screens the with the Hero widget
weight: 51
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 😎
vimeo: 336425047
video_length: 1:10
---

## Hero Animation Example

{{< file "dart" "topics.dart" >}}
```dart
class TopicScreen extends StatelessWidget {
  final Topic topic;
  TopicScreen({this.topic});

  @override
  Widget build(BuildContext context) {
    return Scaffold(

        /// ...

      body: ListView(children: [
        Hero(
          tag: topic.img,
          child: Image.asset('assets/covers/${topic.img}',
              width: MediaQuery.of(context).size.width),
        ),

        /// ...
      ]),
    );
  }
}
```