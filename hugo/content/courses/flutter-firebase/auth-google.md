---
title: Google Sign In
description: Authenticate with Google using FlutterFire
weight: 32
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🧔
vimeo: 645764833
video_length: 3:15
---

# Auth Service

Implement Google Login in the auth service.


{{< file "flutter" "services/auth.dart" >}}
```dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {

  // ...

  Future<void> googleLogin() async {
    try {
      final googleUser = await GoogleSignIn().signIn();

      if (googleUser == null) return;

      final googleAuth = await googleUser.authentication;
      final authCredential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await FirebaseAuth.instance.signInWithCredential(authCredential);
    } on FirebaseAuthException catch (e) {
        // handle error
    }
  }

}
```

## Login Screen

Add Google Sign In to the login screen column.

{{< file "flutter" "login.dart" >}}
```dart
    LoginButton(
        text: 'Sign in with Google',
        icon: FontAwesomeIcons.google,
        color: Colors.blue,
        loginMethod: AuthService().googleLogin,
    ),
```