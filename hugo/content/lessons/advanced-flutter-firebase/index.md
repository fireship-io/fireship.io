---
title: Flutter Provider with Firebase
lastmod: 2019-05-11T13:59:08-07:00
publishdate: 2019-05-11T13:59:08-07:00
author: Jeff Delaney
draft: false
description: Advanced state management techniques when working with Firebase Auth & Firestore in Flutter applications. 
tags: 
    - flutter
    - firebase
    - firestore
    - advanced

youtube: vFxk_KJCqgk
github: https://github.com/fireship-io/185-advanced-flutter-firestore
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

The following article discusses patterns that I have found exceptionally useful when implementing Firebase User Authentication and Firestore in Flutter. In particular, the [Provider](https://pub.dev/packages/provider) provides an excellent solution for sharing and managing streams with minimal boilerplate. However, to take full advantage of this package you must deserialize your raw data to a Dart class. 

{{< box icon="scroll" class="box-green" >}}
If you are building a major project with Flutter & Firebase, consider enrolling in the [Full Flutter Firebase Course](/courses/flutter-firebase/).
{{< /box >}}

## Basic Firestore Read

## Sharing Global Data

When it comes to static values that never change I would highly recommend that you *Keep it Simple*.

### Static Global Data

 Dart supports global variables, so you can just instantiate objects outside of the widget tree as needed, but keep your code organized and avoid polluting the global namespace.

A solution that provides organization and also code-readability is to use a dedicated class that defines static properties and methods. This ensures that you always know where the value originated and prevents the creation of duplicate instances. 

{{< file "dart" "globals.dart" >}}
{{< highlight dart >}}
class Global {
  // App Data
  static final String title = 'Fireship';

  // Services
  static final FirebaseAnalytics analytics = FirebaseAnalytics();

  // Helper Methods
  static doSomethingCool() => print('cool');
}


/// Elsewhere in flutter...
FlatButton(child: Text(Global.title), onPressed: Global.doSomethingCool );
{{< /highlight >}}

As an alternative, you can break your data into multiple global singletons with the [get_it](https://pub.dev/packages/get_it) library. 

### Global Streams

Streams are a bit more complex because we need to explicitly listen to them and dispose of them when done - this can lead to a lot of boilerplate when done manually in a StatefulWidget. 

A better option is to use Flutter's built in `StreamBuilder` widget, which automatically manages your stream and gives you a build context. However, it can still be a challenge to combine multiple streams and/or share their values in multiple places. 

An *even better option* is the [Provider](https://pub.dev/packages/provider) package. It is mostly syntatic sugar for *InheritedWidget*, but can also manage Stream subscriptions. In the snippet below, we wrap the entire MaterialApp in with a `MultiProvider`, then listen a Firebase user's global authentication state. 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
import 'package:provider/provider.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {

    return MultiProvider(
      providers: [
        // Make user stream available
        StreamProvider<FirebaseUser>.value(stream: FirebaseAuth.instance.onAuthStateChanged),

        // See implementation details in next sections
        StreamProvider<SuperHero>.value(stream: firestoreStream),
      ],

      // All data will be available in this child and descendents
      child: MaterialApp(...)
    );
  }
}
{{< /highlight >}}


The beauty of this approach is that `StreamProvider` will automatically listen to the subscription for us (and dispose if necessary, it is actually just a StreamBuilder under the hood), allowing us to treat the underlying data as a synchronous value available to the entire app. We can access it in a build method like so:

{{< highlight dart >}}
// Some widget deeply nested in the widget tree...
class SomeWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
      var user = Provider.of<FirebaseUser>(context);

      return Text(user.displayName)
      
  }
}
{{< /highlight >}}


## Deserializing Firebase Data to a Dart Class

Unlike TypeScript, you cannot just overlay an Interface over a Map in Dart and have it accept those types. 

Firebase returns data from Firestore in the form of a `Map`. It is perfectly fine to call properties on a map in your code:

{{< highlight dart >}}
Text(data['title']),
Text(data['description'])
{{< /highlight >}}

But this becomes increasingly difficult as your app grows, both in terms of code-maintainability and unexpected runtime errors. In addition, it makes it difficult to use the Provider package, because it looks up the widget tree for a specific type signature. We need a way to convert a `Map` to a Class instance, allowing us to write code like: 

{{< highlight dart >}}
Text(data.title),
Text(data.description)
{{< /highlight >}}

### Data Model Class

There are several JSON deserialization strategies in Flutter, but I've found hand-written classes to be the most reliable approach. Let's start by writing the classes that define the shape of our data 

{{< file "dart" "main.dart" >}}
{{< highlight dart >}}

class SuperHero {
  final String name;
  final int strength;
  final int damage; 

  SuperHero({ this.name, this.strength });
}

class Weapon {
  final String id;
  final String name;
  final int hitpoints;

  Weapon({ this.id, this.name, this.hitpoints });
}
{{< /highlight >}}

These classes match the data types that we expect back from Firestore. 

{{< figure src="img/data-model-root.png" alt="The heroes root collection in Firestore" >}}

{{< figure src="img/data-model-sub.png" alt="The weapons subcollection, i.e. the weapons owned by the hero" >}}



### From a Map or JSON

In most cases, it makes the most sense to deserialize from a Map because this makes your data model compatible with other sources, like Dart's HTTP client, or anything that fetches JSON. Below we expand our class with a factory constructor to convert a Map to an instance of `SuperHero`.


{{< highlight dart >}}
class SuperHero {

  final String name;
  final int strength;

  SuperHero({ this.name, this.strength });

  factory SuperHero.fromMap(Map data) {
    data = data ?? { };
    return SuperHero(
      name: data['name'] ?? '',
      strength: data['strength'] ?? 100,
    );
  }

}
{{< /highlight >}}


### From a Firestore Document

It is also possible to setup your constructor specifically for a Firestore `DocumentSnapshot`. This makes your code more specialized for Firebase, but has the added benefit of giving you the document ID on collection queries. 

{{< highlight dart >}}
class Weapon {
  final String id;
  final String name;
  final int hitpoints;
  final String img;

  Weapon({ this.id, this.name, this.hitpoints, this.img, });

  factory Weapon.fromFirestore(DocumentSnapshot doc) {
    Map data = doc.data;
    
    return Weapon(
      id: doc.documentID,
      name: data['name'] ?? '',
      hitpoints: data['hitpoints'] ?? 0,
      img: data['img'] ?? ''
    );
  }

}
{{< /highlight >}}



## Database Service

Now that you know how to deserialize data, the next challenge is to write an efficient service for fetching and writing data. Every app has different needs, but the service below separates the business logic from your widgets. It should expose readable methods for data reads/writes that deserialize your data. 


### Example Database Service

The service below converts a firestore document read, then maps it to a `SuperHero` and a collection query to a `List<Weapon>`, as streams. 

{{< file "dart" "db.dart" >}}
{{< highlight dart >}}
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';
import 'models.dart';

class DatabaseService {
  final Firestore _db = Firestore.instance;

  /// Get a stream of a single document
  Stream<SuperHero> streamHero(String id) {
    return _db
        .collection('heroes')
        .document(id)
        .snapshots()
        .map((snap) => SuperHero.fromMap(snap.data));
  }

  /// Query a subcollection
  Stream<List<Weapon>> streamWeapons(FirebaseUser user) {
    var ref = _db.collection('heroes').document(user.uid).collection('weapons');

    return ref.snapshots().map((list) =>
        list.documents.map((doc) => Weapon.fromFirestore(doc)).toList());
    
  }

  /// Write data
  Future<void> createHero(String heroId) {
    return _db.collection('heroes').document(heroId).setData({ /* some data */ });
  }

}
{{< /highlight >}}


### Using the service with Provider

Now that we have a `Stream<T>` based on our data models, we can easily share and combine streaming data throughout the widget tree. 


{{< file "dart" "main.dart" >}}
{{< highlight dart >}}
class HeroScreen extends StatelessWidget {
  final auth = FirebaseAuth.instance;
  final db = DatabaseService();

  @override
  Widget build(BuildContext context) {
    var user = Provider.of<FirebaseUser>(context);
    bool loggedIn = user != null;

    return Column(
      children: <Widget>[
        if (loggedIn)

          StreamProvider<SuperHero>.value(  // All children will have access to SuperHero data
            stream: db.streamHero(user),
            child: HeroProfile(),
          ),

          StreamProvider<List<Weapon>>.value( // All children will have access to weapons data
            stream: db.streamWeapons(user),
            child: WeaponsList(),
          ),

      ],
    );
  }
}



class WeaponsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var weapons = Provider.of<List<Weapon>>(context);
    var user = Provider.of<FirebaseUser>(context);

    return Text('Hi ${user.displayName}, you have ${weapons.length} weapons equipped')

  }
}
{{< /highlight >}}
