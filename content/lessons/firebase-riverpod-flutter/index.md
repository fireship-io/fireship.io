---
title: Riverpod with Firebase
lastmod: 2021-11-27T13:45:48-07:00
publishdate: 2021-11-27T13:45:48-07:00
author: Jeff Delaney
draft: false
description: Use Flutter Riverpod to manage Firebase auth state and relational realtime data in Firestore
tags: 
    - pro
    - flutter
    - firebase

github: https://github.com/fireship-io/riverpod-firebase-demo
vimeo: 650906808
pro: true
---

[Riverpod](https://riverpod.dev/docs/getting_started/) is a reactive state-management library for Flutter that can simplify the way global data is shared throughout your application. It is especially useful with [Firebase](https://firebase.flutter.dev/) because it allows to you easily join Streams together, like a Firestore document with a Firebase Auth user.

The following tutorial demonstrates how to use Riverpod to manage Firebase Auth state and relational realtime data in Firestore. 

**Learning Objectives** 

- Riverpod Basics w/ Firebase
- Listen to the current user's auth state
- Join realtime Firestore data based on current user's UID

## Setup

This tutorial assumes you have already installed [Firebase](https://firebase.flutter.dev/) into your app. Install Riverpod by adding it to the `pubspec.yaml` file. 

### Starter Code

The application should initialize Firebase and look something like this:

{{< file "yaml" "pubspec.yaml" >}}
```yaml
firebase_core: "^1.10.0"
cloud_firestore: "^3.1.0"
firebase_auth: "^3.2.0"
flutter_riverpod: ^1.0.0
```

The main function should initialize Firebase and the root widget should be wrapped in a `ProviderScope`. 

{{< file "flutter" "main.dart" >}}
```dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}
```

## Riverpod Basics

### Provider

A provider is a global state container that can be used to share data between widgets. 

{{< file "flutter" "main.dart" >}}
```dart
final helloWorldProvider = Provider((_) => 'Hello world');
```

### ConsumerWidget

Riverpod provides a base class called `ConsumerWidget` to replace the `StatefulWidget` class. It has the ability to listen to changes in the state of a provider. It provides a widget reference that contains a `watch` method to access the current provider value. 

{{< file "flutter" "main.dart" >}}
```dart
class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    
    final String helloWorld = ref.watch(helloWorldProvider);

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text(helloWorld),
        ),
      ),
    );
  }
}
```

## Firebase Auth Provider

FirebaseAuth provides the current user as a `Stream`. Riverpod has a `StreamProvider` class that can wrap the Firebase auth state, allowing you to access the current user from any widget easily.  

### Create a StreamProvider

A `StreamProvider` is just a provider that returns a `Stream`. 


```dart
final userProvider = StreamProvider<User?>(
  (ref) => FirebaseAuth.instance.authStateChanges(),
);
```

### Consume a StreamProvider

The provider contains a `when` method that will build a different UI depending on the `data`, `loading`, and `error` states. 

{{< file "flutter" "main.dart" >}}
```dart
class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {

    final user = ref.watch(userProvider);

    return user.when(
      data: (user) {
        return MaterialApp(...);
      },
      error: (e, s) => Text('error'),
      loading: () => Text('loading'),
    );
  }
}

```

## Firestore Provider

In this section, we query a Firestore document with the UID and listen to changes in realtime. The beauty of Riverpod is that we can compose providers together to handle complex relationships that react to changes in other providers.

### Query Firestore with UID

This demo assumes every user has an account document in Firestore, like `accounts/{uid}`. The provider will query Firestore with the current user's UID. If the UID does not exist, just return an empty `Stream`. 

Note: This pattern is similar to the [relational switchMap](/courses/flutter-firebase/firestore-relational/) technique used in the Full Flutter Course with RxDart.

{{< file "flutter" "main.dart" >}}
```dart
final dataProvider = StreamProvider<Map?>(
  (ref) {
    final userStream = ref.watch(userProvider);

    var user = userStream.value;

    if (user != null) {
      var docRef =
          FirebaseFirestore.instance.collection('accounts').doc(user.uid);
      return docRef.snapshots().map((doc) => doc.data());
    } else {
      return Stream.empty();
    }
  },
);
```

### Consume Realtime Data

Now consume the provider just like the previous example. 

```dart
class AccountDetails extends ConsumerWidget {
  @override
  Widget build(context, ref) {
    final data = ref.watch(dataProvider);

    return data.when(
      data: (data) {
        return Text(data?['hello'] ?? 'empty');
      },
      error: (e, s) => Text('error'),
      loading: () => Text('waiting for data...'),
    );
  }
}
```


