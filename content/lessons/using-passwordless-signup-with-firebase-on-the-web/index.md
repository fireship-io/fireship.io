---
title: Passwordless Signup With Firebase on the Web
lastmod: 2018-03-20T17:25:50-07:00
publishdate: 2018-03-20T17:25:50-07:00
author: Jeff Delaney
draft: false
description: How to implement passwordless email-link authentication with Firebase and Angular
tags: 
    - auth
    - firebase

youtube: Ec7hr2xOjUo
github: https://github.com/AngularFirebase/94-firebase-passwordless-auth
# disable_toc: true
# disable_qna: true

# courses
# step: 0

# versions:
#    rxdart: 0.20
---
Passwordless auth - or [email-link signup](https://firebase.google.com/docs/auth/web/email-link-auth) - is a cool new user authentication option in the Firebase SDK that was released in [v4.12.0 on March 20th, 2018](https://firebase.google.com/support/release-notes/js#4.12.0). Rather than force a user to remember a password, we simply send them an email with a link that creates the [JSON Web Token](https://jwt.io/) when they redirect back to the site. As a user of apps, I see this method quickly replacing traditional passwords and personally find it much more user-friendly.  

In this lesson, you will learn how to onboard new users by creating a frictionless sign-in flow for any progressive web app. Here's how it will look step-by-step. 

1. User enters an email address into our Angular app.
2. Firebase emails the user a login link.
3. The link redirects the user to back our app with an auth code. 

<p class="tip">I'll be writing this code in Angular, but it's all Promise-based and can be easily adapted for Vue, React, or vanilla JS.</p>  

## Step 1 - Initial Setup

This feature is brand new to the Firebase SDK at the time of this post, so make sure your SDK is up to date. 

```shell
npm install firebase@latest --save
```

Let's also generate a new Angular app and login component with the Angular CLI. 

```shell
ng new awesomeApp --routing
ng generate component passwordless-auth
```

### Enable Email Link Sign-In

First, go into the *Authentication* tab on the Firebase console and enable the email-link method. 


{{< figure src="img/firebase-passwordless.png" caption="Enable email link method" >}}

### Setup the Redirect URL

We need a URL to redirect the user after they click the link in their email. In this case, I am routing the component to `http://localhost:4200/login`

```typescript
const routes: Routes = [
  { path: 'login', component: PasswordlessAuthComponent }
];
```

## Step 2 - Send the Email

Now we need to collect the user's email and send them a login link. After clicking the login link, they will be redirected by to the specified URL, at which point we need to sign them in. 

In this example, a single component is used to handle the entire process, but you could break this into separate parts.

```typescript
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'passwordless-auth',
  templateUrl: './passwordless-auth.component.html',
  styleUrls: ['./passwordless-auth.component.scss']
})
export class PasswordlessAuthComponent implements OnInit {
  user: Observable<any>;
  email: string;
  emailSent = false;

  errorMessage: string;

  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.user = this.afAuth.authState;

    const url = this.router.url;

    this.confirmSignIn(url);
  }
}
```

The HTML needs [ngModel](https://angular.io/api/forms/NgModel) from Angular to bind the form value to the component. 

```html
<label for="email" class="label">Passwordless Auth</label><br>
<input type="email" class="input" [(ngModel)]="email">


<button class="button is-primary" 
        [disabled]="emailSent" 
        (click)="sendEmailLink(email)">

        Get Login Link

</button>
```

### Define the Action Code

Now we need to collect the user's email and send them an email. 

<p class="info">Make sure to change the URL value when deploying to production. It would be a good idea to add this to `environment.ts`</p>

```typescript
const actionCodeSettings = {
  // Your redirect URL
  url: 'https://localhost:4200/login', 
  handleCodeInApp: true,
};
```

### Trigger the Email

Now let's define a method that will fire off the email when the user clicks the login button.  Notice how the email address is being saved to `localStorage` - this is necessary to prevent [session fixation attacks](https://en.wikipedia.org/wiki/Session_fixation) where a hacker could intercept the URL and highjack the user session. If the email is missing, we need to prompt the user to enter it again upon redirect.  

<p class="info">Why the async function? (1) We can wrap it in a try/catch block to prevent any Angular concerns about touching the DOM `window` object.</p>

```typescript
async sendEmailLink() {
  const actionCodeSettings = { ...yourSettings }
  try {
    await this.afAuth.sendSignInLinkToEmail(
      this.email,
      actionCodeSettings
    );
    window.localStorage.setItem('emailForSignIn', this.email);
    this.emailSent = true;
  } catch (err) {
    this.errorMessage = err.message;
  }
}
```

If all went according to plan, you should get an email like this in your inbox when triggering the `sendEmailLink` method above. 

Here's how it looks from my Gmail account:

{{< figure src="img/firebase-email-link-auth.png" caption="Auth email sent by Firebase" >}}


## Step 3 - Handle the Link Redirect

The user must return to our site with the same email. Because we saved it to [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) in the previous step, this process should be seamless. But if the user decides to open the link on a different device, it will be necessary for them to re-enter the email with a browser prompt. 

```typescript
  async confirmSignIn(url) {
    try {
      if (this.afAuth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        // Signin user and remove the email localStorage
        const result = await this.afAuth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
```

## The End

I'm really excited to see passwordless auth in Firebase. It is quite popular among Auth0 users and is a very effective way to onboard new users without the hassle and security vulnerabilities of passwords. Let me know if you have questions in comments or on Slack. 