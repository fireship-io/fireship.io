---
title: Firebase Performance Quickstart
lastmod: 2019-05-09T15:45:01-07:00
publishdate: 2019-05-09T15:45:01-07:00
author: Jeff Delaney
draft: false
description: Learn how to get up and running with Firebase Performance in an Angular app. 
tags: 
    - firebase
    - performance
    - angular

youtube: KYYjdWSrRjI
github: https://github.com/fireship-io/184-firebase-performance-web
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

Firebase [announced Performance Monitoring](https://firebase.googleblog.com/2019/05/whats-new-Google-IO-2019.html) for the Web at Google I/O 2019 - a long-awaited feature for Progressive Web Apps. It provides a simple way to add robust performance analytics to your app with minimal effort, while also adding the ability to run custom traces in your code. In the following lesson, you will learn how to add this new tool to any web app and setup traces to find performance bottlenecks.

## Initial Setup

The following demo uses Angular, but the principles apply to any frontend JavaScript web app - checkout the [official guide](https://firebase.google.com/docs/perf-mon/get-started-web) for setup instructions in non-Angular projects. By simplying including the performance package in your app you will receive metrics related to page load and HTTP performance. 

{{< box icon="scroll" class="box-blue" >}}
Keep in mind, you can use Firebase Performance as a standalone service without any other Firebase dependencies. In this case, you would want to load the lightweight script via the CDN as described in docs.  
{{< /box >}}

At the time of this article, performance in [AngularFire](https://github.com/angular/angularfire2) is available under the *next* tag.  

{{< file "terminal" "command line" >}}
{{< highlight text >}}
npm i firebase
npm i @angular/fire@next
{{< /highlight >}}


Grab your Firebase config from the console, then initialize AngularFire & Firebase in Angular. 

{{< figure src="img/config-fireperf.png" caption="Make sure you have the new Firebase config object with an appId property" >}}

{{< file "ngts" "app.module.ts" >}}
{{< highlight typescript >}}
const firebaseConfig = {
    // ...firebase config
  appId: '1:xxxxxxxxxxxxxxxx'  // <-- make sure you have this field
};

import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirePerformanceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
{{< /highlight >}}




### Track Page Load Metrics

Just sit back and relax. Firebase will automatically collect the same page load stats you can find locally in a [Chrome Lighthouse](https://developers.google.com/web/tools/lighthouse/) audit, but will be segmented by region, device, browser, and can even tell you if a service worker is installed.  In addition, you can view the latency and payload size of any HTTP request that flows through your app. 

{{< figure src="img/firebase-performance-time.png" caption="Firebase Performance will automatically track page loads stats" >}}

## User Login

A common use-case for a custom trace is your user authentication flow. Failing to get a user logged in or signed up quickly is a good recipe to bounce them forever. 

{{< box icon="scroll" class="box-blue" >}}
#### What is the difference between an Attribute and a Metric?

An attribute is a string value segments data on the Firebase console. A metric is a numeric value that can be charted and might change over the lifecycle of the trace - in other words, a metric is a value that you want to measure over time.
{{< /box >}}



### Trace Login Time

For example, **How long does it take the average user to get logged in?**. But we don't have to stop there - we can also add custom attributes to segmenent reports based on custom data attributes and trace specific errors that happen during the login process. 

{{< file "ngts" "login.component.ts" >}}
{{< highlight typescript >}}
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
const perf = firebase.performance();

@Component(...)
export class LoginComponent {

  constructor(private afAuth: AngularFireAuth) {}

  async login(email, pass) {
    const trace = perf.trace('userLogin');
    trace.start();

    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, pass);

      trace.putAttribute('verified', `${credential.user.emailVerified}`);
      trace.stop();

    } catch (err) {
      trace.putAttribute('errorCode', err.code);
      trace.stop();
    }

  }

}

{{< /highlight >}}

{{< figure src="img/login-perf.png" caption="Metrics related to the user login process" >}}

### Trace Lifecycle Hooks

On iOS and Android, Firebase runs a screen trace to measure the lifetime of a screen detect frozen screens. You can use lifecycle hooks in your preferred framework to get similar results on the web. Here's how we can archive this in Angular:

{{< file "ngts" "login.component.ts" >}}
{{< highlight typescript >}}
export class LoginComponent implements OnInit, OnDestroy {

  screenTrace: firebase.performance.Trace;


  ngOnInit() {
    this.screenTrace = perf.trace('loginScreen');
    this.screenTrace.start();
  }

  ngOnDestroy() {
    this.screenTrace.stop();
  }
{{< /highlight >}}

## Firestore

Firebase Perf can also be very useful when it comes understanding database performance. 

### Trace Read Latency and Quantity

**How many documents did I read in a collection and how long did it take?** Normally, you should have a `limit` set on your queries to avoid excessive reads in large collections, but this is not always possible. The `incrementMetric` method is especially useful if you want to keep a running count of a value during the trace. 


{{< file "ngts" "some.component.ts" >}}
{{< highlight typescript >}}
  async loadUserData() {
    const trace = perf.trace('itemsQuery');

    const items = await this.db.collection('items').get();
    trace.incrementMetric('collectionSize', items.size);

    const things = await this.db.collection('things').get();
    trace.incrementMetric('collectionSize', things.size);

    trace.stop();
  }
{{< /highlight >}}

### AngularFire Performance with RxJS

In this section, we will take an early look at some of the custom RxJS pipes proposed for the [@angular/fire](https://github.com/angular/angularfire2) package. By simply adding the `trace` pipe we can start/stop a trace after an Observable emits data. 

{{< file "ngts" "items.component.ts" >}}
{{< highlight typescript >}}
export class ItemsComponent implements OnInit {

  constructor(private perf: AngularFirePerformance, private db: AngularFirestore) { }

  items;
  

  ngOnInit() {
    
    this.items = this.db.collection('items').snapshotChanges()
      .pipe(

        // Custom RxJS Operator
        this.perf.trace('itemsQuery')

      );

  }

}
{{< /highlight >}}

## Other Ideas for Performance Monitoring

Firebase Performance can be used for almost any feature you suspect might be a bottleneck that hurts the user experience. Here is a short list of additional areas you may want to consider for performance monitoring. 

- Complex API Calls (Beyond the automatic traces on HTTP calls)
- Firebase Storage Uploads & Downloads
- Component Routing and Rendering
- Use `trace.record()` to monitor activity on specific time intervals. 


