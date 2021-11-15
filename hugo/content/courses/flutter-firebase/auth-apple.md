---
title: Sign in with Apple
description: Implement a Sign in with Apple button
weight: 33
lastmod: 2021-11-11T10:23:30-09:00
draft: false
emoji: 🍎
vimeo:
video_length: 0:00
---

🚨 Video is a work in progress.

Refer to the [Official Guide](https://firebase.flutter.dev/docs/auth/social#apple). 

As of April 2020, all native iOS apps that offer social auth methods (Google, Facebook, etc.) MUST also include Apple Sign In as an option. See the official [guidance from Apple](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple). 

## Sign in with Apple with Firebase

{{< file "flutter" "main.dart" >}}
```dart
import 'dart:convert';
import 'dart:math';
import 'package:crypto/crypto.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

class AuthService {

    // ...

  String generateNonce([int length = 32]) {
    const charset =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    final random = Random.secure();
    return List.generate(length, (_) => charset[random.nextInt(charset.length)])
        .join();
  }

  /// Returns the sha256 hash of [input] in hex notation.
  String sha256ofString(String input) {
    final bytes = utf8.encode(input);
    final digest = sha256.convert(bytes);
    return digest.toString();
  }

  Future<UserCredential> signInWithApple() async {
    // To prevent replay attacks with the credential returned from Apple, we
    // include a nonce in the credential request. When signing in with
    // Firebase, the nonce in the id token returned by Apple, is expected to
    // match the sha256 hash of `rawNonce`.
    final rawNonce = generateNonce();
    final nonce = sha256ofString(rawNonce);

    // Request credential for the currently signed in Apple account.
    final appleCredential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
      nonce: nonce,
    );

    // Create an `OAuthCredential` from the credential returned by Apple.
    final oauthCredential = OAuthProvider("apple.com").credential(
      idToken: appleCredential.identityToken,
      rawNonce: rawNonce,
    );

    // Sign in the user with Firebase. If the nonce we generated earlier does
    // not match the nonce in `appleCredential.identityToken`, sign in will fail.
    return await FirebaseAuth.instance.signInWithCredential(oauthCredential);
  }
}
```

## Sign in with Apple Button

{{< file "flutter" "login.dart" >}}
```dart
    FutureBuilder<Object>(
        future: SignInWithApple.isAvailable(),
        builder: (context, snapshot) {
        if (snapshot.data == true) {
            return SignInWithAppleButton(
            onPressed: () {
                AuthService().signInWithApple();
            },
            );
        } else {
            return Container();
        }
        },
    ),
```


## Additional Resources

Have a web app too? You might also be interested in watching [Apple Sign In for Firebase web apps](https://fireship.io/lessons/apple-signin-with-firebase-tutorial/) tutorial as well.
