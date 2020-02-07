---
title: Firebase Analytics for the Web
lastmod: 2019-10-03T13:08:58-07:00
publishdate: 2019-10-03T13:08:58-07:00
author: Jeff Delaney
draft: false
description: Customize your app's UI/UX with Firebase Analytics and Remote Config in a Progressive Web App
tags: 
    - firebase
    - analytics
    - javascript

youtube: iVHRy_uVtm0
# github: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Firebase recently announced support for [Analytics](https://firebase.google.com/docs/analytics) and [Remote Config](https://firebase.google.com/docs/remote-config) on the web. When combined, these services make it possible to customize the UI/UX of your app based on data collected from Google Analytics. The following lesson will show you how to collect Google Analytics events and user properties, then read aggregated data in your app to customize the experience for a specific audience.

## Initial Setup

Firebase Analytics was added to the JavaScript SDK in version 7.0.0. If you have an existing app, follow the [official setup guide](https://firebase.google.com/docs/analytics/get-started#before_you_begin). If working with a framework like Angular, React, etc, you will likely need to update your NPM package:

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm install firebase@latest
{{< /highlight >}}

And make sure the web config in your application contains the new *measurementId* field and calls `firebase.analytics()` on initialization, for example:

{{< file "typescript" "app.ts" >}}
{{< highlight typescript >}}
const firebaseConfig = {
// ... other fields
measurementId: 'G-XXXXXXXXXX'
};
// Initialize Firebase
import * as firebase from 'firebase/app';
firebase.initializeApp(firebaseConfig);
firebase.analytics();
{{< /highlight >}}

## Collect Data with Firebase Analytics

Firebase will collect data automatically by simply including the analytics package in your app bundle. The default data is useful, but optimizing your analytics for a sales funnel or custom UI will likely require a custom integration. 

### Events

[Events](https://firebase.google.com/docs/analytics/events) are critical to any good analytics dataset because they provide insight into how users interact with your app. Google provides a variety of [built-in events](https://developers.google.com/gtagjs/reference/event), but you can also create your own custom events as shown below. 

{{< highlight typescript >}}
const analytics = firebase.analytics();

function onNewGame() {
    // do something
    analytics.logEvent('start_game')

    analytics.logEvent('start_game', { level: '10', difficulty: 'expert' })
}
{{< /highlight >}}

Optional: You can then find this event on the Firebase Console and click *parameter reporting*, then select the custom params you'd like to see reported:

{{< figure src="img/analytics-param.png" caption="Reporting for Google Analytics params on custom events" >}}

### User Properties

User properties make it possible to segment or filter your users into smaller groups.

In the example below, we look at the [custom claims](/lessons/firebase-custom-claims-role-based-auth/) on the user's auth record and set an user property accordingly. 

{{< highlight typescript >}}
const analytics = firebase.analytics();

firebase.auth().onIdTokenChanged(user => {
  if (user) {
    analytics.setUserId(user.uid);
    analytics.setUserProperties({ level: user.claims.level });
  }
});
{{< /highlight >}}


## Remote Config

[Remote config](https://firebase.google.com/docs/remote-config/use-config-web) is a service that can fetch key-value pairs from Firebase that contain values related Google Analytics and the current user session. This allows you to change the appearance of the UI based on they behavior of the user without making direct code changes your code. 

### Create Parameters

Remote Config parameters are key-value pairs, but the value is assigned based on a condition you define based on the user's Google Analytics data. You might create parameters that activate based on geographic location, device, audience segment, and more. Create a parameter from the Firebase console. 

{{< figure src="img/analytics-remote-config.png" caption="Example of a Firebase Remote Config Parameter" >}}


### Access Remote Config Properties

Using the JavaScript SDK, make a reference to remote config, then use typesafe getters to access the parameters for the current user session. 

{{< highlight typescript >}}
const remoteConfig = firebase.remoteConfig();

remoteConfig.settings = {
minimumFetchIntervalMillis: 3600000,
};

// Set a default value if it cannot be fetched

remoteConfig.defaultConfig = ({
'coolParam': '',
});

await remoteConfig.fetchAndActivate();

// Use these values in your app to customize the UI

const coolParam = remoteConfig.getString('something_cool');

console.log(coolParam);

{{< /highlight >}}


