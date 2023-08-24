---
title: Flutter Firebase Chat Demo
lastmod: 2021-09-30T12:19:06-07:00
publishdate: 2021-09-30T12:19:06-07:00
author: Jeff Delaney
draft: false
description: Build a chat app with Flutter, Firebase, and Firestore
tags: 
    - pro
    - flutter
    - firebase

# youtube: 
github: https://github.com/fireship-io/firechat-flutter
vimeo: 618415945
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Flutter makes it possible to build high-performance cross-platform apps with sound type safety thanks to the Dart programming language. It provides excellent [support for Firebase](https://firebase.flutter.dev/) with official plugins maintained by Google. 

In the following lesson, we will build a basic chat app with Flutter and Firebase. It allows a user to sign in with Google and then access a group chat room. The user can read a realtime feed of recent chat messages via Firestore and post new messages into the chat. The goal is to demonstrate essential patterns when working connecting Firebase users to their data in a Flutter app. 

## Setup

### Create a Flutter App

Create an app with the [Flutter CLI](https://flutter.dev/docs/reference/flutter-cli).

### Install Firebase

Follow the official Firebase [setup instructions](https://firebase.flutter.dev/docs/installation/android). This tutorial targets Android as the primary platform. 

Make sure to enable Google Authentication on the Firebase console and follow the instructions to obtain an SHA1 key. 

Add the following packages as dependencies:

{{< file "flutter" "pubspec.yaml" >}}
```yaml
dependencies:
  flutter:
    sdk: flutter

  cupertino_icons: ^1.0.3
  firebase_core: 1.6.0
  firebase_auth: 3.1.1
  google_sign_in: 5.1.0
  cloud_firestore: 2.5.3
```

### Data Model

Firestore consists of a single collection `chats` where each document contains the following data: 

{{< figure src="img/data-model.png" caption="Firestore data model for chat app" >}}

## User Authentication 

### Authentication Provider

The auth provider is a custom class used to *sign in* and *sign out* the user. 

### Sign In with Google

In order to sign in with Google, we must first use the "Google Sign In" to package bring up a native widget where the user can access their Google account. This will result in an *idToken* that must be passed off to Firebase to authenticate with the Firebase SDK. 

{{< file "flutter" "lib/auth_provider.dart" >}}
```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthProvider {
  final googleSignIn = GoogleSignIn();

  GoogleSignInAccount? _user;
  GoogleSignInAccount get user => _user!;

  Future<void> googleLogin() async {
    try {
      final googleUser = await GoogleSignIn().signIn();

      if (googleUser == null) return;

      _user = googleUser;

      final googleAuth = await googleUser.authentication;
      final authCredential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await FirebaseAuth.instance.signInWithCredential(authCredential);
    } on FirebaseAuthException catch (e) {
      AlertDialog(
        title: const Text("Error"),
        content: Text('Failed to sign in with Google: $e.message'),
      );
    }
  }
}
```

### Sign Out

Sign out will end the user session. 

{{< file "flutter" "lib/auth_provider.dart" >}}
```dart
class AuthProvider {
    // ...

  Future<void> signOut() async {
    await GoogleSignIn().disconnect();
    await FirebaseAuth.instance.signOut();
  }

}
```
### Authentication UI

The authentication UI consists of a button, that when tapped, will trigger the method on the Authentication provider defined in the previous step. It is wrapped in a `StreamBuilder` to automatically rebuild the UI when the Firebase authenticate state changes. 

{{< file "flutter" "lib/landing_screen.dart" >}}
```dart
class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Loading();
          } else if (snapshot.hasError) {
            return const Center(
              child: Text("Something went wrong!"),
            );
          } else if (snapshot.hasData) {
            // Home (chats) screen
            return const HomeScreen();
          } else {
            // Login component
            return Padding(
              padding: const EdgeInsets.all(16),
              child: Center(
                child: SizedBox(
                  width: 225,
                  height: 50,
                  child: ElevatedButton(
                    child: Row(
                      children: const [
                        Icon(
                          Icons.login,
                          size: 30.0,
                        ),
                        SizedBox(width: 10.0),
                        Text(
                          "GOOGLE SIGN IN",
                          textAlign: TextAlign.center,
                          style: googleText,
                        ),
                      ],
                    ),
                    onPressed: () {
                      AuthProvider().googleLogin();
                    },
                  ),
                ),
              ),
            );
          }
        },
      ),
    );
  }
}
```

## Chat Messages

### Chat Feed

The chat messages are first retrieved from Firestore with a query called `_chatsStream`. We can listen to the messages and update the UI in any changes with a `StreamBuilder`. The list of messages are passed to Flutter’s `ListView` to provide a scrolling vertical collection of items. We can also compare the `owner` field on the document of the current logged in user. 

{{< file "flutter" "home_screen.dart" >}}
```dart
class Chats extends StatelessWidget {
  final user = FirebaseAuth.instance.currentUser;
  final Stream<QuerySnapshot> _chatsStream = FirebaseFirestore.instance
      .collection('chats')
      .orderBy('createdAt', descending: false)
      .limit(15)
      .snapshots();

  Chats({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: _chatsStream,
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Center(child: Text('$snapshot.error'));
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Loading();
        }

        return Flexible(
          // Flexible prevents overflow error when keyboard is opened
          child: GestureDetector(
            // Close the keyboard if anything else is tapped
            onTap: () {
              FocusScopeNode currentFocus = FocusScope.of(context);
              if (!currentFocus.hasPrimaryFocus) {
                currentFocus.unfocus();
              }
            },
            child: ListView(
              shrinkWrap: true,
              scrollDirection: Axis.vertical,
              children: snapshot.data!.docs.map(
                (DocumentSnapshot doc) {
                  // Doc id
                  String id = doc.id;
                  // Chat data
                  Map<String, dynamic> data =
                      doc.data()! as Map<String, dynamic>;

                  // Chats sent by the current user
                  if (user?.uid == data['owner']) {
                    return SentMessage(data: data);
                  } else {
                    // Chats sent by everyone else
                    return ReceivedMessage(data: data);
                  }
                },
              ).toList(),
            ),
          ),
        );
      },
    );
  }
}
```

### Send a Message

The final step is to provide a form input where the user can send a new message in the chat and write it to Firestore. Flutter provides a `TextEditingController` that can react to changes typed into a text field. We pass the value from the controller to Firestore a `sendMessage` method that performs a write in Firestore. 

{{< file "flutter" "lib/bottom_chat_bar.dart" >}}
```dart
class BottomChatBar extends StatefulWidget {
  const BottomChatBar({super.key});

  @override
  _BottomChatBarState createState() => _BottomChatBarState();
}

class _BottomChatBarState extends State<BottomChatBar> {
  final textController = TextEditingController();

  @override
  // Clean up on destroy
  void dispose() {
    textController.dispose();
    super.dispose();
  }

  final user = FirebaseAuth.instance.currentUser;
  CollectionReference chatsRef = FirebaseFirestore.instance.collection("chats");

  Future sendMessage() async {
    if (textController.text.isNotEmpty) {
      if (textController.text.length < 40) {
        try {
          return chatsRef.doc().set(
            {
              "text": textController.text,
              "owner": user?.uid,
              "imageUrl": user?.photoURL,
              "createdAt": FieldValue.serverTimestamp(),
            },
          ).then(
            (value) => {
              textController.clear(),
            },
          );
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('$e'),
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Must be 40 characters or less'),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Chat can't be empty"),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      decoration: const BoxDecoration(
        color: Color(0xff161616),
        boxShadow: [boxShadow],
      ),
      child: Align(
        alignment: Alignment.center,
        child: Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            Container(
              alignment: Alignment.center,
              margin: const EdgeInsets.symmetric(
                horizontal: 15.0,
              ),
              constraints: const BoxConstraints(
                maxWidth: 275,
              ),
              child: TextField(
                cursorColor: Colors.lightBlue,
                controller: textController,
                textAlign: TextAlign.left,
                textAlignVertical: TextAlignVertical.center,
                style: inputText,
                keyboardType: TextInputType.text,
                onEditingComplete: sendMessage,
                decoration: const InputDecoration(
                  filled: true,
                  fillColor: Color(0xff212121),
                  border: outlineBorder,
                  enabledBorder: roundedBorder,
                  labelStyle: placeholder,
                  labelText: 'Enter message',
                  floatingLabelBehavior: FloatingLabelBehavior.never,
                  contentPadding: EdgeInsets.only(
                    left: 20.0,
                    right: 10.0,
                    top: 0.0,
                    bottom: 0.0,
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 45,
              width: 50,
              child: FloatingActionButton(
                onPressed: sendMessage,
                elevation: 8.0,
                backgroundColor: Colors.lightBlue,
                child: const Center(
                  child: Icon(
                    Icons.send,
                    size: 30.0,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

That’s it. We now know how to build a basic chat app with Flutter and Firebase. If you’re exploring mobile app solutions, also check out the sister tutorial React Native Firebase Chat App. 
