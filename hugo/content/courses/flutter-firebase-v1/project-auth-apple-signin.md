---
title: Sign In with Apple
description: Sign in with Apple on Flutter & Firebase to comply with the latest iOS requirements
weight: 35
lastmod: 2021-11-11T10:23:30-09:00
draft: false
free: true
emoji: 🍎
vimeo: 407359402
video_length: 4:28
---

🚨 As of April 2020, all native iOS apps that offer social auth methods (Google, Facebook, etc.) MUST also include Apple Sign In as an option. See the official [guidance from Apple](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple). 

## Sign in with Apple Setup

Follow the steps outlined below to implement [Sign In with Apple](https://developer.apple.com/sign-in-with-apple/) in a Flutter iOS app.

This section assumes that you are an Apple Developer member and have an existing team account linked to your iOS app. 

### Step 1 - Add the Capability in Xcode

Add the *Sign In with Apple* capability from Xcode. Make sure to include it on all your build types. 

{{< figure src="/courses/flutter-firebase/img/signin-apple-capability-xcode.png" caption="Add the Sign In with Apple Capability in Xcode" >}}

### Step 2 - Enable it in Firebase

Enable the *Apple* authentication method in Firebase. Do not worry about the OAuth flow, it is only required for web apps. 

{{< figure src="/courses/flutter-firebase/img/apple-signin-firebase.png" caption="Enable Apple on the Firebase Authentication tab" >}}


## Install apple_sign_in

Install the [apple_sign_in](https://pub.dev/packages/apple_sign_in) package in your project (and of course [firebase_auth](https://pub.dev/packages/firebase_auth)).


## Auth Service

The auth service provides an `appleSignIn` method that will trigger a dialog for the user to authenticate with their Apple ID. After the user signs in with Apple, the resulting token is used to create an `AuthCredential` for to sign in as `FirebaseUser`. 

{{< file "dart" "auth.dart" >}}
```dart
import 'package:apple_sign_in/apple_sign_in.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {

  // Determine if Apple SignIn is available
  Future<bool> get appleSignInAvailable => AppleSignIn.isAvailable();

  /// Sign in with Apple
  Future<FirebaseUser> appleSignIn() async {
    try {

      final AuthorizationResult appleResult = await AppleSignIn.performRequests([
        AppleIdRequest(requestedScopes: [Scope.email, Scope.fullName])
      ]);

      if (appleResult.error != null) {
        // handle errors from Apple here
      }

      final AuthCredential credential = OAuthProvider(providerId: 'apple.com').getCredential(
        accessToken: String.fromCharCodes(appleResult.credential.authorizationCode),
        idToken: String.fromCharCodes(appleResult.credential.identityToken),
      );

      AuthResult firebaseResult = await _auth.signInWithCredential(credential);
      FirebaseUser user = firebaseResult.user;

      // Optional, Update user data in Firestore
      updateUserData(user);

      return user;
    } catch (error) {
      print(error);
      return null;
    }
  }
}
```

# Example of Apple Sign In Button

We should only show the Sign In with Apple button when it's available on the device. Use a `FutureBuilder` to check availability, then show the prebuilt button from the apple_sign_in package. 

{{< file "dart" "login.dart" >}}
```dart
import 'package:apple_sign_in/apple_sign_in.dart';

AuthService auth = AuthService();

FutureBuilder(
    future: auth.appleSignInAvailable,
    builder: (context, snapshot) {
    
    if (snapshot.data == true) {
        return AppleSignInButton(
          onPressed: () async { 
            FirebaseUser user = await auth.appleSignIn();
            if (user != null) {
              Navigator.pushReplacementNamed(context, '/topics');
            }
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

[Code with Andrea](https://codewithandrea.com/videos/2020-01-20-apple-sign-in-flutter-firebase/) also provides an excellent tutorial for Apple Sign In.  