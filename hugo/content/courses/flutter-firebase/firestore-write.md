---
title: Write to Firestore
description: Advanced techniques for writing data to Firestore
weight: 44
lastmod: 2021-11-11T10:23:30-09:00
draft: false
vimeo: 645765740
emoji: ✏️
video_length: 1:47
---

## Writing to Firestore

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