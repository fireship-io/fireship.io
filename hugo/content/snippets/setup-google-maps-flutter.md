---
title: Flutter Google Maps Setup
lastmod: 2019-01-12T10:13:59-07:00
publishdate: 2019-01-12T10:13:59-07:00
author: Jeff Delaney
draft: false
description: Setup a Flutter app with Google Maps and GPS Location Tracking
tags: 
    - flutter
    - google-maps

youtube: 
---

The following guide is designed to get you up and running with Google Maps in Flutter for iOS and Android, as well as device GPS tracking. 

{{< box icon="scroll" class="box-blue" >}}
Also refer to the [official Flutter Google Maps Plugin setup docs](https://pub.dartlang.org/packages/google_maps_flutter) as needed. 
{{< /box >}}

## Google Maps for Flutter

### Get your Google Maps API Key

First, obtain an [API key for Google Maps](https://cloud.google.com/maps-platform/) within the context of a Google Cloud Platform project. 

{{< figure src="/img/snippets/gmaps-api.png" alt="where to get the Google maps API key on the gcp console" >}}

### <i>{{< partial "svg/apple.svg" >}}</i> iOS Setup

{{< file "cog" "ios/Runner/AppDelegate.m" >}}
{{< highlight text >}}
#include "AppDelegate.h"
#include "GeneratedPluginRegistrant.h"
#import "GoogleMaps/GoogleMaps.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [GMSServices provideAPIKey:@"YOUR KEY HERE"];
  [GeneratedPluginRegistrant registerWithRegistry:self];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
@end
{{< /highlight >}}

{{< file "cog" "ios/Runner/AppDelegate.swift" >}}
{{< highlight text >}}
import UIKit
import Flutter
import GoogleMaps

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?
  ) -> Bool {
    GMSServices.provideAPIKey("YOUR KEY HERE")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
{{< /highlight >}}

Then define the following key-value pair in the Info.plist

{{< file "cog" "ios/Runner/Info.plist " >}}
{{< highlight html >}}
<key>io.flutter.embedded_views_preview</key>
<true/>
{{< /highlight >}}


### <i>{{< partial "svg/android.svg" >}}</i> Android Setup



{{< file "cog" "android/app/src/main/AndroidManifest.xml" >}}
{{< highlight html >}}
<manifest ...
  <application ...
    <meta-data android:name="com.google.android.geo.API_KEY"
               android:value="YOUR API KEY HERE"/>
{{< /highlight >}}

## Tracking GPS Location Data

Many map-based apps use the device location as part of the user experience. Your app must obtain permission from the user to access location services. There are several Flutter packages available for this task, but the setup below is tested with the [location plugin](https://pub.dartlang.org/packages/location). 

### <i>{{< partial "svg/apple.svg" >}}</i> iOS 

Add the permission request details to the Info.plist

{{< file "cog" "ios/Runner/Info.plist " >}}
{{< highlight html >}}
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to location when open.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>This app needs access to location when in the background.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs access to location when open and in the background.</string>
{{< /highlight >}}



### <i>{{< partial "svg/android.svg" >}}</i> Android Setup

Note. The permission below will give access to highly accurate GPS data. If you only need accuracy within a city block change the value to ACCESS_COARSE_LOCATION. 

{{< file "cog" "android/app/src/main/AndroidManifest.xml" >}}
{{< highlight html >}}
<manifest ...
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
{{< /highlight >}}
 

