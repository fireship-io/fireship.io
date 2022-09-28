---
title: Flutter Firebase Google SignIn + Firestore
lastmod: 2019-01-14T07:43:54-07:00
publishdate: 2019-01-14T07:43:54-07:00
author: Jeff Delaney
draft: false
description: Learn how to Setup GoogleSign and Firestore with Flutter from Scratch
tags: 
    - flutter
    - firebase
    - auth
    - firestore

youtube: cHFV6JPp-6A
github: https://github.com/fireship-io/flutter-base

versions: 
  flutter: 1.0.0+1
  cloud_firestore: ^0.8.2+3
  firebase_auth:  ^0.6.6
  google_sign_in: ^3.2.4
  rxdart: ^0.20.0
---

The following lesson will show you how to implement [Google SignIn](https://pub.dartlang.org/packages/google_sign_in) with Flutter and Firebase, then update a custom user profile in Firestore. We will demonstrate several key concepts related to building reactive UIs with realtime streaming data, including

- Global Streams and Observables with RxDart
- StatefulWidget
- StreamBuilder

{{< figure src="img/flutterfire-oauth-demo.gif" alt="demo of Google auth on Flutter with Firestore" >}}


## Step 0: Prerequisites

1. Install FlutterFire

## Step 1: Build Out the UI

First, let's start with a basic UI. Notice we have placeholders for `LoginButton()` and `UserProfile()` - these will be created later in the lesson. 

{{< file "dart" "main.dart" >}}
```dart
import 'package:flutter/material.dart';
import 'auth.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'FlutterBase',
        home: Scaffold(
            appBar: AppBar(
              title: Text('Flutterbase'),
              backgroundColor: Colors.amber,
            ),
            body: Center(
              child: Column(
                children: <Widget>[
                    LoginButton(), // <-- Built with StreamBuilder
                    UserProfile() // <-- Built with StatefulWidget
                ],
              ),
            )
        )
    );
  }
}

```


## Step 2: Isolate the Authentication Logic

Flutter is not opinionated about how you architect your app when it comes to shared global state. The most popular approaches include redux and inherited widgets, but they require a bit of work upfront tend to be burdensome when prototyping the UX. A simple approach to state management is to simply provide a global variable class instance that contains Streams and/or Rx Observables. This keeps auth logic out of widgets, while allowing any widget to listen/react to changes in the auth state. 

Here are a couple rules we will follow: 

1. Only use Observables/Streams for stateful data. 
2. AuthService class will only be instantiated once (although it's not technically a singleton in this case). 

Sound good? Create a new file called `lib/auth.dart`. 

### Create the AuthService Class

Let's start by adding our Firebase dependencies to the class and fleshing out it's API. 


The `_` prefix is used for property names to create private members in Dart. We will do this for the client libraries consumed by the class. 


The streams provided by Firebase are [broadcast](https://www.dartlang.org/articles/libraries/broadcast-streams) to multiple subscribers (this is called as a hot Observable in Rx). In this demo, the `user` is the authentication record, while the `profile` represents custom data that will be saved about this user in Firestore. 

Also, the `PublishSubject loading` is just like a hot observable, except values can be pushed to it manually. We will use it to toggle the loading state in our code. 

{{< file "dart" "auth.dart" >}}
```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:rxdart/rxdart.dart';

class AuthService {
  // Dependencies
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final Firestore _db = Firestore.instance;

  // Shared State for Widgets
  Observable<FirebaseUser> user; // firebase user
  Observable<Map<String, dynamic>> profile; // custom user data in Firestore
  PublishSubject loading = PublishSubject();

  // constructor
  AuthService() {

  }

  Future<FirebaseUser> googleSignIn() async {

  }

  void updateUserData(FirebaseUser user) async {


  }


  void signOut() {

  }
}

final AuthService authService = AuthService(); 
```


### Initialize Observables in the Constructor

The state is initialized in the constructor of this class. The user is just an Observable wrapper over the Firebase `onAuthStateChanged` stream. This part is critical because we can then chain Rx operators for amazing control flow of the stream. 

In order to get the `profile` data from the database, we need to first retrieve logged-in user's uid - this is where RxDart starts to become awesome. The `switchMap` operator will take the user from the outer Observable, then use it to *switch* to another Observable of the Firestore database record. If the user is not logged in, we can just return an Observable of an empty Map. 

{{< file "dart" "auth.dart" >}}
```dart
  AuthService() {
    user = Observable(_auth.onAuthStateChanged);

    profile = user.switchMap((FirebaseUser u) {
      if (u != null) {
        return _db
            .collection('users')
            .document(u.uid)
            .snapshots()
            .map((snap) => snap.data);
      } else {
        return Observable.just({});
      }
    });
  }
```

### Implement SignIn & SignOut

`SignIn` can be broken down into three async steps:

1. Login with Google. This shows Google's native login screen and provides the `idToken` and `accessToken`. 
2. Login to Firebase. At this point, the user is logged into Google, but not Firebase. We can simply pass the tokens to Firebase to login. 
3. Update Firestore. At this point, we can update the database with any custom data we want to use in the UI. 

```dart
  Future<FirebaseUser> googleSignIn() async {
    // Start
    loading.add(true);

    // Step 1
    GoogleSignInAccount googleUser = await _googleSignIn.signIn();

    // Step 2
    GoogleSignInAuthentication googleAuth = await googleUser.authentication;
    FirebaseUser user = await _auth.signInWithGoogle(
        accessToken: googleAuth.accessToken, idToken: googleAuth.idToken);

    // Step 3
    updateUserData(user);

    // Done
    loading.add(false);
    print("signed in " + user.displayName);
    return user;
  }

  void updateUserData(FirebaseUser user) async {
    DocumentReference ref = _db.collection('users').document(user.uid);

    return ref.setData({
      'uid': user.uid,
      'email': user.email,
      'photoURL': user.photoUrl,
      'displayName': user.displayName,
      'lastSeen': DateTime.now()
    }, merge: true);
  }

  void signOut() {
    _auth.signOut();
  }


```

## Step 3: StatefulWidget User Profile

Now that our auth logic is in place, we have two options for rendering UI elements based on our Observable state - [StatefulWidget](https://docs.flutter.io/flutter/widgets/StatefulWidget-class.html) and [StreamBuilder](https://docs.flutter.io/flutter/widgets/StreamBuilder-class.html). 

Let's start by building a `StatefulWidget` that listens to the the `Observable profile` and displays its data in the UI. In this example, we are listening to the stream, then using the emitted values to call `setState` on widget, thus triggering a repaint. 


Only use `setState` to change properties on the widget and do all the computation elsewhere. Also, your state must be initialized, which is why the subscriptions are created in the `initState` lifecycle hook. 


{{< file "dart" "main.dart" >}}
```dart
class UserProfile extends StatefulWidget {
  @override
  UserProfileState createState() => UserProfileState();
}

class UserProfileState extends State<UserProfile> {
  Map<String, dynamic> _profile;
  bool _loading = false;

  @override
  initState() {
    super.initState();

    // Subscriptions are created here
    authService.profile.listen((state) => setState(() => _profile = state));

    authService.loading.listen((state) => setState(() => _loading = state));
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: <Widget>[
      Container(padding: EdgeInsets.all(20), child: Text(_profile.toString())),
      Text(_loading.toString())
    ]);
  }
}

```

## Step 4: StreamBuilder Login Button 

The `StatefulWidget` is fine, but it contains a decent amount of boilerplate and in most cases I find `StreamBuilder` to be more flexible and concise. It is just a widget that depends on the value of a stream, so when the value of the stream changes you can conditionally render different widgets.

This is a perfect use-case the login button. For example, we don't want to show *SignIn with Google* in the UI if the user is already logged in. 

`StreamBuilder` takes our `Observable user` as the stream, then we implement a builder function that returns some UI widgets. The `snapshot` is the data emitted by the stream/observable. In our case, we know the user is logged in if `snapshot.hasData == true`


```dart
class LoginButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: authService.user,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return MaterialButton(
              onPressed: () => authService.signOut(),
              color: Colors.red,
              textColor: Colors.white,
              child: Text('Signout'),
            );
          } else {
            return MaterialButton(
              onPressed: () => authService.googleSignIn(),
              color: Colors.white,
              textColor: Colors.black,
              child: Text('Login with Google'),
            );
          }
        });
  }
}
```

## The End

You now have a reliable way to share and observe user data in your Flutter app. You might improve this code by implementing the AuthService as an InheritedWidget so it can be scoped to specific places in the widget tree. 