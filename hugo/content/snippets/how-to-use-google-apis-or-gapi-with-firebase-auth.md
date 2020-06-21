---
title: How to Use Google APIs on the Web
publishdate: 2018-09-22T23:12:09-07:00
lastmod: 2018-09-22T14:25:09-07:00
draft: false
author: Jeff Delaney
description: Access Google APIs from Firebase with the gapi client library. 
tags:
  - firebase
  - auth
  - javascript
---

For a full Angular example, make sure to watch the [Google Calendar Lesson](/lessons/google-calendar-api-with-firebase). 


Firebase auth is great because we can signup and login users with a single line of code, but it is limited to readonly access on the user's Google profile. It does NOT provide OAuth2 scopes to other Google services like Calendar, Adwords, Drive, GCP, GSuite, and dozens more.

We can overcome this limitation by using [Google's JavaScript API client](https://developers.google.com/api-client-library/javascript/features/authentication) to authenticate the user with additional scopes, then sign in manually with Firebase. 

The snippet below will show you how to wrap Google Web Auth with Firebase to customize the Google APIs you can access on behalf of the user. 

<p class="tip">This snippet assumes that you already have Firebase initialized in your project with Google OAuth enabled.</p>

## Optional - How to use Type Definitions with Google APIs

The google API client library is a big complex collection of tools, so you definitely want them strong typed. There are different type definitions to install for different APIs (some of which don't work well), but here's the most basic example. 

```shell
npm install --save @types/gapi
```

Add the types to your `tsconfig.json` 

```json
{
  "compilerOptions": {
    "types": [
      "gapi", 
    ]
  }
}
```

Now you can use the types explicitly in one of your app files. 

```typescript
/// <reference path="../../node_modules/@types/gapi/index.d.ts" />
declare var gapi;
```


## Step 1 - Initialize the Google API JavaScript Library

First, we need to make the Google API client available in our application. Add the following script to your HTML document. 

```html
<head>
    <!-- omitted... -->
    <script src="https://apis.google.com/js/api.js" type="text/javascript"></script>
</head>
```

There are four variables we need to initialize the gapi client. 

- apiKey - Project web API Key from the Firebase console
- clientId - Web OAuth 2.0 Client ID found on the [GCP Console](https://console.cloud.google.com/apis/credentials/) under API credentials
- discoveryDocs - Discovery doc URL for the API being used. 
- scope - The API scopes we want access to. These vary based on the API, but you can get a [full listing here](https://developers.google.com/identity/protocols/googlescopes). 

Now run this script to initialize the client

```js
gapi.load('client', () => {
  console.log('loaded client')

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/some-api'],
    scope: 'https://www.googleapis.com/auth/some.scope'
  })
})
```

<p class="tip">You will need to whitelist your localhost port for development on the clientId. This can be done by clicking on the client ID in the GCP console.</p>

<img class="content-image" src="/images/gcp-authorize-url.png" alt="Whitelist dev url for oauth token" /> 



## Step 2 - Login in the User

A user must be logged in and grant permission for the API scopes you have requested. The user will first login with Google's Client Library, then we'll pass off the ID token Firebase. 


```js
async login() {
  const googleAuth = gapi.auth2.getAuthInstance()
  const googleUser = await googleAuth.signIn();

  const token = googleUser.getAuthResponse().id_token;

  const credential = firebase.auth.GoogleAuthProvider.credential(token);

  await firebase.auth().signInAndRetrieveDataWithCredential(credential);
}
```

Firing this method will log the user into Google with a popup window, then [manually sign in the user to Firebase](https://firebase.google.com/docs/auth/web/google-signin#advanced-handle-the-sign-in-flow-manually) with the resulting ID token. 

### Access Token vs ID Token

A common source of confusion is the difference between an *Access Token* and an *ID Token*, both of which are returned when we call `googleUser.getAuthResponse()`. 

- The Access Token is a short-lived token used to make authenticated requests to Google APIs. 
- The ID Token is JSON Web Token used to identify the user and its auth claims/data. 

In our case, we use the *ID* token to authenticate the user into Firebase. We use the *Access* Token to make requests to whatever APIs the user gave us access to. Do not save these in your database because they are managed by the SDKs for you automatically.

## Step 3 - Make Authenticated Requests to Google APIs 

The user is now authenticated and we have an Access Token (you don't actually need to do anything with it or know its value) that can be used to make API requests. The process will differ based on your API the user gave you permission to, but a basic example with Google calendar looks like this:

```js
const events = await gapi.client.calendar.events.list({
  calendarId: 'primary',
})
```

Pretty simple, right? That's because *gapi* has the current user context and automatically sends the access token to the API. You now have the power to access Google APIs on behalf of your Firebase users - the possibilities are endless. 