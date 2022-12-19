---
title: Sign In with Apple on Firebase
lastmod: 2020-04-20T08:41:24-07:00
publishdate: 2020-02-09T08:41:24-07:00
author: Jeff Delaney
draft: false
description: Authenticate users into your Firebase app using Sign In with Apple on the web
tags: 
    - auth
    - ios
    - javascript

type: lessons
youtube: UafqYgRoIC0
# code: 
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions: 
#     - "rxjs": 6.3
---

[Sign in with Apple](https://developer.apple.com/videos/play/wwdc2019/706/) was announced in 2019 and allows users to authenticate into your Firebase app with an Apple ID. Users must have two-factor authentication (2FA) enabled on their Apple account AND be signed into iCloud. 



The following lesson demonstrates how to configure Apple SignIn with the Firebase JavaScript SDK (web). 

🚨 As of April 2020, all native iOS apps that offer social auth methods (Google, Facebook, etc.) MUST also include Apple Sign In as an option. See the detailed [guideline](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple). If you're looking for Flutter, check out this [Sign In with Apple on Flutter](/courses/flutter-firebase/project-auth-apple-signin) section from the full course. 


## Sign in with Apple Setup (Web)

Follow the steps outlined below to implement [Sign In with Apple](https://developer.apple.com/sign-in-with-apple/) in your web app. 

### Step 1 - Create or Update an App ID

From the Apple Developer Portal go to [Certificates, Identifiers & Profiles >> Identifiers](https://help.apple.com/developer-account/#/devcdfbb56a3). Create a new **App ID** or update an existing app and give it the  **Sign In with Apple** capability. 

{{< figure src="/img/snippets/apple-signin-app1.png" alt="Apple Developer Portal App IDs" >}}
{{< figure src="/img/snippets/apple-signin-app2.png" caption="Make sure Sign In with Apple is Enabled" >}}

### Step 2 - Create and Configure a Service ID


From *Certificates, Identifiers & Profiles >> Identifiers*, create a new **Service ID** and make sure it is linked to your primary App ID. Configure it to point to your Firebase hosting URL. 

{{< figure src="/img/snippets/apple-signin-web-config.png" caption="Replace the project ID for your domain" >}}


### Step 3 - Verify Domain Ownership

Go to the Service ID you created in the previous step and click *configure*, then click *download*. Save the file in your web app's public hosting directory under `./well-known/`. 

Deploy this file to your domain so Apple can verify it. 

{{< file "terminal" "command line" >}}
```text
firebase deploy --only hosting
```

{{< figure src="/img/snippets/apple-signin-verify.png" caption="You should see a green checkmark next to the domain" >}}

### Step 4 - Register a Private Key

From *Certificates, Identifiers & Profiles >> Identifiers*, create and download a new private key - keep it private. It is used to validate requests from Apple with your Firebase project. 

{{< figure src="/img/snippets/apple-signin-private-key.png" caption="Download the private key. Do not expose it publicly." >}}


### Step 5 - Enable SignIn Method on Firebase

Head over the to the [Firebase Console](https://console.firebase.google.com/) and go to the *Authentication >> Sign-in Method* tab. Enable Apple and enter the required details.  

{{< figure src="/img/snippets/apple-signin-firebase-console.png" caption="Copy the contents of the private key in the console" >}}


## Frontend Code

We now have all the pieces in place to implement SignIn with Apple into our web app. Because this is Firebase, it only requires a few lines of code. Assuming you have [Firebase installed](/snippets/install-angularfire/) in your project, simply make a reference to the provider and call `signInWithPopup()`.

{{< figure src="/img/snippets/apple-signin-popup.png" caption="SignIn with Apple popup seen by the end-user" >}}

### Basic JavaScript Implementation

The frontend implementation is an async function that can bind to a button click to trigger the popup modal. Make sure to follow [Apple UI guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/) when designing the button. 

{{< file "js" "app.js" >}}
```js
const auth = firebase.auth();

async signInWithApple() {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    const result = await auth.signInWithPopup(provider);

    console.log(result.user); // logged-in Apple user
}
```
