---
title: Deploy Ionic Android to Google Play
lastmod: 2018-09-12T18:29:56-07:00
publishdate: 2018-09-12T18:29:56-07:00
author: Jeff Delaney
draft: false
description: Build, sign, and deploy an Ionic Android app step-by-step
tags: 
    - ionic
    - android

# youtube: 
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

The final steps of building, packaging, and deploying an Ionic Android app can often be the most painful. The following guide explains how to build and sign the Android package (APK) suitable for upload to the Google Play Store.

## Step-by-Step Ionic 4 Android Build Process

All Android apps must be [digitally signed](https://developer.android.com/studio/publish/app-signing) before they can be installed on a real device or uploaded to Google Play. This can be a major source of confusion in hybrid development, so let's walk through it step-by-step. 

<p class="tip">This guide was created using MacOS. The steps on Windows and Linux will be similar, but please report any issues in the comments.</p>

### Step 1 - Run a Production Build

First, we need to bundle our web code and prepare the assets as a native package. 

```shell
ionic cordova build android --prod --release
```

### Step 2 - Generate a Keystore

A keystore is just a binary file that holds the private keys needed to sign the app. Make sure to keep it safe because you need it to update your future releases of your app. Its purpose is to keep your app safe from malicious updates. 

```shell
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
```

You should see `my-release-key.keystore` in the root of your project

### Step 3 - Sign the APK

You should have a an unsigned APK located in `platforms/android/app/build/outputs/apk/release/` in your Ionic project. Let's use the keystore from step 2 to sign the APK. 

```shell
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk my-alias
```

### Step 4 - Figure out your build tools path

We need to use the Android CLI [build tools](https://developer.android.com/studio/command-line/#tools-build) to finish packaging the app. What is the value of the `ANDROID_HOME` env variable?

```shell
printenv ANDROID_HOME
```

That should give you something like *~/Library/Android/sdk/*. Now we need to find out the version of [build tools](https://developer.android.com/studio/command-line/#tools-build) on our system. 

```shell
ls ~/Library/Android/sdk/build-tools
```

That should give you a version number like *28.0.3*.

So replace `{build-tools-path}` with the path to build tools on your machine for the following commands, i.e. *~/Library/Android/sdk/build-tools/28.0.3*

### Step 5 - Run zipalign

Next we need to run [zipalign](https://developer.android.com/studio/command-line/zipalign) on the APK.

```shell
{build-tools-path}/zipalign -v 4 android-release-unsigned.apk YourAppName-Release.apk
```

### Step 6 - Verify the Signature

The final step is to verify the signature on the APK with [apksigner](https://developer.android.com/studio/command-line/apksigner).

```shell
{build-tools-path}/apksigner verify YourAppName-Release.apk
```

The final result should look like the image below (focus on the green files), giving you an APK ready for release on Google Play 


{{< figure src="/img/snippets/android-ionic-apk-build.png" caption="Signed APK in Ionic with keystore" >}}