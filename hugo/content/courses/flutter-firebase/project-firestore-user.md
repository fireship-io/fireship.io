---
title: Current User Data in Firestore
description: Connect a Firebase User to their Data in Firestore
weight: 43
lastmod: 2020-04-12T10:11:30-02:00
draft: false
emoji: 💥
vimeo: 407365331
video_length: 2:20
---


## User Data Service

Create a generic service that can connect a user to the Firestore related to their UID. 

{{< file "dart" "db.dart" >}}
```dart
class UserData<T> {
  final Firestore _db = Firestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final String collection;

  UserData({ this.collection });


  Stream<T> get documentStream {

    return _auth.onAuthStateChanged.switchMap((user) {
      if (user != null) {
          Document<T> doc = Document<T>(path: '$collection/${user.uid}'); 
          return doc.streamData();
      } else {
          return Stream<T>.value(null);
      }
    });
  }

  Future<T> getDocument() async {
    FirebaseUser user = await _auth.currentUser();

    if (user != null) {
      Document doc = Document<T>(path: '$collection/${user.uid}'); 
      return doc.getData();
    } else {
      return null;
    }

  }

  Future<void> upsert(Map data) async {
    FirebaseUser user = await _auth.currentUser();
    Document<T> ref = Document(path:  '$collection/${user.uid}');
    return ref.upsert(data);
  }

}

```