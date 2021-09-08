---
title: Using the Google Calendar API
lastmod: 2018-09-24T17:55:33-07:00
publishdate: 2018-09-24T17:55:33-07:00
author: Jeff Delaney
draft: false
description: Authorize users to retrieve and create Google Calendar events.   
tags: 
    - pro
    - google-calendar
    - firebase


youtube: Bj15-6rBHQw
github: https://github.com/AngularFirebase/138-google-calendar-firebase-auth
pro: true
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---

I use Google Calendar almost every day and really appreciate apps that can coordinate important events for me automatically. Today, we'll learn how to integrate [Google's JavaScript API client](https://developers.google.com/api-client-library/javascript/start/start-js) with [Firebase](https://firebase.google.com/docs/auth/web/google-signin) to make authenticated requests to the Calendar API on the behalf of a user. This article was inspired by the real-world requirements of a [Broadway Life](https://broadway.life), a tour company in NYC and needs to perform full CRUD operations on their clients' calendar. 


{{< figure src="img/google-calendar-firebase-demo.gif" caption="Using Google Calendar with Firebase" >}}

Not using AngularFire? [How to Use Google APIs with Firebase Auth](/snippets/how-to-use-google-apis-or-gapi-with-firebase-auth/) for the Firebase SDK and vanilla JS instructions.  

## Initial Setup

The following guide assumes you're working from an Angular app with Firebase and [AngularFire](https://github.com/angular/angularfire2) installed. 

Google APIs are RESTful and can be accessed with the [Google API Client Libraries](https://developers.google.com/api-client-library/javascript/reference/referencedocs), or *gapi* for short. By default, Firebase gives us read-only access the user's Google+ account and nothing else, so that leaves us with two main options when working with additional Google APIs in Firebase. 

Option A - Authenticate with *gapi*, then login to Firebase manually with the resulting ID token (JSON web token). This requires us to include an extra JS script, but it will manage access tokens automatically. 

Option B - Login with with the Firebase *GoogleAuthProvider* and add additional scopes. This will grant us permission, but we will need to manage access and refresh tokens manually.

We will be using **Option A** in ths guide and it is likely the better option if making frequent requests to Google APIs. 

### Add the Script Google APIs Tag

First, add the gapi script tag to the head of your `index.html` to make it globally available. 

```html
<head>
    <!-- omitted... -->
    <script src="https://apis.google.com/js/api.js" type="text/javascript"></script>
</head>
```


## Authenticate with the Calendar API Scope

The following section will (1) initialize the *gapi* client (2) login the user with the permission to manage their calendar. 

```shell
ng generate service auth
```

### Initialize gapi

I repeat, we will use *gapi* for the initial login then pass the JWT back to Firebase. From the user's perspective the login process is identical, we just need to make sure to add the proper API keys and scopes. 

A [scope](https://developers.google.com/identity/protocols/googlescopes#calendarv3) is like a "security clearance" the user grants to your app. Every API defines a unique set of scopes and you should only request the bare minimum of what your app needs.

The code below defines our AngularFire `user$` Observable and initializes the API client. 

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  user$: Observable<firebase.User>; 
  calendarItems: any[];

  constructor(public afAuth: AngularFireAuth) { 
    this.initClient();
    this.user$ = afAuth.authState;
  }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'YOUR_FIREBASE_API_KEY',
        clientId: 'YOUR_OAUTH2_CLIENTID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

    });
  }
}
```

<p class="tip">You might have noticed that we opted-out of TypeScript for gapi. This is not ideal, but it is possible to [install community-maintained types for gapi](/snippets/how-to-use-google-apis-or-gapi-with-firebase-auth/#Optional-How-to-use-Type-Definitions-with-Google-APIs).</p>

### Login with Google, then Firebase Manually

The method below uses *gapi* to trigger the login popup window. After the user is logged in,we take the JWT and pass it Firebase. Now we have an logged-in Firebase and access to manage their calendar events. 

```typescript
async login() {
  const googleAuth = gapi.auth2.getAuthInstance()
  const googleUser = await googleAuth.signIn();

  const token = googleUser.getAuthResponse().id_token;

  console.log(googleUser)

  const credential = auth.GoogleAuthProvider.credential(token);

  await this.afAuth.signInAndRetrieveDataWithCredential(credential);


  // Alternative approach, use the Firebase login with scopes and make RESTful API calls
  // const provider = new auth.GoogleAuthProvider()
  // provider.addScope('https://www.googleapis.com/auth/calendar');
  // this.afAuth.signInWithPopup(provider)
  
}

logout() {
  this.afAuth.signOut();
}
```

When the user logs in for the first time, you should see a consent screen that looks something like this. Make sure it includes the additional scopes you specified. 

{{< figure src="img/firebase-auth-custom-scope.png" caption="Additional scopes requested for firebase auth" >}}

## Using the Calendar API

All of the authentication logic is done. Now we just need to use *gapi* to make requests to the calendar API. You can find out which methods are available in the [Google API reference](https://developers.google.com/identity/sign-in/web/reference) and the [Calendar API reference](https://developers.google.com/calendar/). 

### Retrieve Calendar Events

The first request is for the last 10 calendar events scheduled in the future.  We can set the result as a property on the service to share it across multiple components if necessary. 

```typescript
  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    })

    console.log(events)

    this.calendarItems = events.result.items;
  
  }
```

### Create or Update Calendar Events

Adding a new event is just as easy - it's really just a matter of adding the necessary values to the request, then *awaiting* the response. 

```typescript
async insertEvent() {
  const insert = await gapi.client.calendar.events.insert({
    calendarId: 'primary',
    start: {
      dateTime: hoursFromNow(2),
      timeZone: 'America/Los_Angeles'
    }, 
    end: {
      dateTime: hoursFromNow(3),
      timeZone: 'America/Los_Angeles'
    }, 
    summary: 'Have Fun!!!',
    description: 'Do some cool stuff and have a fun time doing it'
  })

  await this.getCalendar();
}

// ... helper function

const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();
```

## Using the Service

The final step is to put the the service to use in an Angular component. 

### Step One - Inject the Service

Inject the service into any component that needs it. 

```typescript
import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component(...)
export class AppComponent {
  constructor(public auth: AuthService) {}
}
```

### Step Two - Bind the Data

Call the login method from the component, unwrap the user Observable, and bind the data the HTML. 

```html
<div *ngIf="auth.user$ | async as user">
    <h3>Logged in as {{ user.displayName }}</h3>
    <img src="{{ user.photoURL }}" width="50px">
    <button (click)="auth.logout()">Logout</button>

    <button (click)="auth.getCalendar()">Get Google Calendar</button>
    <button (click)="auth.insertEvent()">Add Event</button>

    <div *ngFor="let item of auth.calendarItems">
        <h3>{{ item.summary }} - {{ item.status }}</h3>
        <p><em>Created {{ item.created }}</em></p>
        <p>{{ item.description }}</p>
    </div>
</div>

<button (click)="auth.login()">Login with Google</button>
```

## The End

The Google Calendar API is great, but there is a far more powerful element to this lesson - you now have a foundation for using any of the hundreds of APIs that live in the Google ecosystem. Many these APIs are essential for building B2B software products that manage a user's resources on tools like Adwords, Analytics, GSuite, Maps, GCP, and [more](https://developers.google.com/products/develop/). 