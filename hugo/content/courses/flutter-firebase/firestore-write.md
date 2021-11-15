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
    /// Listens to current user's report document in Firestore
  Stream<Report> streamReport() {
    return AuthService().userStream.switchMap((user) {
      if (user != null) {
        var ref = _db.collection('reports').doc(user.uid);
        return ref.snapshots().map((doc) => Report.fromJson(doc.data()!));
      } else {
        return Stream.fromIterable([Report()]);
      }
    });
  }
}
```