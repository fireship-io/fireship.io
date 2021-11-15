---
title: Basic Data Fetching
description: Make basic queries to the Firestore database
weight: 42
lastmod: 2021-11-11T10:23:30-09:00
draft: false
vimeo: 645765380
emoji: 📥
video_length: 2:55
---

## Data Fetching

Create a file named `firestore.dart` in the `services` directory of your project.

{{< file "flutter" "firestore.dart" >}}
```dart
import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:rxdart/rxdart.dart';
import 'package:quizapp/services/auth.dart';
import 'package:quizapp/services/models.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  /// Reads all documments from the topics collection
  Future<List<Topic>> getTopics() async {
    var ref = _db.collection('topics');
    var snapshot = await ref.get();
    var data = snapshot.docs.map((s) => s.data());
    var topics = data.map((d) => Topic.fromJson(d));
    return topics.toList();
  }

  /// Retrieves a single quiz document
  Future<Quiz> getQuiz(String quizId) async {
    var ref = _db.collection('quizzes').doc(quizId);
    var snapshot = await ref.get();
    return Quiz.fromJson(snapshot.data() ?? {});
  }
}
```