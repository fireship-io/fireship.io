---
title: Relational Data Fetching
description: Fetch data associated to the current user
weight: 43
lastmod: 2021-11-11T10:23:30-09:00
draft: false
vimeo: 645765678
emoji: 👁️‍🗨️
video_length: 1:41
---

## Relational Data Fetching

The pattern below is useful for listening to a realtime stream that depends on the current user's UID. The `switchmap` extension method from RxDart is an essential tool for combining two streams. 

{{< file "flutter" "firestore.dart" >}}
```dart
class FirestoreService {
  /// Updates the current user's report document after completing quiz
  Future<void> updateUserReport(Quiz quiz) {
    var user = AuthService().user!;
    var ref = _db.collection('reports').doc(user.uid);

    var data = {
      'total': FieldValue.increment(1),
      'topics': {
        quiz.topic: FieldValue.arrayUnion([quiz.id])
      }
    };

    return ref.set(data, SetOptions(merge: true));
  }
}
```