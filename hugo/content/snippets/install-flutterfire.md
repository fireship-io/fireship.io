---
title: Flutter Firebase App Setup
lastmod: 2019-01-12T10:13:59-07:00
publishdate: 2019-01-12T10:13:59-07:00
author: Jeff Delaney
draft: false
description: How to setup and configure a new app with FlutterFire for Auth, Firestore, and Analytics
tags: 
    - dart
    - flutter
    - firebase

youtube: 
type: lessons 
---

The following guide is designed to get you up and running with Flutter and Firebase on both iOS and Android.

{{% box icon="scroll" class="box-blue" %}}
Refer the the [official FlutterFire setup instructions](https://firebase.google.com/docs/flutter/setup). 
{{% /box %}}


## Create your Flutter App

Create your app and open it in your IDE (VS Code).

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
flutter create my_app
code my_app
{{< /highlight >}}

### Install Dependencies

Below are the dependencies you will need for most FlutterFire apps, assuming you are using Firestore and Google SignIn. [RxDart](https://pub.dartlang.org/packages/rxdart) is optional, but highly recommended for working with realtime data sources in Firebase. 

{{< file "yaml" "pubspec.yaml" >}}
{{< highlight yaml >}}
dependencies:
  flutter:
    sdk: flutter

  firebase_core: ^0.2.5
  firebase_analytics: ^1.0.4

  cloud_firestore: ^0.8.2+3

  firebase_auth:  ^0.6.6
  google_sign_in: ^3.2.4

  rxdart: 0.20.0 # optional, but recommended
{{< /highlight >}}


## Android Setup

### Project ID and SHA1 Certificate

First, you need to decide on a project ID for your app using the following pattern `<com>.<brand>.<app>`. For example, the app for Fireship would be `io.fireship.lessonapp`. 

Next, generate an SHA1 certificate to allow Firebase to provision an OAuth2 client and API key when using Google Sign-in and/or dynamic links. 

Mac/Linux users can use the command below. Windows users refer the the [official instructions](https://developers.google.com/android/guides/client-auth). 

{{< file "terminal" "command line" >}}
{{< highlight terminal >}}
keytool -exportcert -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore

# password: android
{{< /highlight >}}

{{< figure src="/img/snippets/sha1-android.png" alt="obtain the sha1 certificate for android firebase" >}}


### Download and save the google-services.json

Next, go to the Firebase Console and register your app by clicking *Add Firebase to your app Android*. Enter your project ID and SHA1 certificate from the previous step.

 Download the *google-services.json* file to the `android/app` directory. At this point, you can skip all remaining steps in the Firebase console (Flutter does this stuff automatically).

{{< figure src="/img/snippets/android-flutter-file-dir.png" alt="google services location in flutter project" >}}

### Update the build.gradle files

Now we need to register our Google services in the Gradle build files. 

{{< file "gradle" "android/build.gradle" >}}
{{< highlight gradle >}}
buildscript {
   dependencies {
       // ...
       classpath 'com.google.gms:google-services:3.2.1'   // <-- here
   }
}
{{< /highlight >}}

Next, update your project ID and register the Google services plugin at the bottom of gradle build file in the app directory. 

{{< file "gradle" "android/app/build.gradle" >}}
{{< highlight gradle >}}
    defaultConfig {
        applicationId "io.fireship.lessonapp" // <-- update this line
        minSdkVersion 21 // <-- you might also need to change this to 21
        // ...
    }

// ... bottom of file
apply plugin: 'com.google.gms.google-services' // <-- add
{{< /highlight >}}

That's it. Try executing `flutter run` with an Android device emulated or plugged-in to verify the setup worked. 

## iOS Setup

The iOS setup is less tedious and can be completed in one step. 

### Register and Download the GoogleService-Info.plist
Click *add your app to iOS* then download the `GoogleService-Info.plist` file into the `ios/Runner/Runner` directory.  

{{< figure src="/img/snippets/flutterfire-ios-add.png" alt="add ios to your flutterfire project" >}}



## Troubleshooting

At this point, you should be able to serve the app by running `flutter run`. 

- Run `flutter doctor` and resolve any detected issues
- Open the app in Android Studio or XCode and build it. Inspect the logs. 
- If your app crashes at startup without logs it may be because you changed the id in the *AndroidManifest.xml* file. Look at this [Github issue](https://github.com/flutter/flutter/issues/13762#issuecomment-399450334) 