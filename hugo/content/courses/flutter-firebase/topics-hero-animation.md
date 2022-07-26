---
title: Hero Animation
description: Create beautiful transitions between screens the with the Hero widget
weight: 51
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🦸
vimeo: 645859506
video_length: 4:08
---

## Task: Image Assets

Grab the image assets from the full source code and copy them into the assets folder in your project. Update the `pubspec.yaml` file to include the image assets.

{{< file "flutter" "pubspec.yaml" >}}
```yaml
flutter:

  uses-material-design: true
  assets:
    - assets/
    - assets/covers/
    - assets/congrats.gif
```

## Topic Card

Create a file called `topic_item.dart` in the `topics` folder. Create a card to represent an individual topic. 

{{< file "dart" "topics_item.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'package:quizapp/services/models.dart';
import 'package:quizapp/shared/progress_bar.dart';

class TopicItem extends StatelessWidget {
  final Topic topic;
  const TopicItem({super.key, required this.topic});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: topic.img,
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (BuildContext context) => TopicScreen(topic: topic),
              ),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                flex: 3,
                child: SizedBox(
                  child: Image.asset(
                    'assets/covers/${topic.img}',
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              Flexible(
                child: Padding(
                  padding: const EdgeInsets.only(left: 10, right: 10),
                  child: Text(
                    topic.title,
                    style: const TextStyle(
                      height: 1.5,
                      fontWeight: FontWeight.bold,
                    ),
                    overflow: TextOverflow.fade,
                    softWrap: false,
                  ),
                ),
              ),
              Flexible(child: TopicProgress(topic: topic)),
            ],
          ),
        ),
      ),
    );
  }
}
```

## Individual Topic Screen

When tapped, the card to navigate to the topic screen and keep the image in the view thanks to the `Hero` widget. 

{{< file "dart" "topics_item.dart" >}}
```dart
class TopicScreen extends StatelessWidget {
  final Topic topic;

  const TopicScreen({super.key, required this.topic});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
      ),
      body: ListView(children: [
        Hero(
          tag: topic.img,
          child: Image.asset('assets/covers/${topic.img}',
              width: MediaQuery.of(context).size.width),
        ),
        Text(
          topic.title,
          style:
              const TextStyle(height: 2, fontSize: 20, fontWeight: FontWeight.bold),
        ),
      ]),
    );
  }
}
```

